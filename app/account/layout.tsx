import React, { ReactNode, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileDock } from "@/components/inner/mobile-dock";
import { SidebarComponent } from "@/components/inner/sidebar-content";
import NextTopLoader from "nextjs-toploader";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Add Sidebar here */}
      <div className="hidden md:block md:w-1/5 lg:w-1/4 xl:w-1/5">
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
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
    </div>
  );
}
