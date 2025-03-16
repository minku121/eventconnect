'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateEventForm from '@/components/event-tab/CreateEventForm';
import JoinEventForm from '@/components/event-tab/JoinEventForm';
import EventCard from '@/components/event-tab/EventCard';
import Modal from '@/components/event-tab/Modal';

import { useSession } from 'next-auth/react';
import { Skeleton } from "@/components/ui/skeleton"




export default function EventPage() {

  const { data: session } = useSession();
  const [activeModal, setActiveModal] = useState<'create' | 'join' | null>(null);
  const [mockEvents, setMockEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/event/viewmine');
      const data = await response.json();
      
      const formattedData = (data || []).map((event: any, index: any) => ({
        ...event,
        id: event.id || `fallback-id-${index}`,
      }));
      
      setMockEvents(formattedData);
      
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

   

  useEffect(() => {
    fetchEvents();
   
  }, []);

 
  return (
    <div className="flex h-screen">
      

      <div className="flex-1 flex-col md:flex mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Event Management</h1>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={() => setActiveModal('create')}
            className="transition-all duration-200 ease-in-out hover:bg-primary-dark"
          >
            Create Event
          </Button>
          <Button
            onClick={() => setActiveModal('join')}
            className="transition-all duration-200 ease-in-out hover:bg-primary-dark"
          >
            Join Event
          </Button>
          <Button 
            onClick={fetchEvents}
            className="transition-all duration-200 ease-in-out hover:bg-primary-dark"
          >
            Joined Events
          </Button>
        </div>

        {/* Modals */}
        <Modal isOpen={activeModal === 'create'} onClose={() => setActiveModal(null)}>
          <CreateEventForm onClose={() => {
            setActiveModal(null);
            fetchEvents();
             // Refresh events after creating
          }} />
        </Modal>
        <Modal isOpen={activeModal === 'join'} onClose={() => setActiveModal(null)}>
          <JoinEventForm onClose={() => {
            setActiveModal(null);
            fetchEvents();
          // Refresh events after joining
          }} />
        </Modal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(mockEvents) &&
              mockEvents.map((event: any) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  onEventUpdate={fetchEvents}
                  onEventDelete={fetchEvents}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}