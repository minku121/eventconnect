"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getEventById } from "@/app/actions/events";
import { Loader2 } from "lucide-react";

const JoinMeetingPage = () => {
  const { eventId } = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const router = useRouter();
  const meetingRef = useRef<HTMLDivElement>(null);
  const attendanceRecorded = useRef(false);
  const zegoInstanceRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const callEventApi = async (endpoint: string, message: string) => {
    try {
      console.log(`${message} for event: ${eventId}`);
      const response = await fetch(`/api/event/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`${message} failed:`, errorData);
        return { success: false, data: errorData };
      }
      
      const data = await response.json().catch(() => ({}));
      console.log(`${message} completed:`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`${message} error:`, error);
      return { success: false, error };
    }
  };

  // Unified leave meeting function that handles both manual and automatic leaves
  const handleLeaveMeeting = async (redirectPath = '/account/events') => {
    if (isLeaving) return; // Prevent duplicate leave calls
    
    setIsLeaving(true);
    
    try {
      // Ensure Zego instance leaves room
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.leaveRoom();
      }
      
      // Record the leave in the backend
      const result = await callEventApi('leave-event', 'Recording leave');
      
      // Only redirect after we get a response from the leave-event API
      if (result.success) {
        console.log("Leave event recorded successfully, redirecting...");
      } else {
        console.error("Failed to record leave event, redirecting anyway...");
      }
    } catch (error) {
      console.error('Error during leave process:', error);
    } finally {
      setIsLeaving(false);
      router.push(redirectPath);
    }
  };

  // Improved event status checker
  const checkEventStatus = async () => {
    const { success, data } = await callEventApi(`${eventId}/status`, 'Checking event status');
    
    if (success && data?.status === "ENDED") {
      console.log("Meeting ended by admin. Handling user exit...");
      await handleLeaveMeeting('/account/events/joined-events');
    }
    
    return { success, data };
  };

  // Setup the meeting
  useEffect(() => {
    const setupMeeting = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        if (!eventId || !userId) {
          throw new Error("Missing required information: Event ID or user ID");
        }
        
        // First check the event status before joining
        const statusCheck = await checkEventStatus();
        
        if (statusCheck.success) {
          // Only allow joining if meeting is active
          if (statusCheck.data?.status !== "ACTIVE") {
            setErrorMessage(`This meeting is not active. Current status: ${statusCheck.data?.status}`);
            setTimeout(() => router.push('/account/events/joined-events'), 2000);
            return;
          }
        }

        // Get event details
        const event = await getEventById(eventId as string, userId);
        
        // Event validation
        if (event.status === "ENDED") {
          setErrorMessage(`This meeting has already ended. Status: ${event.status}`);
          setTimeout(() => router.push('/account/events/joined-events'), 2000);
          return;
        }

        const isParticipant = event.participants?.some(
          (user: any) => user.id === session?.user?.id
        );

        if (!isParticipant) {
          setErrorMessage("You are not authorized to attend this meeting");
          setTimeout(() => router.push("/account/events/joined-events"), 2000);
          return;
        }

        // ZEGO setup
        const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";
        const meetingId = event.meetingId || `event-${eventId}`;
        const userName = session?.user?.name || "Participant";
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          meetingId,
          Date.now().toString(),
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;
        
        // Record attendance once with retry logic
        const recordAttendance = async () => {
          if (!attendanceRecorded.current) {
            console.log("Recording attendance for the meeting...");
            
            // First attempt
            let { success } = await callEventApi('record-attendance', 'Recording attendance');
            
            // Retry once if failed
            if (!success) {
              console.log("Retrying attendance recording...");
              const retryResult = await callEventApi('record-attendance', 'Retrying attendance recording');
              success = retryResult.success;
            }
            
            if (success) {
              console.log("Successfully recorded attendance");
              attendanceRecorded.current = true;
            } else {
              console.error("Failed to record attendance after retry");
            }
          } else {
            console.log("Attendance already recorded for this session");
          }
        };

        // Join the meeting room
        zp.joinRoom({
          container: meetingRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
            config: { role: ZegoUIKitPrebuilt.Audience },
          },
          showScreenSharingButton: true,
          showUserList: false,
          onJoinRoom: async () => {
            console.log("Successfully joined the meeting room, recording attendance...");
            await recordAttendance();
          },
          onLeaveRoom: () => {
            if (!isLeaving) {
              handleLeaveMeeting('/account/events/joined-events');
            }
          }
        });
        
        // Backup attendance recording
        setTimeout(() => {
          if (!attendanceRecorded.current) {
            console.log("Backup attendance recording...");
            recordAttendance();
          }
        }, 5000);
      } catch (error) {
        console.error("Error setting up meeting:", error);
        setErrorMessage("Failed to join the meeting. Please try again.");
        setTimeout(() => router.push('/account/joined-events'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) setupMeeting();
  }, [session, router, eventId, userId]);

  // Status checking interval
  useEffect(() => {
    if (!session || !eventId) return;
    
    const intervalId = setInterval(checkEventStatus, 10000);
    console.log("Set up meeting status check every 10 seconds");
    
    return () => {
      console.log("Cleaning up meeting status check interval");
      clearInterval(intervalId);
    };
  }, [session, eventId]);

  // Handle error state
  if (errorMessage) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg border flex flex-col items-center gap-4 shadow-lg">
          <p className="text-red-500">{errorMessage}</p>
          <p className="text-card-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg border flex flex-col items-center gap-4 shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-card-foreground">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={meetingRef}
        style={{ width: "100vw", height: "100vh" }}
      />
      {isLeaving && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg border flex flex-col items-center gap-4 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-card-foreground">Leaving meeting...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinMeetingPage;