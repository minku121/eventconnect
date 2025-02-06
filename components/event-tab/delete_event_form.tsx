import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'

interface Event {
  id: string
  name: string
  description: string
  image: string
  location: string
  dateTime: string
  islimited: boolean
  maxmaxParticipantss?: number
  ispublic: boolean
}

interface DeleteEventFormProps {
  event: Event
  onDelete: (id: any) => void
}

export default function DeleteEventForm({ event, onDelete }: DeleteEventFormProps) {
  const [confirmationText, setConfirmationText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (confirmationText.toLowerCase() !== `delete event ${event.id}`.toLowerCase()) {
      toast({
        title: 'Error',
        description: 'Confirmation text did not match',
        variant: 'destructive'
      })
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch('/api/event/deleteevent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: event.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      onDelete(event.id)
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      })
      setIsOpen(false)
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the event',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="destructive">
          Delete Event
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-4">
        <p className="text-sm">Type <span className="font-bold">delete event {event.id}</span> to confirm deletion:</p>
        <Input
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder={`delete event ${event.id}`}
        />
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full"
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
