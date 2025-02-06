import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import ImageUpload from "./ImageUpload"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: string
  name: string
  description: string
  image: string
  location: string
  dateTime: string
  maxParticipants?: number
  ispublic: boolean
  islimited:boolean
  isOnline: boolean
  eventPin:string
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
  const [maxParticipants, setmaxParticipants] = useState(event.maxParticipants || 1)
  const [ispublic, setIsPublic] = useState(event.ispublic)
  const [isOnline, setIsOnline] = useState(event.isOnline)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventPin, setEventPin] = useState(event.eventPin)
  const { toast } = useToast()
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleImageUpload = (url: string) => {
    setImage(url)
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
          location: isOnline ? 'Online' : location,
          dateTime,
          islimited,
          maxParticipants: islimited ? maxParticipants : undefined,
          ispublic,
          isOnline,
          eventPin: ispublic ? undefined : eventPin
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
        maxParticipants: updatedEvent.maxParticipants,
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

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    return response.json()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit Event</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 mx-auto items-center justify-center max-h-[90vh] overflow-y-auto scrollbar backdrop-blur-sm scrollbar-thumb-white/20 scrollbar-track-transparent">
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
              <ImageUpload 
                onImageUpload={handleImageUpload}
                onUploadStart={() => {
                  setIsImageUploading(true);
                  setUploadProgress(0);
                }}
                onUploadEnd={() => setIsImageUploading(false)}
                onProgress={setUploadProgress}
                onError={(error) => {
                  toast({
                    variant: "destructive",
                    title: "Upload Error",
                    description: error,
                  });
                }}
              />
              {isImageUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isOnline"
              checked={isOnline}
              onCheckedChange={setIsOnline}
            />
            <Label htmlFor="isOnline">Online Event</Label>
          </div>
          
          {!isOnline && (
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          )}
          
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
            
            {!ispublic && (
              <div>
                <Label htmlFor="eventPin">Event PIN</Label>
                <Input
                  id="eventPin"
                  value={eventPin}
                  onChange={(e) => setEventPin(e.target.value)}
                  required
                  placeholder="Enter access PIN for private event"
                />
              </div>
            )}
          
          <div className="flex items-center gap-2">
            <Switch
              id="islimited"
              checked={islimited}
              onCheckedChange={setIsLimited}
            />
            <Label htmlFor="islimited">Limit Participants</Label>
          </div>
          
          {islimited && (
            <div>
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                type="number"
                id="maxParticipants"
                value={maxParticipants}
                onChange={(e) => setmaxParticipants(Number(e.target.value))}
                min="1"
              />
            </div>
          )}
          
          <div className="flex justify-center gap-2">
            <Button 
              type="submit" 
              disabled={isSubmitting || isImageUploading}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
              {isImageUploading && (
                <span className="ml-2 text-xs">
                  (Uploading image...)
                </span>
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
