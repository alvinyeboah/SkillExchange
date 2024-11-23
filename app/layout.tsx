"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/navigation";
import { Toaster } from "@/components/providers/toaster";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { ReminderCheck } from '@/components/reminder-check'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { checkAuth } = useAuth()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isAuthPage && <Header />}
          <main className="flex-grow ">{children}</main>
          {!isAuthPage && <Footer />}
          <Toaster />
          <ReminderCheck />
        </ThemeProvider>
      </body>
    </html>
  );
}
