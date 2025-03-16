"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getEventById } from "@/app/actions/events";
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
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"


const Room = () => {
  const { eventId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const myMeeting = useRef<HTMLDivElement>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const id = Number(session?.user.id);
  const [eventData, setEventData] = useState<any>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState<boolean>(false);
  const zpRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setIsSessionReady(true);
    }
  }, [status]);

  useEffect(() => {
    if (!isSessionReady) return;

    const startMeeting = async () => {
      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

      if (!appID || !serverSecret) {
        console.error("Missing ZegoCloud credentials");
        alert("Video conferencing service is not properly configured.");
        return;
      }

      const event = await getEventById(eventId as string, id);
      setEventData(event);
      const meetingId = event.meetingId as string;
      const eventcreator = event.createdBy.id;
      const currentuser = session?.user?.id;
      
      if (!currentuser) {
        console.error("User ID not available");
        return;
      }
      
      if (currentuser !== eventcreator) {
        alert("You dont have permission to start this meeting");
        router.push('/account/manage-events');
        return false;
      }

      const startResponse = await fetch('/api/event/start-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      });

      if (!startResponse.ok) {
        console.error('Failed to start meeting');
        router.push('/account/manage-events');
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        meetingId,
        Date.now().toString(),
        session?.user?.name || "Host"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;
      
      zp.joinRoom({
        container: myMeeting.current,
        sharedLinks: [
          {
            name: "Personal link",
            url: `${window.location.origin}${'/video-call'}?roomID=${meetingId}`,
          },
        ],
        scenario: { 
          mode: ZegoUIKitPrebuilt.GroupCall,
          config: { role: ZegoUIKitPrebuilt.Host }
        },
        showScreenSharingButton: true,
        showUserList: true,
        showRemoveUserButton: true,
        showTurnOffRemoteCameraButton: true,
        showTurnOffRemoteMicrophoneButton: true,
        onLeaveRoom: async () => {
          setShowLeaveDialog(true);
        }
      });
    };

    startMeeting();
  }, [eventId, isSessionReady, session, router]);

  return (
    <>
      {showLeaveDialog && (
        <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure to end meeting permanently?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. 
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowLeaveDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                setIsLoading(true);
                try {
                  const response = await fetch('/api/event/end-meeting', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ eventId })
                  });
                  
                  if (!response.ok) throw new Error('Failed to end meeting');
                  
                  router.push('/account/manage-events');
                } catch (error) {
                  console.error('Error ending meeting:', error);
                  setIsLoading(false);
                  setShowLeaveDialog(false);
                  alert('Failed to end meeting. Please try again.');
                }
              }}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Ending meeting...</p>
          </div>
        </div>
      )}

      <div
        className="myCallContainer fixed w-full h-full flex items-center justify-center"
        ref={myMeeting}
        style={{ width: "90%", height: "100%", position: "absolute" }}
      ></div>
    </>
  );
};

export default Room;
