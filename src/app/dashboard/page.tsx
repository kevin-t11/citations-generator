'use client';

import CitationGenerator from '@/components/CitationGenerator';
import CitationsList from '@/components/CitationsList';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const searchParams = useSearchParams();

  // Get tab from URL query parameter or default to 'generate'
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'citations' ? 'citations' : 'generate');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      // If a new citation is added, switch to the list tab
      const savedCitations = localStorage.getItem('citations');
      if (savedCitations && JSON.parse(savedCitations).length > 0) {
        setActiveTab('citations');
        // Update URL to reflect tab change
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'citations');
        window.history.pushState({}, '', url);
      }
    };

    // Set up listener for CitationGenerator adding citations
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto p-4 mt-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center mb-">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="generate" className="text-sm sm:text-base">
                Generate Citation
              </TabsTrigger>
              <TabsTrigger value="citations" className="text-sm sm:text-base">
                My Citations
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="mt-4">
            <CitationGenerator />
          </TabsContent>

          <TabsContent value="citations" className="mt-4">
            <CitationsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
