"use client";  // Ensure this is at the top to specify client-side rendering

import { Grid, List, Bell, BarChart, Settings, LogOut, GroupIcon, Group, Users2, FileX, TicketCheckIcon, File, LucideSettings2 } from "lucide-react";
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
import { useEffect, useState } from "react";

const navItems = [
  { icon: Grid, label: "Dashboard", path: "/account/dashboard" },
  { icon: List, label: "Events", path: "/account/events" },
  { icon: LucideSettings2, label: "Manage Events", path: "/account/manage-events" },
  { icon: TicketCheckIcon, label: "Joined Events", path: "/account/events/joined-events" },
  { icon: Bell, label: "Notification", path: "/account/notifications" },
  { icon: BarChart, label: "Report", path: "/account/report" },
  { icon: Settings, label: "Settings", path: "/account/settings" },
];

export function SidebarComponent() {
  const { data: session } = useSession();
  const [currentPath, setCurrentPath] = useState<string>("");
    
  const handleSignout = () =>{
    signOut();
  }


  useEffect(() => {
    
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []); 

  return (
    <SidebarProvider>
      <Sidebar className="fixed top-0 left-0 h-full w-[20%] shadow-xl ">
        <SidebarHeader className="border-b px-7 py-3">
          <h2 className="text-lg font-semibold">TeamConnect</h2>
        </SidebarHeader>

        <SidebarContent className="">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className={`w-[98%] justify-start p-5 mt-2 ${
                      currentPath === item.path ? "bg-slate-300 dark:bg-gray-600 " : ""
                    }`}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.pathname = item.path;  // Use window.location to navigate
                      }
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session?.user?.image ?? ''} alt="Profile Image" />
              <AvatarFallback>{session?.user?.name ? session.user?.name[0] : ''}</AvatarFallback>
            </Avatar>
            <div className="ml-3 space-y-1">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="mt-4 w-full justify-start" onClick={handleSignout}>
            <LogOut className="mr-2 h-4 w-4"  />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
