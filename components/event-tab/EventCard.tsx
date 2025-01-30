import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  name: string
  description: string
  image: string
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
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden">
          <Image 
            src={event.image || "/placeholder.svg"} 
            alt={event.name} 
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardTitle className="mt-4 px-4">{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-4">
        <div className="h-24 mb-4 overflow-hidden">
          <p className="text-sm text-gray-600">
            {event.description.split('\n').slice(0, 4).join('\n')}
            {event.description.split('\n').length > 4 && '...'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm"><strong>Location:</strong> {event.location}</p>
          <p className="text-sm"><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
          {event.limitedAttendees && (
            <p className="text-sm"><strong>Max Attendees:</strong> {event.maxAttendees}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto py-4 px-4">
        <div className="flex justify-around w-full">
          <Button>View Details</Button>
          <Button variant="outline">Edit Event</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
