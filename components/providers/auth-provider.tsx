'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isInitialized, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    if (isInitialized) {
      const isAuthPage = pathname.startsWith('/auth/');
      if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [isInitialized, user, pathname, router]);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
} 