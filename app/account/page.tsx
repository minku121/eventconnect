
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calendar, Flag, Users, PenToolIcon as Tool } from "lucide-react"
import { getServerSession } from "next-auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "A personalized dashboard summarizing key information",
}

// Dummy data (replace with actual data fetching in a real application)
const userData = {
  eventsJoined: 12,
  eventsManaged: 5,
  recentReports: 2,
  upcomingEvents: [
    { id: 1, name: "Team Building Workshop", date: "2023-06-15" },
    { id: 2, name: "Annual Conference", date: "2023-07-01" },
    { id: 3, name: "Charity Run", date: "2023-07-10" },
  ],
  recentActivity: [
    { id: 1, type: "join", event: "Tech Meetup", time: "2 hours ago" },
    { id: 2, type: "manage", event: "Project Kickoff", time: "1 day ago" },
    { id: 3, type: "report", event: "Bug in Event Page", time: "3 days ago" },
  ],
  quickTools: [
    { id: 1, name: "Event Planner", icon: Calendar, href: "/tools/planner" },
    { id: 2, name: "Attendee Tracker", icon: Users, href: "/tools/attendees" },
    { id: 3, name: "Feedback Collector", icon: Flag, href: "/tools/feedback" },
  ],
}

export default async function DashboardOverview() {
  const session = await getServerSession()
  const userName = session?.user?.name || "User"

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {userName}!</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Joined</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.eventsJoined}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Managed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.eventsManaged}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Reports/Issues</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.recentReports}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {userData.recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{activity.type[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.type === "join" && "Joined "}
                      {activity.type === "manage" && "Managed "}
                      {activity.type === "report" && "Reported "}
                      {activity.event}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {userData.upcomingEvents.map((event) => (
                <li key={event.id} className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm font-medium leading-none">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {userData.quickTools.map((tool) => (
          <Button key={tool.id} variant="outline" asChild className="w-full">
            <Link href={tool.href}>
              <tool.icon className="mr-2 h-4 w-4" />
              {tool.name}
            </Link>
          </Button>
        ))}
        <Button variant="outline" asChild className="w-full">
          <Link href="/account/settings">
            <Tool className="mr-2 h-4 w-4" />
            More Tools
          </Link>
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="w-full">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/account/manage-events">
            Manage Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/account/events">
            Join Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/account/settings">
            Account Settings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
