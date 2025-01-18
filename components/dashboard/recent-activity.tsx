import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentActivities = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    activity: "Joined Tech Conference 2023",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    activity: "Created Startup Networking Event",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    activity: "Commented on AI Workshop",
  },
  {
    name: "William Kim",
    email: "william.kim@email.com",
    activity: "RSVP'd to Blockchain Meetup",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    activity: "Shared Cybersecurity Seminar",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {recentActivities.map((activity, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.activity}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  )
}

