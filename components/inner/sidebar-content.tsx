"use client"; // Ensure this is at the top to specify client-side rendering

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
  Router,
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";

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
  { icon: Bell, label: "Notification", path: "/account/notifications" },
  { icon: BarChart, label: "Report", path: "/account/report" },
  { icon: Settings, label: "Settings", path: "/account/settings" },
  { icon: FileX, label: "Certificates", path: "/account/certificates" },
];

export function SidebarComponent() {
  const { data: session } = useSession();
  const [currentPath, setCurrentPath] = useState<string>("");
  const router = useRouter();

  const handleSignout = () => {
    signOut();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <SidebarProvider>
      <Sidebar className="fixed top-0 left-0 h-full w-[250px] shadow-lg border-r border-border/40 bg-background/95 backdrop-blur-sm">
        <SidebarHeader className="border-b border-border/40 px-6 py-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            TeamConnect
          </h2>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <div className="flex justify-between items-center px-3 mb-4">
            <h3 className="text-sm font-medium">Menu</h3>
            <NotificationBell />
          </div>

          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center w-full justify-start py-2.5 px-3 mb-1 rounded-lg transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-4.5 w-4.5",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 p-4 mt-auto">
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
            <div className="ml-3 space-y-0.5 overflow-hidden">
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
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
