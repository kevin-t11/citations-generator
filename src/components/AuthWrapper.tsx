'use client';

import { useAuth } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && isSignedIn && !pathname?.startsWith('/dashboard')) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  // Show loading indicator only during auth check
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-citation-700"></div>
          <p className="mt-3 text-citation-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show the actual page content
  return <>{children}</>;
}
