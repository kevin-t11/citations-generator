import { deleteCitation, getSavedCitations, saveCitation } from '@/app/utils/citation-service';
import { Citation } from '@/types/citation';
import { useEffect, useState } from 'react';

/**
 * hook to manage citations with local storage
 */
export function useCitations() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load citations from localStorage
  useEffect(() => {
    const loadCitations = () => {
      try {
        const savedCitations = getSavedCitations();
        setCitations(savedCitations);
      } catch (error) {
        console.error('Error loading citations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCitations();

    // when citations are updated in other components
    const handleStorageChange = () => {
      loadCitations();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Add a new citation
  const addCitation = (citation: Citation) => {
    try {
      saveCitation(citation);
      setCitations((prev) => [...prev, citation]);
    } catch (error) {
      console.error('Error adding citation:', error);
      throw error;
    }
  };

  // Remove a citation
  const removeCitation = (id: string) => {
    try {
      deleteCitation(id);
      setCitations((prev) => prev.filter((citation) => citation.id !== id));
    } catch (error) {
      console.error('Error removing citation:', error);
      throw error;
    }
  };

  // Update citations list
  const refreshCitations = () => {
    try {
      const savedCitations = getSavedCitations();
      setCitations(savedCitations);
    } catch (error) {
      console.error('Error refreshing citations:', error);
    }
  };

  return {
    citations,
    isLoading,
    addCitation,
    removeCitation,
    refreshCitations,
  };
}
