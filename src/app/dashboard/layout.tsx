'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show simplified loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-citation-700"></div>
      </div>
    );
  }

  // Show unauthorized message if loaded but not signed in
  if (!isSignedIn) {
    return null; // Return nothing as we're redirecting
  }

  return <div className="dashboard-layout">{children}</div>;
}
