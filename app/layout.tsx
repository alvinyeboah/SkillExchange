import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from "next";
import MainLayout from "./MainLayout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

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

export const metadata = {
  title: {
    default: "SkillCoin - Simplified Service Exchange Platform",
    template: "%s | SkillCoin",
  },
  description:
    "SkillCoin is a platform for exchanging services using virtual SkillCoins. Earn, spend, and collaborate in a community-driven economy.",
  icons: {
    icon: "/public/favicon.ico",
    shortcut: "/public/favicon.ico",
    apple: "/public/favicon.ico",
    other: [
      {
        rel: "icon",
        type: "image/x-icon",
        url: "/public/favicon.ico",
      },
    ],
  },
  openGraph: {
    title: "SkillCoin - Simplified Service Exchange Platform",
    description:
      "Exchange services and collaborate in a community-driven ecosystem with SkillCoin.",
    url: "https://skillcoin.com",
    siteName: "SkillCoin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SkillCoin - Simplified Service Exchange Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillCoin - Simplified Service Exchange Platform",
    description:
      "SkillCoin is a platform for exchanging services using virtual SkillCoins. Earn, spend, and collaborate in a community-driven economy.",
    images: ["/twitter-image.png"],
    creator: "@SkillCoin",
  },
  keywords: [
    "SkillCoin",
    "service exchange",
    "community-driven economy",
    "virtual currency",
    "collaboration",
  ],
  authors: [{ name: "SkillCoin Team" }],
  creator: "SkillCoin Team",
  publisher: "SkillCoin Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://skillcoin.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "fr-FR": "/fr-FR",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
          <SpeedInsights/>
          <Analytics/>
        </ThemeProvider>
      </body>
    </html>
  );
}
