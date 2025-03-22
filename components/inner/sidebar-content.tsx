"use client";

import {
  Grid,
  List,
  Bell,
  BarChart,
  Settings,
  LogOut,
  GroupIcon,
  Group,
  Users2,
  FileX,
  TicketCheckIcon,
  File,
  LucideSettings2,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSidebarContext } from "@/app/externalcontext/sidebar-context";

// Define CSS for transitions
const sidebarTransition = "transition-all duration-300 ease-in-out";
const sidebarStyle = {
  transition: "width 300ms ease-in-out, min-width 300ms ease-in-out",
};

const navItems = [
  { icon: Grid, label: "Dashboard", path: "/account/dashboard" },
  { icon: File, label: "Events", path: "/account/events" },
  {
    icon: LucideSettings2,
    label: "Manage Events",
    path: "/account/manage-events",
  },
  {
    icon: TicketCheckIcon,
    label: "Joined Events",
    path: "/account/events/joined-events",
  },
  { icon: Bell, label: "Notifications", path: "/account/notifications" },
  { icon: Settings, label: "Settings", path: "/account/settings" },
  { icon: FileX, label: "Certificates", path: "/account/certificates" },
];

export function SidebarComponent() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const minWidth = 80;
  const maxWidth = 350;
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const {sidebarType, setSidebarType} = useSidebarContext();
  const [sidebarWidth, setSidebarWidth] = useState(sidebarType === "min" ? minWidth : 250);
  const [isMini, setIsMini] = useState(sidebarType === "min");

  useEffect(() => {
    if (sidebarType === "min") {
      setSidebarWidth(minWidth);
      setIsMini(true);
    } else {
      setSidebarWidth(250);
      setIsMini(false);
    }
  }, [sidebarType]);

  const handleSignout = () => {
    signOut();
  };

  const toggleSidebar = () => {
    if (isMini) {
      setSidebarWidth(250);
      setIsMini(false);
      setSidebarType("max");
    
    } else {
      setSidebarWidth(minWidth);
      setIsMini(true);
      setSidebarType("min");
    }
  };

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    if (sidebarWidth < 120) {
      setSidebarWidth(minWidth);
      setIsMini(true);
      setSidebarType("min");
   
    } else if (sidebarWidth < 200) {
      setSidebarWidth(200);
      setIsMini(false);
      setSidebarType("max");
    }
  }, [sidebarWidth, setSidebarType, setSidebarWidth, setIsMini]);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        const newIsMini = newWidth <= 120;
        setIsMini(newIsMini);
        if (newIsMini) {
          setSidebarType("min");
        } else {
          setSidebarType("max");
        }
      }
    }
  }, [isResizing, minWidth, maxWidth, setSidebarType, sidebarRef, setSidebarWidth, setIsMini]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <SidebarProvider>
      <Sidebar
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 h-full shadow-lg border-r border-border/40 bg-background/95 backdrop-blur-sm overflow-hidden flex flex-col", 
          sidebarTransition
        )}
        style={{ 
          ...sidebarStyle,
          width: `${sidebarWidth}px` 
        }}
      >
        <SidebarHeader className="border-b border-border/40 px-6 py-3 flex items-center">
          <div className="flex items-center gap-2">
            {!isMini && (
              <h2 className={cn("text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent truncate", sidebarTransition)}>
                TeamConnect
              </h2>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
            >
              {isMini ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 flex-grow overflow-y-auto">
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center w-full py-2.5 px-3 mb-1 rounded-lg transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4.5 w-4.5",
                          isMini ? "mx-auto" : "mr-3",
                          isActive ? "text-primary" : "text-muted-foreground",
                          sidebarTransition
                        )}
                      />
                      <span className={cn("whitespace-nowrap", sidebarTransition, {
                        "opacity-0 w-0 overflow-hidden": isMini,
                        "opacity-100": !isMini
                      })}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className={cn("border-t border-border/40 px-2 py-2 mt-auto", sidebarTransition)}>
          {!isMini ? (
            <>
              <div className="flex items-center p-2 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage
                    src={session?.user?.image ?? ""}
                    alt="Profile Image"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {session?.user?.name ? session.user?.name[0] : ""}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("ml-3 space-y-0.5 overflow-hidden", sidebarTransition)}>
                  <p className="text-sm font-medium truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                onClick={handleSignout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={session?.user?.image ?? ""} alt="Profile Image" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {session?.user?.name ? session.user?.name[0] : ""}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                onClick={handleSignout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SidebarFooter>
        
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className={cn(
            "absolute top-0 right-0 w-1 h-full cursor-ew-resize z-50",
            "before:absolute before:top-0 before:right-0 before:w-1 before:h-full before:bg-primary/0 hover:before:bg-primary/20 before:transition-colors",
            "active:before:bg-primary/30"
          )}
          onMouseDown={startResizing}
        />
      </Sidebar>
    </SidebarProvider>
  );
}
