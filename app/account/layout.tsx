"use client";

import { getSession } from "next-auth/react";
import React, { ReactNode, use, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  return <>
    {children}
  </>;
};

export default Layout;
