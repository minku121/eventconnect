"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { SidebarComponent } from "@/components/inner/sidebar-content";
import SparklesText from "@/components/ui/sparkles-text";

interface Event {
  id: number;
  name: string;
  location: string;
  image: string | null;
  time: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export default function Account() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<Event[]>([]);

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

  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        const response = await fetch("/api/event/displayallevent");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = (): void => {
    signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:block md:w-1/5 lg:w-1/4 xl:w-1/5">
        <SidebarComponent />
      </div>

      {/* Main Content */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow">
              <h3 className="font-bold text-lg">{event.name}</h3>
              <p>Location: {event.location}</p>
              <p>Date: {new Date(event.time).toLocaleDateString()}</p>
              <p>Time: {new Date(event.time).toLocaleTimeString()}</p>
              <p className="text-gray-600 text-sm">
                Created At: {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
