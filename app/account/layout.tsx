"use client";

import React, { ReactNode } from "react";
import { MobileDock } from "@/components/inner/mobile-dock";
import { SidebarComponent } from "@/components/inner/sidebar-content";
import NextTopLoader from "nextjs-toploader";
import { SidebarContextProvider, useSidebarContext } from "../externalcontext/sidebar-context";

interface LayoutProps {
  children: ReactNode;
}

// Create a client component that uses the hook
function LayoutContent({ children }: LayoutProps) {
  const { sidebarType } = useSidebarContext();
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`hidden md:block transition-all duration-300 ease-in-out ${sidebarType === 'max' ? 'md:w-1/5 lg:w-1/4 xl:w-1/5' : 'md:w-1/12 lg:w-1/12 xl:w-1/12'}`}>
        <SidebarComponent />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {children}
        <div className="block sm:block md:hidden">
          <MobileDock />
        </div>
      </div>
      <NextTopLoader  
        color="#2299DD"
        initialPosition={0.08}
        crawlSpeed={200}
        height={1.5}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      />
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarContextProvider>
      <LayoutContent children={children} />
    </SidebarContextProvider>
  );
}
