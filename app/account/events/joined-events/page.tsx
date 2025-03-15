"use client"
import JoinedEventCard from "@/components/joined-tab/JoinedEventCard"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface Event {
  id: string;
  name: string;
  dateTime: Date;
  location: string;
  image: string | null;
  participantCount: number;
  maxParticipants?: number;
  meetingStarted:boolean;
  eventId:string
  
  createdBy: {
    id: string;
    name: string;
  };
}

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const response = await fetch('/api/event/getjoinedevents');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching joined events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Joined Events</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Joined Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <JoinedEventCard
              key={event.id}
              id={event.id}
              title={event.name}
              date={new Date(event.dateTime).toLocaleDateString()}
              location={event.location}
              imageUrl={event.image || "/placeholder.svg"}
              seatsLeft={event.maxParticipants ? event.maxParticipants - event.participantCount : 0}
              participants={event.participantCount}
              meetingStarted={event.meetingStarted}
              eventId={event.eventId}           
            />
          ))}
        </div>
        {events.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            You haven't joined any events yet.
          </div>
        )}
      </div>
    </div>
  );
}

