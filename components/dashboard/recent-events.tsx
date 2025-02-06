import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentJoinedEvents = [
  {
    name: "Tech Conference 2023",
    organizer: "TechCorp",
    date: "2023-09-15",
  },
  {
    name: "AI Workshop",
    organizer: "AI Innovations",
    date: "2023-09-20",
  },
  {
    name: "Blockchain Meetup",
    organizer: "Crypto Enthusiasts",
    date: "2023-09-25",
  },
]

const recentCreatedEvents = [
  {
    name: "Startup Networking Event",
    maxParticipantss: 50,
    date: "2023-10-05",
  },
  {
    name: "Cybersecurity Seminar",
    maxParticipantss: 75,
    date: "2023-10-10",
  },
]

export function RecentEvents({ type }: { type: "joined" | "created" }) {
  const events = type === "joined" ? recentJoinedEvents : recentCreatedEvents

  return (
    <div className="space-y-8">
      {events.map((event, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/event-${index + 1}.png`} alt="Event" />
            <AvatarFallback>{event.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{event.name}</p>
            <p className="text-sm text-muted-foreground">
              {type === "joined" ? (
                `Organized by ${(event as { name: string; organizer: string; date: string }).organizer}`
              ) : (
                `${(event as { name: string; maxParticipantss: number; date: string }).maxParticipantss} maxParticipantss`
              )}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {new Date(event.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}

