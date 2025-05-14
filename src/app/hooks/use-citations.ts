'use client';

import { Citation } from '@/types/citation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * hook to manage citations with local storage
 */
export function useCitations() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load citations from localStorage on mount
  useEffect(() => {
    try {
      const storedCitations = localStorage.getItem('citations');
      setCitations(storedCitations ? JSON.parse(storedCitations) : []);
    } catch (error) {
      console.error('Error loading citations:', error);
      setCitations([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update localStorage when citations change
  useEffect(() => {
    if (isLoaded && citations.length > 0) {
      localStorage.setItem('citations', JSON.stringify(citations));
    }
  }, [citations, isLoaded]);

  // Handle storage events (for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedCitations = localStorage.getItem('citations');
        if (storedCitations) {
          setCitations(JSON.parse(storedCitations));
        }
      } catch (error) {
        console.error('Error handling storage event:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add a new citation
  const addCitation = (citation: Citation) => {
    setCitations((prev) => {
      // Ensure we don't add duplicates
      const isDuplicate = prev.some((c) => c.id === citation.id);
      if (isDuplicate) {
        return prev;
      }

      const newCitations = [citation, ...prev];
      localStorage.setItem('citations', JSON.stringify(newCitations));
      return newCitations;
    });

    toast.success('Citation saved');
  };

  // Remove a citation
  const removeCitation = (id: string) => {
    setCitations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      localStorage.setItem('citations', JSON.stringify(filtered));
      return filtered;
    });

    toast.success('Citation removed');
  };

  // Update an existing citation
  const updateCitation = (updatedCitation: Citation) => {
    setCitations((prev) => {
      const updated = prev.map((c) => (c.id === updatedCitation.id ? updatedCitation : c));
      localStorage.setItem('citations', JSON.stringify(updated));
      return updated;
    });

    toast.success('Citation updated');
  };

  return {
    citations,
    isLoaded,
    addCitation,
    removeCitation,
    updateCitation,
  };
}
