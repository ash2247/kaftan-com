import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeaderFooterEditor from "@/components/admin/HeaderFooterEditor";
import { useToast } from "@/hooks/use-toast";

const AdminHeaderFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (content: any) => {
    setIsSaving(true);
    try {
      // The save functionality is handled inside HeaderFooterEditor
      toast({
        title: "Success",
        description: "Header and footer settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save header and footer settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Header & Footer</h1>
              <p className="text-sm text-muted-foreground">
                Manage navigation menu, footer links, and site settings
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.open("/", "_blank")}
            >
              Preview Site
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <HeaderFooterEditor onSave={handleSave} />
      </div>
    </div>
  );
};

export default AdminHeaderFooter;
