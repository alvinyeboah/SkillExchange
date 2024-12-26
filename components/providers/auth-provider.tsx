'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isInitialized, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isInitialized) {
        try {
          await checkAuth();
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsChecking(false);
    };
    checkAuthentication();
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    if (!isChecking && isInitialized) {
      const isAuthPage = pathname.startsWith('/auth/');
      if (user && isAuthPage) {
        router.push('/');
      }
    }
  }, [isChecking, isInitialized, user, pathname, router]);

  if (isChecking || !isInitialized) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
} 