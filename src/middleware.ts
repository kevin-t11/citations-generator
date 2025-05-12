import { clerkMiddleware } from '@clerk/nextjs/server';

// Use the basic middleware approach to protect routes
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
