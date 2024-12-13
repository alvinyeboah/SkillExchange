'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isInitialized, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isInitialized) {
        await checkAuth();
      }
    };
    checkAuthentication();
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    if (isInitialized) {
      const isAuthPage = pathname.startsWith('/auth/');
      if (user && isAuthPage) {
        router.push('/');
      }
    }
  }, [isInitialized, user, pathname, router]);

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
} 