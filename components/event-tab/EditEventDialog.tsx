import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useToast } from '@/hooks/use-toast'
import Image from "next/image"
import ImageUpload from "./ImageUpload"
import { Progress } from "@/components/ui/progress"

interface Event {
    id: string
    name: string
    description: string
    image: string
    location: string
    eventDateTime: string
    maxParticipants?: number
    ispublic: boolean
    islimited:boolean
    isOnline: boolean
    eventPin:string
    startTime:string
  }

interface EditEventDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedEvent: Event) => void
}

export function EditEventDialog({ event, open, onOpenChange, onSave }: EditEventDialogProps) {
  const [name, setName] = useState(event.name)
  const [description, setDescription] = useState(event.description)
  const [image, setImage] = useState(event.image)
  const [location, setLocation] = useState(event.location)
  const [eventDateTime, setEventDateTime] = useState(event.startTime)
  const [islimited, setIsLimited] = useState(event.islimited)
  const [maxParticipants, setMaxParticipants] = useState(event.maxParticipants || 1)
  const [ispublic, setIsPublic] = useState(event.ispublic)
  const [isOnline, setIsOnline] = useState(event.isOnline)
  const [eventPin, setEventPin] = useState(event.eventPin)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleImageUpload = (url: string) => {
    setImage(url)
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
          eventDateTime: eventDateTime,
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
      onSave(updatedEvent)
      
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      })
      
      // Close the dialog after successful update
      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent py-4">
          <form onSubmit={handleSubmit} className="space-y-4" id="editEventForm">
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
            <Label htmlFor="eventDateTime">Event Date & Time</Label>
            <Input
              type="datetime-local"
              id="eventDateTime"
              value={formatDateTimeLocal((eventDateTime))}
              onChange={(e) => setEventDateTime(new Date(e.target.value).toISOString())}
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
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  min="1"
                />
              </div>
            )}
          </form>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="editEventForm"
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
        </div>
      </DialogContent>
    </Dialog>
  )
} 