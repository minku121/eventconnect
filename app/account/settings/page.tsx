import React from "react";
import SettingsPage from "@/components/settings/mainSettings";
import { SidebarComponent } from "@/components/inner/sidebar-content";

export default function page() {
  return (
    <div className="flex h-screen">
      <div>
        <SettingsPage />
      </div>
    </div>
  );
}
