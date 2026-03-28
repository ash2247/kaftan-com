import { useState, useEffect } from "react";
import { headerFooterService, type HeaderFooterContent, type NavItem, type FooterSection } from "@/lib/headerFooterService";

export const useHeaderFooter = () => {
  const [content, setContent] = useState<HeaderFooterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await headerFooterService.getHeaderFooterContent();
      setContent(data);
    } catch (err) {
      console.error('Error loading header footer content:', err);
      setError('Failed to load header footer content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (newContent: HeaderFooterContent) => {
    try {
      const success = await headerFooterService.saveHeaderFooterContent(newContent);
      if (success) {
        setContent(newContent);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error saving header footer content:', err);
      setError('Failed to save header footer content');
      return false;
    }
  };

  return {
    content,
    loading,
    error,
    saveContent,
    refetch: loadContent,
  };
};
