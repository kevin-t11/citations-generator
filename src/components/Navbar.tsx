'use client';

import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      id="citation"
      className="bg-white border-b border-gray-200 shadow-accent-foreground sticky top-0 z-10"
    >
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span className="text-citation-800">Cite</span>
            <span className="text-gray-900">Scholar</span>
          </Link>
        </div>

        {/* Navigation links: shown only when not signed in and on homepage */}
        <nav className="hidden md:flex space-x-8 font-medium">
          {pathname === '/' && !isSignedIn && (
            <>
              <Link
                href="#features"
                className="text-gray-800 hover:text-citation-800"
                onClick={(e) => handleSmoothScroll(e, 'features')}
              >
                Features
              </Link>
              <Link
                href="#citationgenerator"
                className="text-gray-800 hover:text-citation-800"
                onClick={(e) => handleSmoothScroll(e, 'citationgenerator')}
              >
                Citation Tool
              </Link>
              <Link
                href="#faq"
                className="text-gray-800 hover:text-citation-800"
                onClick={(e) => handleSmoothScroll(e, 'faq')}
              >
                FAQ
              </Link>
              <Link
                href="#universities"
                className="text-gray-800 hover:text-citation-800"
                onClick={(e) => handleSmoothScroll(e, 'universities')}
              >
                Universities
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-2">
          {isLoaded ? (
            isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button className="text-citation-700 bg-white hover:bg-neutral-100 hover:text-citation-800 border border-neutral-600">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="px-4 py-2 bg-citation-500 text-white hover:bg-citation-700 transition-colors rounded-md">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )
          ) : (
            <div className="h-10 w-20"></div> // Placeholder while loading
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
