"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getEventById } from "@/app/actions/events";


const Room = () => {

  const { eventId } = useParams();

  const { data: session, status } = useSession();

  const router = useRouter();

  const myMeeting = useRef<HTMLDivElement>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const id = Number(session?.user.id);
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

      const event = await getEventById(eventId as string,id);
      const meetingId = event.meetingId as string ;
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

      // Update meeting status in DB
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
      });
    };

    startMeeting();
  }, [eventId, isSessionReady, session, router]);

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
};

export default Room;
