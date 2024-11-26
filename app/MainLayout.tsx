// app/MainLayout.tsx
'use client'; // This is a client component
import Footer from '@/components/footer';
import Header from '@/components/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ReminderCheck } from '@/components/reminder-check'
import { Toaster } from "@/components/providers/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [someState, setSomeState] = useState(false);

  const { checkAuth } = useAuth()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>
      {!isAuthPage && <Header />}
          <main className="flex-grow ">{children}</main>
          <Toaster />
          <ReminderCheck />
      {!isAuthPage && <Footer />}
    </>
  );
};

export default MainLayout;