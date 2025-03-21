"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import SparklesText from "@/components/ui/sparkles-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonIcon } from "@radix-ui/react-icons";


interface Event {
  id: number;
  name: string;
  location: string;
  image: string | null;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  participantCount:number,
  maxParticipants?:number,
  eventId:string,
  ispublic:boolean,
  islimited:boolean,
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
}

export default function Page() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [retryCount, setRetryCount] = useState(0);
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchEvents = useCallback(async (pageNumber: number, retry = retryCount): Promise<void> => {
    try {
      setIsLoadingMore(true);
      const response = await fetch(`/api/event/displayallevent?page=${pageNumber}&pageSize=6`);
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const { data, total, totalPages } = await response.json();
      setTotalPages(totalPages);
      
      if (pageNumber === 1) {
        setEvents(data);
        setInitialLoading(false);
        setLoadedPages(new Set([1]));
      } else {
        const newEvents = data.filter((newEvent: Event) => 
          !events.some(existingEvent => existingEvent.eventId === newEvent.eventId)
        );
        
        if (newEvents.length > 0) {
          setEvents(prev => [...prev, ...newEvents]);
          setLoadedPages(prev => new Set([...prev, pageNumber]));
        }
      }
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error fetching events:", error);
      if (retry < 3) {
        toast({
          title: "Error",
          description: `Failed to load events. Retrying... (${retry + 1}/3)`,
          variant: "destructive",
        });
        setTimeout(() => fetchEvents(pageNumber, retry + 1), 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to load events after multiple attempts. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingMore(false);
      
    }
  }, [events]);

  useEffect(() => {
    if (!loadedPages.has(page)) {
      fetchEvents(page);
    }
  }, [page, fetchEvents, loadedPages]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleJoinEvent = async (event: Event) => {
    setJoiningEventId(event.eventId);
    let pin: string | null = null;
    
    // Prompt for PIN if it's a private event
    if (!event.ispublic) {
      pin = prompt("Enter event PIN:");
      if (!pin) {
        toast({
          title: "Error",
          description: "PIN is required for private events",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const response = await fetch("/api/event/joinevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.eventId,
          pin: pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join event");
      }

      // Update UI state
      setEvents(prevEvents =>
        prevEvents.map(prevEvent =>
          prevEvent.eventId === event.eventId
            ? { ...prevEvent, participantCount: prevEvent.participantCount + 1 }
            : prevEvent
        )
      );

      toast({
        title: "Success",
        description: `You've joined ${event.name}`,
        variant: "default",
      });
    } catch ( error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setJoiningEventId(null);
    }
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="border p-4 rounded shadow space-y-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200" />
          <Skeleton className="h-4 w-1/2 bg-gray-200" />
          <Skeleton className="h-4 w-1/3 bg-gray-200" />
          <Skeleton className="h-4 w-1/3 bg-gray-200" />
          <Skeleton className="h-3 w-2/3 bg-gray-200" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 overflow-y-auto">
        <SparklesText
          text="Recent Events"
          className="text-center text-4xl font-semibold text-gray-200"
          colors={{ first: "#29cb15", second: "#fff000" }}
          sparklesCount={7}
        />
        <h2 className="text-center text-blue-900 text-1xl dark:text-[#4d4d4d]">
          (These Are Mixed Events)
        </h2>

        {isLoadingMore && <SkeletonLoader />}

        {initialLoading ? (
          <SkeletonLoader />
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {events
                .filter(event => 
                  Math.ceil((events.indexOf(event) + 1) / 6) === page
                )
                .map((event) => (
                  <div key={event.eventId} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
                    <img 
                      src={event.image || "/default-event.jpg"} 
                      alt={event.name}
                      className="w-full h-48 object-cover rounded-t"
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{event.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${event.maxParticipants ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {event.maxParticipants ? 'Private' : 'Public'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="space-y-3">
                          {/* Row 1 */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.endTime).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Row 2 */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {new Date(event.endTime).toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.participantCount} joined
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <PersonIcon className="w-4 h-4" />
                              {event.createdBy.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4" />
                              {event.maxParticipants ? 
                                `${event.maxParticipants - event.participantCount} seats left` : 
                                "Unlimited"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handleJoinEvent(event)}
                        disabled={joiningEventId === event.eventId || 
                                 (event.participantCount === event.maxParticipants) ||
                                 (event.createdBy.id === session?.user.id)}
                      >
                        {joiningEventId === event.eventId ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Joining...
                          </div>
                        ) : (
                          "Join Now"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="flex relative justify-center gap-4 mt-8 mb-2 bottom-4 py-4">
              <Button 
                onClick={handlePreviousPage} 
                disabled={page === 1}
                className="disabled:opacity-50 px-6 py-3 touch-manipulation"
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button 
                onClick={handleNextPage} 
                disabled={page === totalPages}
                className="disabled:opacity-50 px-6 py-3 touch-manipulation"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center mt-6">No events found</div>
        )}
      </div>
    </div>
  );
}
