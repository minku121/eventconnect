import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [hasAttendees, setHasAttendees] = useState(false)
  const [hasCertificates, setHasCertificates] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (confirmFinal = false) => {
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
      // First attempt to delete to check if we need extra confirmation
      const response = await fetch('/api/event/deleteevent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: event.id,
          confirmDeletion: confirmFinal
        }),
      })

      const data = await response.json()

      // If we need confirmation and this isn't the final confirmation
      if (!response.ok && response.status === 428 && data.requiresConfirmation && !confirmFinal) {
        setIsDeleting(false)
        setHasAttendees(data.hasAttendees)
        setHasCertificates(data.hasCertificates)
        setShowWarningDialog(true)
        setIsOpen(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      onDelete(event.id)
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      })
      setIsOpen(false)
      setShowWarningDialog(false)
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

  const handleConfirmFinalDelete = () => {
    handleDelete(true)
    setShowWarningDialog(false)
  }

  return (
    <>
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
            onClick={() => handleDelete(false)}
            disabled={isDeleting}
            className="w-full"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Data Will Be Lost</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>You are about to delete an event that has:</p>
                <ul className="list-disc pl-5 space-y-2">
                  {hasAttendees && (
                    <li className="text-amber-600 font-medium">
                      Attendance records that will be permanently deleted
                    </li>
                  )}
                  {hasCertificates && (
                    <li className="text-amber-600 font-medium">
                      Certificates that will be permanently deleted and no longer accessible to attendees
                    </li>
                  )}
                </ul>
                <p className="pt-2 font-medium">
                  This action cannot be undone. Are you sure you want to continue?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFinalDelete} className="bg-destructive text-destructive-foreground">
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
