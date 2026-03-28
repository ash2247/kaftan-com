import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "published" | "draft" | "scheduled";
  featured: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await (supabase as any)
          .from('collections')
          .select('*')
          .eq('status', 'published')
          .order('featured', { ascending: false })
          .order('name', { ascending: true });

        if (error) throw error;

        // Custom sorting: Put "Doiang" collection first, then others by featured and name
        const sortedCollections = (data || []).sort((a, b) => {
          // Put Doiang collection first
          if (a.name.toLowerCase().includes('doiang') && !b.name.toLowerCase().includes('doiang')) return -1;
          if (!a.name.toLowerCase().includes('doiang') && b.name.toLowerCase().includes('doiang')) return 1;
          
          // Then sort by featured (featured first)
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // Then sort by name alphabetically
          return a.name.localeCompare(b.name);
        });

        setCollections(sortedCollections);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, loading, error };
};
