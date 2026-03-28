import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database, Download, Upload, Trash2, RefreshCw, Clock,
  HardDrive, AlertTriangle, CheckCircle, FileText, Shield, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Backup {
  id: string;
  name: string;
  size: number;
  status: string;
  created_at: string;
  created_by: string;
}

const AdminBackup = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState<string | null>(null);
  const [deletingBackup, setDeletingBackup] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();

  // Only fetch backups if authenticated as admin
  useEffect(() => {
    if (isAdmin && !authLoading) {
      fetchBackups();
    }
  }, [isAdmin, authLoading]);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
      return;
    }
  }, [isAdmin, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-body text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!authLoading && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">Access Denied</h1>
            <p className="font-body text-muted-foreground mb-6">
              You don't have permission to access the backup system. Please contact your administrator if you need access.
            </p>
            <div className="space-y-3">
              <a
                href="/admin/login"
                className="block w-full bg-primary text-primary-foreground font-body text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-center"
              >
                Admin Login
              </a>
              <a
                href="/"
                className="block w-full border border-border font-body text-sm px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-center"
              >
                Back to Store
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fetchBackups = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/database-backup`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        
        if (errorText.includes('TABLES_NOT_FOUND')) {
          setSetupRequired(true);
          setError('Backup tables not found. Please run the database migration to create backup tables.');
          setLoading(false);
          return;
        }
        
        if (response.status === 404 || errorText.includes('relation') || errorText.includes('table') || errorText.includes('does not exist')) {
          setSetupRequired(true);
          setError('Database tables not found. Please run manual setup first.');
          return;
        }
        
        if (response.status === 0 || errorText.includes('CORS') || errorText.includes('Failed to fetch')) {
          setSetupRequired(true);
          setError('Cannot connect to backup service. Please ensure function is deployed and tables are set up.');
          return;
        }
        
        throw new Error(errorText || 'Failed to fetch backups');
      }

      const data = await response.json();
      setBackups(data.backups || []);
      setSetupRequired(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching backups:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load backups';
      
      if (errorMessage.includes('relation') || errorMessage.includes('table') || errorMessage.includes('404')) {
        setSetupRequired(true);
        setError('Database tables not found. Setup is required.');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreatingBackup(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/database-backup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create' }),
      });

      if (!response.ok) throw new Error('Failed to create backup');

      const data = await response.json();
      toast.success('Backup created successfully');
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setCreatingBackup(false);
    }
  };

  const downloadBackup = async (backupId: string, backupName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/database-backup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'download', backupId }),
      });

      if (!response.ok) throw new Error('Failed to download backup');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${backupName}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Backup downloaded successfully');
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast.error('Failed to download backup');
    }
  };

  const restoreBackup = async (backupId: string) => {
    setRestoringBackup(backupId);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/database-backup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'restore', backupId }),
      });

      if (!response.ok) throw new Error('Failed to restore backup');

      toast.success('Database restored successfully');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore backup');
    } finally {
      setRestoringBackup(null);
    }
  };

  const deleteBackup = async (backupId: string) => {
    setDeletingBackup(backupId);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/database-backup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', backupId }),
      });

      if (!response.ok) throw new Error('Failed to delete backup');

      toast.success('Backup deleted successfully');
      fetchBackups();
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error('Failed to delete backup');
    } finally {
      setDeletingBackup(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold">Database Backup</h1>
          <p className="text-muted-foreground mt-2">
            Manage database backups, download, and restore your data
          </p>
        </div>
        <Button onClick={createBackup} disabled={creatingBackup || setupRequired} className="gap-2">
          <Database className="w-4 h-4" />
          {creatingBackup ? 'Creating...' : 'Create Backup'}
        </Button>
      </div>

      {setupRequired && (
        <Alert className="border-orange-200 bg-orange-50">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Setup Required:</strong> The backup system needs database tables to be created before it can function.
            <div className="mt-2">
              <Button 
                onClick={() => navigate('/admin/backup/manual-setup')} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Setup Backup System
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && !setupRequired && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div>
                <strong>Error:</strong> {error}
              </div>
              {error.includes('Authentication') && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setError(null);
                      fetchBackups();
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Retry Authentication
                  </Button>
                  <Button 
                    onClick={() => navigate('/admin/login')}
                    variant="outline"
                    size="sm"
                  >
                    Re-login
                  </Button>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!setupRequired && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Restoring a backup will replace all current data. 
            Always create a new backup before restoring to avoid data loss.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSize(backups.reduce((acc, backup) => acc + backup.size, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {backups.length > 0 
                ? formatDistanceToNow(new Date(backups[0].created_at), { addSuffix: true })
                : 'Never'
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>
            View and manage your database backups
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No backups found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first backup to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{backup.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatSize(backup.size)} • 
                        Created {formatDistanceToNow(new Date(backup.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                      {backup.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBackup(backup.id, backup.name)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="w-4 h-4" />
                          Restore
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restore Backup</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to restore this backup? This action will replace all current data and cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed')}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => restoreBackup(backup.id)}
                            disabled={restoringBackup === backup.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {restoringBackup === backup.id ? 'Restoring...' : 'Restore Backup'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Backup</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this backup? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed')}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => deleteBackup(backup.id)}
                            disabled={deletingBackup === backup.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingBackup === backup.id ? 'Deleting...' : 'Delete Backup'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackup;
