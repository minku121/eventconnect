"use client";

import { getSession } from "next-auth/react";
import React, { ReactNode, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileDock } from "@/components/inner/mobile-dock";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();


  const checkSession = async () => {
    const session = await getSession();
    
    if (!session) {
      router.push('/auth/signin');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
   <div>
  
    {children}
   
    <div className="block sm:block md:hidden">
  <MobileDock />
</div>

  </div>)
};

export default Layout;
