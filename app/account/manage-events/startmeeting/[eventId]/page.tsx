"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getEventById } from "@/app/actions/events";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CertificateFlow } from "@/components/event-tab/CertificateFlow";


const Room = () => {
  const { eventId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const myMeeting = useRef<HTMLDivElement>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const id = Number(session?.user.id);
  const [showEndMeetingDialog, setShowEndMeetingDialog] = useState(false);
  const [eventData, setEventData] = useState<any>(null);

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
      console.log(event);
      
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
      
      zp.joinRoom({
        container: myMeeting.current,
        sharedLinks: [
          {
            name: "Personal link",
            url: `${window.location.origin}${window.location.pathname}?roomID=${meetingId}`,
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
        onLeaveRoom: () => {
          handleEndMeeting();
          
        }
      });
    };

    startMeeting();
  }, [eventId, isSessionReady, session, router]);

  const handleEndMeeting = async () => {
    try {
      const response = await fetch('/api/event/end-meeting', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ eventId })
      });

      if (response.ok) {
        const endedEvent = await response.json();
        setEventData(endedEvent);
        setShowEndMeetingDialog(true);
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  };

  return (
    <>
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100vw", height: "100vh" }}
      ></div>

      <Dialog open={showEndMeetingDialog} onOpenChange={setShowEndMeetingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meeting Ended</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              The meeting has been successfully ended. Would you like to distribute certificates now?
            </p>
            
            <CertificateFlow 
              event={eventData} 
              onComplete={() => {
                setShowEndMeetingDialog(false);
                router.push(`/account/manage-events`);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Room;
