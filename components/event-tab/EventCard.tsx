import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  name: string
  description: string
  coverImage: string
  location: string
  dateTime: string
  limitedAttendees: boolean
  maxAttendees?: number
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <Image src={event.coverImage || "/placeholder.svg"} alt={event.name} width={400} height={200} className="rounded-t-lg" />
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
        <p className="text-sm"><strong>Location:</strong> {event.location}</p>
        <p className="text-sm"><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
        {event.limitedAttendees && (
          <p className="text-sm"><strong>Max Attendees:</strong> {event.maxAttendees}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  )
}

