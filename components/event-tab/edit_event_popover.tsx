import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface Event {
  id: string
  name: string
  description: string
  image: string
  location: string
  dateTime: string
  attendee?: number
  ispublic: boolean
  islimited:boolean
}

interface EditEventPopoverProps {
  event: Event
  onSave: (updatedEvent: Event) => void
}

export function EditEventPopover({ event, onSave }: EditEventPopoverProps) {
  const [name, setName] = useState(event.name)
  const [description, setDescription] = useState(event.description)
  const [image, setImage] = useState(event.image)
  const [location, setLocation] = useState(event.location)
  const [dateTime, setDateTime] = useState(event.dateTime)
  const [islimited, setIsLimited] = useState(event.islimited)
  const [attendee, setAttendee] = useState(event.attendee || 1)
  const [ispublic, setIsPublic] = useState(event.ispublic)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/event/editevent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: event.id,
          name,
          description,
          image,
          location,
          dateTime,
          islimited,
          attendee: islimited ? attendee : undefined,
          ispublic
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update event')
      }

      const updatedEvent = await response.json()
      onSave({
        ...updatedEvent,
        dateTime: updatedEvent.dateTime,
        maxAttendees: updatedEvent.attendee,
        islimited: updatedEvent.islimited
      })
      
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      })
    } catch (error) {
      console.error('Error updating event:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred while updating the event',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTimeLocal = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16)
    } catch {
      return ''
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit Event</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 mx-auto items-center justify-center scale-90">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="image">Event Image</Label>
            <div className="flex flex-col gap-2">
              {image && (
                <div className="relative w-full h-32 rounded-md overflow-hidden">
                  <Image
                    src={image}
                    alt="Event preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImage('')}
                  disabled={!image}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="datetime">Date & Time</Label>
            <Input
              type="datetime-local"
              id="datetime"
              value={formatDateTimeLocal(dateTime)}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="ispublic"
              checked={ispublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="ispublic">Public Event</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="islimited"
              checked={islimited}
              onCheckedChange={setIsLimited}
            />
            <Label htmlFor="islimited">Limit Attendees</Label>
          </div>
          
          {islimited && (
            <div>
              <Label htmlFor="attendee">Max Attendees</Label>
              <Input
                type="number"
                id="attendee"
                value={attendee}
                onChange={(e) => setAttendee(Number(e.target.value))}
                min="1"
              />
            </div>
          )}
          
          <div className="flex justify-center gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
