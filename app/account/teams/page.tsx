"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CreateTeamForm from "@/components/teams-tab/create-team-form"
import JoinTeamForm from "@/components/teams-tab/join-team-form"
import ViewAllTeams from "@/components/teams-tab/view-all-teams"
import PublicTournaments from "@/components/teams-tab/public-tournaments"
import { SidebarComponent } from "@/components/inner/sidebar-content"

export default function TeamsTab() {
  const [activeView, setActiveView] = useState<"main" | "create" | "join" | "view">("main")

  const renderContent = () => {
    switch (activeView) {
      case "create":
        return <CreateTeamForm onBack={() => setActiveView("main")} />
      case "join":
        return <JoinTeamForm onBack={() => setActiveView("main")} />
      case "view":
        return <ViewAllTeams onBack={() => setActiveView("main")} />
      default:
        return (
          <div className="space-y-8">
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setActiveView("create")}>
                Create Team
              </Button>
              <Button onClick={() => setActiveView("join")}>
                Join Team
              </Button>
              <Button onClick={() => setActiveView("view")}>
                View All Teams
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <PublicTournaments />
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen">
    <div className="hidden md:block md:w-1/5 lg:w-1/4 xl:w-1/5">
        <SidebarComponent />
      </div>

    <div className=" flex-col w-full p-6">
      <h2 className="text-2xl font-bold mb-6">Teams</h2>
      {renderContent()}
    </div> 
    </div>
  )
}