import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminBackupSetupRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to manual setup page
    navigate('/admin/backup/manual-setup');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to setup guide...</p>
      </div>
    </div>
  );
};

export default AdminBackupSetupRedirect;
