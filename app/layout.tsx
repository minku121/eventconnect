import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProviderWrapper } from "@/components/extprovider/SessionProviderWrapper";
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"; 
import TopLoader from "@/components/ui/toploader";
import ClarityProvider from "./externalcontext/ClarityProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventConnect - Create, Join & Certify Events | eventconnectweb.xyz",
  description: "Create and manage professional events, join video meetings, and issue verified certificates on eventconnectweb.xyz - the complete event management platform.",
  verification: {
    google: "qL720GXw6dFNEOuVaNMFuRgmVM2BgQ0lKgMGKsqkmqo",
  },
  metadataBase: new URL('https://eventconnectweb.xyz'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    "EventConnect", 
    "Event Collaboration", 
    "Online Event Platform", 
    "Video Meetings", 
    "Digital Certificates", 
    "Remote Collaboration", 
    "Team Events", 
    "Event Management", 
    "Virtual Meetings", 
    "Event Certification Platform", 
    "Team Collaboration Software", 
    "Online Team Building", 
    "Event Analytics", 
    "Meeting Scheduler", 
    "Attendance Tracking"
  ],
  openGraph: {
    title: "EventConnect - Professional Event Management & Certification",
    description: "Create engaging online events, join video meetings, and issue professional certificates with EventConnect.",
    type: "website",
    locale: "en_US",
    siteName: "EventConnect",
    url: "https://eventconnectweb.xyz",
    images: [
      {
        url: 'https://eventconnectweb.xyz/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EventConnect Platform Preview',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventConnect - Professional Event Management",
    description: "Create, join and certify professional events on eventconnectweb.xyz",
    images: ['https://eventconnectweb.xyz/twitter-image.jpg'],
    creator: "@eventconnect",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "icon",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClarityProvider />
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProviderWrapper>
        <TopLoader />
       
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
