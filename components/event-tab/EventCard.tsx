import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditEventPopover } from './edit_event_popover'
import DeleteEventForm from './delete_event_form'

interface Event {
  id: string
  name: string
  description: string
  image: string
  location: string
  dateTime: string
  islimited:boolean
  maxParticipants?: number
  ispublic: boolean
  isOnline:boolean
  meetingId:string,
  eventId:string,
  eventPin:string,
  participantCount:number
}

interface EventCardProps {
  event: Event
  onEventUpdate?: (updatedEvent: Event) => void
  onEventDelete?: (deletedEventId: string) => void
}

export default function EventCard({ event, onEventUpdate, onEventDelete }: EventCardProps) {
  const handleViewEvent = () => {
    // TODO: Implement view event logic
    console.log('Viewing event:', event.id)
  }

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
          {event.islimited && (
            <p className="text-sm"><strong>Max Participants:</strong> {event.maxParticipants}</p>
          )}
          <p className='text-sm'><strong>Participated:</strong> {event.participantCount}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto py-4 px-4">
        <div className="grid grid-cols-3 gap-2 w-full">
          <Button 
            className="w-full"
            variant="outline"
            onClick={handleViewEvent}>
            View
          </Button>
          <EditEventPopover 
            event={event}
            onSave={(updatedEvent) => {
              if (onEventUpdate) {
                //@ts-ignore
                onEventUpdate(updatedEvent)
              }
              
            }}
          />
          <DeleteEventForm 
          
            event={event} 
            onDelete={(deletedEventId) => {
              if (onEventDelete) {
                onEventDelete(deletedEventId)
              }
             
            }}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
