"use client";

import {
  CalendarIcon,
  LayoutDashboard,
  UsersIcon,
  ChartBar,
  Settings,
  User,
  UserCheck,
  LogOutIcon,
  InboxIcon,
  LucideSettings2,
  TicketCheckIcon,
  Bell,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/ui/dock";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";




export type IconProps = React.HTMLAttributes<SVGElement>;

const DATA = {
  navbar: [
    { href: "/account/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/account/events", icon: CalendarIcon, label: "Events" },
    { href: "/account/manage-events", icon: LucideSettings2, label: "Manage Events" },
    { href: "/account/events/joined-events", icon: TicketCheckIcon, label: "Joined Events" },
    { href: "/account/notifications", icon: Bell, label: "Notifications" },
    { href: "/account/report", icon: ChartBar, label: "Report" },
    { href: "/account/settings", icon: Settings, label: "Setting" },
  ],
};



export function MobileDock() {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { data: session } = useSession();
  const mockUser = {
    name: session?.user?.name,
    avatar: session?.user?.image, 
    mail:session?.user?.email
  };

  return (
    <div className="fixed bottom-5 flex h-auto w-[100%] flex-col items-center justify-center overflow-y-auto overflow-x-hidden rounded-lg md:shadow-xl">
      <TooltipProvider>
        <Dock direction="middle" iconDistance={45} iconSize={30} iconMagnification={65}>
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-12 rounded-full")}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full py-2" />

          <DockIcon>
            <UserCheck
              className="h-5 w-5 rounded-full cursor-pointer"
              onClick={() => setShowUserDetails(!showUserDetails)}
            />
          </DockIcon>
        </Dock>
      </TooltipProvider>

      {showUserDetails && (
        <div className="fixed bottom-24  h-auto  flex flex-col items-center rounded-lg bg-transparent border-[0.1px] border-slate-800 backdrop-blur-lg p-4 shadow-lg w-64">
          <div className="flex items-center space-x-4">
            {mockUser.avatar ? (
              <img
                src={mockUser.avatar}
                alt="User Avatar"
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <User className="h-6 w-6 text-gray-500" />
              </div>
            )}
            <div>
              <p className="font-medium">{mockUser.name}</p>
              <p className="text-sm text-gray-500">{mockUser.mail}</p>
            </div>
          </div>
          <div className="mt-4 w-full">
            <button
              onClick={() => signOut()}
              className={cn(buttonVariants({ variant: "destructive" }), "w-full")}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
