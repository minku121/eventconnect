"use client"
import JoinedEventCard from "@/components/joined-tab/JoinedEventCard"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Event {
  id: string;
  name: string;
  location: string;
  image: string | null;
  participantCount: number;
  maxParticipants?: number;
  meetingStarted: boolean;
  eventId: string;
  startTime: any;
  status: string;
  
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

  // Filter events by status
  const activeEvents = events.filter(event => event.status === "ACTIVE");
  const scheduledEvents = events.filter(event => event.status === "SCHEDULED");
  const endedEvents = events.filter(event => event.status === "ENDED");

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Joined Events</h1>
        
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({events.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeEvents.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({scheduledEvents.length})</TabsTrigger>
            <TabsTrigger value="ended">Ended ({endedEvents.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? (
                events.map((event) => (
                  <JoinedEventCard
                    key={event.id}
                    id={event.id}
                    title={event.name}
                    date={new Date(event.startTime).toLocaleDateString()}
                    location={event.location}
                    imageUrl={event.image || "/placeholder.svg"}
                    seatsLeft={event.maxParticipants ? (event.maxParticipants - event.participantCount).toString() : "unlimited"}
                    participants={event.participantCount}
                    meetingStarted={event.meetingStarted}
                    status={event.status}
                    eventId={event.eventId}           
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  You haven't joined any events yet.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.length > 0 ? (
                activeEvents.map((event) => (
                  <JoinedEventCard
                    key={event.id}
                    id={event.id}
                    title={event.name}
                    date={new Date(event.startTime).toLocaleDateString()}
                    location={event.location}
                    imageUrl={event.image || "/placeholder.svg"}
                    seatsLeft={event.maxParticipants ? (event.maxParticipants - event.participantCount).toString() : "unlimited"}
                    participants={event.participantCount}
                    meetingStarted={event.meetingStarted}
                    status={event.status}
                    eventId={event.eventId}           
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  No active events at the moment.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledEvents.length > 0 ? (
                scheduledEvents.map((event) => (
                  <JoinedEventCard
                    key={event.id}
                    id={event.id}
                    title={event.name}
                    date={new Date(event.startTime).toLocaleDateString()}
                    location={event.location}
                    imageUrl={event.image || "/placeholder.svg"}
                    seatsLeft={event.maxParticipants ? (event.maxParticipants - event.participantCount).toString() : "unlimited"}
                    participants={event.participantCount}
                    meetingStarted={event.meetingStarted}
                    status={event.status}
                    eventId={event.eventId}           
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  No scheduled events at the moment.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="ended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endedEvents.length > 0 ? (
                endedEvents.map((event) => (
                  <JoinedEventCard
                    key={event.id}
                    id={event.id}
                    title={event.name}
                    date={new Date(event.startTime).toLocaleDateString()}
                    location={event.location}
                    imageUrl={event.image || "/placeholder.svg"}
                    seatsLeft={event.maxParticipants ? (event.maxParticipants - event.participantCount).toString() : "unlimited"}
                    participants={event.participantCount}
                    meetingStarted={event.meetingStarted}
                    status={event.status}
                    eventId={event.eventId}           
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  No ended events yet.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
