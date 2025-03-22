"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SidebarContextType = {
  sidebarType: string;
  setSidebarType: (type: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarContextProvider({
  children,
  defaultSidebarType = "max",
}: {
  children: React.ReactNode;
  defaultSidebarType?: string;
}) {
  const [sidebarType, setSidebarType] = useState<string>(defaultSidebarType);

  useEffect(() => {
    // Load from localStorage on mount
    const savedSidebarType = localStorage.getItem("sidebarType");
    if (savedSidebarType) {
      setSidebarType(savedSidebarType);
    }
  }, []);

  const handleSetSidebarType = (type: string) => {
    setSidebarType(type);
    localStorage.setItem("sidebarType", type);
  };

  const value = useMemo(
    () => ({
      sidebarType,
      setSidebarType: handleSetSidebarType,
    }),
    [sidebarType]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarContextProvider");
  }
  return context;
}
