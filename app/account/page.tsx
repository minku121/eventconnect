"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { SidebarComponent } from "@/components/inner/sidebar-content";
import SparklesText from "@/components/ui/sparkles-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  name: string;
  location: string;
  image: string | null;
  time: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [retryCount, setRetryCount] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
      if (!session) {
        signIn(); 
      }
    }
  }, [session, status]);

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
          !events.some(existingEvent => existingEvent.id === newEvent.id)
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
                  <div key={event.id} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
                    <img 
                      src={event.image || "/default-event.jpg"} 
                      alt={event.name}
                      className="w-full h-48 object-cover rounded-t"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </p>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(event.time).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(event.time).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button className="w-full mt-4">
                        Join Now
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="flex relative justify-center gap-4 mt-8 mb-2  bottom-4  py-4">
              <Button 
                onClick={handlePreviousPage} 
                disabled={page === 1}
                className="disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="flex items-center">
                Page {page} of {totalPages}
              </span>
              <Button 
                onClick={handleNextPage} 
                disabled={page === totalPages}
                className="disabled:opacity-50"
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
