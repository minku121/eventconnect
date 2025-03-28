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
  title: "TeamConnect - Create Team Collaboration",
  description: "Coonect with your team and collaborate on projects",
  verification: {
    google: "qL720GXw6dFNEOuVaNMFuRgmVM2BgQ0lKgMGKsqkmqo",
  },
  keywords: ["TeamConnect", "Event Collaboration", "Event Collaboration Platform", "event collaboration" , "Event collaboration platform" , "Join Event online",  "Event and certificate plateform" , "Team Collaboration", "Team Collaboration Platform", "Team Collaboration Tool", "Team Collaboration Software", "Team Collaboration App", "Team Collaboration System", "Team Collaboration Platform", "Team Collaboration Tool", "Team Collaboration Software", "Team Collaboration App", "Team Collaboration System"],
  openGraph: {
    title: "TeamConnect - Create Event Collaboration and Join event online",
    description: "Coonect with your team and collaborate on projects",
    type: "website",
    locale: "en",
    siteName: "TeamConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "TeamConnect - Create And Join event online",
    description: "Coonect and create teams online with certifications",
  },

  icons: {
    icon: "/favicon.ico",
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
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClarityProvider />
            
            {children}
          </ThemeProvider>
        </SessionProviderWrapper>
        <Toaster /> 
        <TopLoader />
       
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
