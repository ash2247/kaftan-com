import { useState, useEffect } from "react";
import { settingsService, StoreSettings } from "@/lib/settingsService";

export const useCollectionSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const getGridClasses = () => {
    if (!settings) {
      // Default grid classes if settings not loaded
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }

    const mobile = settings.collection_grid_mobile || 2;
    const tablet = settings.collection_grid_tablet || 3;
    const desktop = settings.collection_grid_desktop || 4;

    // Build grid classes based on settings
    let classes = "grid";
    
    // Mobile columns (default: 2)
    if (mobile === 1) {
      classes += " grid-cols-1";
    } else {
      classes += " grid-cols-2";
    }
    
    // Tablet columns (md breakpoint)
    if (tablet === 2) {
      classes += " md:grid-cols-2";
    } else if (tablet === 3) {
      classes += " md:grid-cols-3";
    } else if (tablet === 4) {
      classes += " md:grid-cols-4";
    }
    
    // Desktop columns (lg breakpoint)
    if (desktop === 3) {
      classes += " lg:grid-cols-3";
    } else if (desktop === 4) {
      classes += " lg:grid-cols-4";
    } else if (desktop === 5) {
      classes += " lg:grid-cols-5";
    } else if (desktop === 6) {
      classes += " lg:grid-cols-6";
    }

    return classes;
  };

  return {
    settings,
    loading,
    getGridClasses,
    mobileItems: settings?.collection_grid_mobile || 2,
    tabletItems: settings?.collection_grid_tablet || 3,
    desktopItems: settings?.collection_grid_desktop || 4,
  };
};
