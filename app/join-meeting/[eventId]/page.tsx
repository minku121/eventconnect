"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getEventById } from "@/app/actions/events";

export default function JoinMeeting() {
  const { eventId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const myMeeting = useRef<HTMLDivElement>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [eventData, setEventData] = useState<any>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState<boolean>(false);
  const zpRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecordingAttendance, setIsRecordingAttendance] = useState(false);
  const [isLeavingMeeting, setIsLeavingMeeting] = useState(false);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      setIsSessionReady(true);
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Status polling effect
  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  const startStatusPolling = () => {
    // Clear any existing interval
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }

    // Set up new polling interval
    statusIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/event/${eventId}/status`);
        if (!response.ok) {
          throw new Error('Status check failed');
        }
        const data = await response.json();
        if(data.status === "ENDED"){
          alert("The meeting might have ended.");
          handleLeaveRoom();
        }
      } catch (error) {
        console.error("Failed to get meeting status:", error);
        alert("Failed to get meeting status. The meeting might have ended.");
      }
    }, 10000);
  };

  useEffect(() => {
    if (!isSessionReady) return;

    const joinMeeting = async () => {
      try {
        const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

        if (!appID || !serverSecret) {
          console.error("Missing ZegoCloud credentials");
          alert("Video conferencing service is not properly configured.");
          router.push('/account/events');
          return;
        }

        const event = await getEventById(eventId as string, Number(session?.user.id));

        setEventData(event);
        
        // Check if the response is an error object
        if ('error' in event) {
          alert(event.error || "Failed to get meeting information");
          router.push('/account/events');
          return;
        }
        
        
        if (!event.meetingId || !event.meetingStarted || event.status!=="ACTIVE") {
          alert("Meeting not found or not started yet");
          router.push('/account/events');
          return;
        }

        const meetingId = event.meetingId as string;
        
      
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          meetingId,
          Date.now().toString(),
          session?.user?.name || "Participant"
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;
        
        zp.joinRoom({
          container: myMeeting.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          showPreJoinView: true,
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showLeavingView: false,
          onLeaveRoom: () => handleLeaveRoom(),
          showUserList: false,
          showScreenSharingButton: true,
          onJoinRoom: async () => {
            try {
              setIsRecordingAttendance(true);
              await fetch('/api/event/record-attendance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventId })
              });
              console.log("Attendance recorded successfully");
              // Start polling for meeting status after successful join
              startStatusPolling();
            } catch (error) {
              console.error("Error recording attendance:", error);
            } finally {
              setIsRecordingAttendance(false);
            }
          }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error joining meeting:", error);
        alert("Failed to join meeting");
        router.push('/account/events');
      }
    };

    joinMeeting();
  }, [isSessionReady, eventId, router, session?.user.id, session?.user.name]);

  const handleLeaveRoom = async () => {
    try {
      // Clear status polling interval
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
      
      setIsLeavingMeeting(true);
      await fetch('/api/event/leave-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      });
      setIsLeavingMeeting(false);
      alert("Successfully left the meeting");

     window.location.href = '/account/events/joined-events';

    } catch (error) {
      console.error("Error leaving meeting:", error);
      setIsLeavingMeeting(false);
      router.push('/account/events/joined-events');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Joining meeting...</p>
          </div>
        </div>
      ) : (
        <>
          {isRecordingAttendance && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-background p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg">Mapping joining time...</p>
              </div>
            </div>
          )}
          {isLeavingMeeting && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-background p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg">Leaving meeting...</p>
              </div>
            </div>
          )}
          <div className="flex-1" ref={myMeeting} />
          <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Meeting</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave this meeting?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeaveRoom}>Leave</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
