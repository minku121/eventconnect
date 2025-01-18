import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import ImageUpload from './ImageUpload'

interface CreateEventFormProps {
  onClose: () => void
}

export default function CreateEventForm({ onClose }: CreateEventFormProps) {
  const [isPublic, setIsPublic] = useState(true)
  const [limitedAttendees, setLimitedAttendees] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      
      <div>
        <Label htmlFor="name">Event Name</Label>
        <Input id="name" required />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" required />
      </div>
      
      <div>
        <Label htmlFor="coverImage">Cover Image</Label>
        <ImageUpload onImageUpload={(file) => console.log('File uploaded:', file)} />
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" required />
      </div>
      
      <div>
        <Label htmlFor="dateTime">Date and Time</Label>
        <Input id="dateTime" type="datetime-local" required />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
        <Label htmlFor="isPublic">Public Event</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="limitedAttendees" checked={limitedAttendees} onCheckedChange={setLimitedAttendees} />
        <Label htmlFor="limitedAttendees">Limited Attendees</Label>
      </div>
      
      {limitedAttendees && (
        <div>
          <Label htmlFor="maxAttendees">Maximum Attendees</Label>
          <Input id="maxAttendees" type="number" min="1" required />
        </div>
      )}
      
      <div className="flex space-x-4">
        <Button type="submit" className="transition-all duration-200 ease-in-out hover:bg-primary-dark">Create Event</Button>
      </div>
    </form>
  )
}

