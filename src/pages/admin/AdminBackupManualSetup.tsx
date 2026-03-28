import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, AlertTriangle, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const AdminBackupManualSetup = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const sqlCode = `-- Create database_backups table
CREATE TABLE IF NOT EXISTS database_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backup_data table
CREATE TABLE IF NOT EXISTS backup_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_id UUID NOT NULL REFERENCES database_backups(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_database_backups_created_at ON database_backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_database_backups_created_by ON database_backups(created_by);
CREATE INDEX IF NOT EXISTS idx_backup_data_backup_id ON backup_data(backup_id);

-- Enable RLS
ALTER TABLE database_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_data ENABLE ROW LEVEL SECURITY;

-- Create function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_database_backups_updated_at ON database_backups;
CREATE TRIGGER update_database_backups_updated_at
  BEFORE UPDATE ON database_backups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for database_backups
DROP POLICY IF EXISTS "Admins can view all backups" ON database_backups;
CREATE POLICY "Admins can view all backups" ON database_backups
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Admins can insert backups" ON database_backups;
CREATE POLICY "Admins can insert backups" ON database_backups
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Admins can update backups" ON database_backups;
CREATE POLICY "Admins can update backups" ON database_backups
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Admins can delete backups" ON database_backups;
CREATE POLICY "Admins can delete backups" ON database_backups
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- RLS policies for backup_data
DROP POLICY IF EXISTS "Admins can view all backup data" ON backup_data;
CREATE POLICY "Admins can view all backup data" ON backup_data
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Admins can insert backup data" ON backup_data;
CREATE POLICY "Admins can insert backup data" ON backup_data
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Admins can delete backup data" ON backup_data;
CREATE POLICY "Admins can delete backup data" ON backup_data
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlCode);
      setCopied(true);
      toast.success('SQL code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold">Manual Backup Setup</h1>
        <p className="text-muted-foreground mt-2">
          Follow these steps to set up the backup system manually
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Manual Setup Required:</strong> You need to run SQL commands in your Supabase dashboard to create the backup tables.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Step 1: Go to Supabase Dashboard
            </CardTitle>
            <CardDescription>
              Navigate to your Supabase project dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">1</div>
                <span>Open <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com/dashboard</a></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">2</div>
                <span>Select your project: <code className="bg-muted px-1 rounded">aggpfzdyspgtwuonkhsc</code></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">3</div>
                <span>Click on "SQL Editor" in the left sidebar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">4</div>
                <span>Click "New query" to open the SQL editor</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Step 2: Copy & Run SQL
            </CardTitle>
            <CardDescription>
              Copy the SQL code and run it in the editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">5</div>
                <span>Click the "Copy SQL" button below</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">6</div>
                <span>Paste the code in the SQL editor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">7</div>
                <span>Click "Run" to execute the SQL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">8</div>
                <span>Wait for "Success" message</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SQL Code</span>
            <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2">
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy SQL'}
            </Button>
          </CardTitle>
          <CardDescription>
            Click "Copy SQL" and paste this code into your Supabase SQL Editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {sqlCode}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Step 3: Verify Setup
          </CardTitle>
          <CardDescription>
            After running the SQL, verify everything is working
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">✓</div>
              <span>Go back to <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/admin/backup')}>Admin Backup</Button></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">✓</div>
              <span>The setup warning should be gone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">✓</div>
              <span>Try creating your first backup</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Button onClick={() => navigate('/admin/backup')} className="w-full">
              Go to Backup Page
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Having trouble?</strong> Make sure you're logged into the correct Supabase account and have admin permissions for the project.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminBackupManualSetup;
