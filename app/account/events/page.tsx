'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import CreateEventForm from '@/components/event-tab/CreateEventForm'
import JoinEventForm from '@/components/event-tab/JoinEventForm'
import EventCard from '@/components/event-tab/EventCard'
import Modal from '@/components/event-tab/Modal'
import { SidebarComponent } from '@/components/inner/sidebar-content'

// Mock data for events
const mockEvents = [
  {
    id: '1',
    name: 'Tech Conference 2023',
    description: 'Annual tech conference featuring the latest in AI and ML',
    coverImage: '/placeholder.svg?height=200&width=400',
    location: 'San Francisco, CA',
    dateTime: '2023-09-15T09:00',
    isPublic: true,
    limitedAttendees: true,
    maxAttendees: 500
  },
  {
    id: '2',
    name: 'Community Picnic',
    description: 'A fun day out for the whole family',
    coverImage: '/placeholder.svg?height=200&width=400',
    location: 'Central Park, NY',
    dateTime: '2023-07-22T12:00',
    isPublic: true,
    limitedAttendees: false,
  }
]

export default function EventPage() {
  const [activeModal, setActiveModal] = useState<'create' | 'join' | null>(null)

  return (
    <div className="flex h-screen">

    <div className="hidden md:block md:w-1/5 lg:w-1/4 xl:w-1/5">
        <SidebarComponent />
      </div>
      
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Event Management</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        <Button onClick={() => setActiveModal('create')} className="transition-all duration-200 ease-in-out hover:bg-primary-dark">Create Event</Button>
        <Button onClick={() => setActiveModal('join')} className="transition-all duration-200 ease-in-out hover:bg-primary-dark">Join Event</Button>
        <Button className="transition-all duration-200 ease-in-out hover:bg-primary-dark">See All Events</Button>
      </div>

      <Modal isOpen={activeModal === 'create'} onClose={() => setActiveModal(null)}>
        <CreateEventForm onClose={() => setActiveModal(null)} />
      </Modal>

      <Modal isOpen={activeModal === 'join'} onClose={() => setActiveModal(null)}>
        <JoinEventForm onClose={() => setActiveModal(null)} />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
    </div>
  )
}

