'use client';

import AuthWrapper from '@/components/AuthWrapper';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider
      appearance={{
        elements: {
          userButtonPopoverActionButtonIcon: 'text-black',
          footer: 'hidden',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#fdf7f8',
                border: '1px solid #e5cacf',
                color: '#333',
              },
              className: 'font-medium',
            }}
          />
          <AuthWrapper>{children}</AuthWrapper>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
