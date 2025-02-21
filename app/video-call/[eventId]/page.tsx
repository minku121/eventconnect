"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getEventById } from "@/app/actions/events";

const VideoCallPage = () => {
  const { eventId } = useParams();
  const { data: session } = useSession();
  const id = Number(session?.user.id);
  const router = useRouter();
  const meetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const joinMeeting = async () => {
      const event = await getEventById(eventId as string,id);
      
      // Validate user participation
      const isParticipant = event.participants?.some(
        (user: any) => user.id === session?.user?.id
      );

      if (!isParticipant) {
        alert("You are not authorized to attend this meeting");
        router.push("/account/events");
        return;
      }

      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";
      
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        event.meetingId || "default-meeting-id",
        Date.now().toString(),
        session?.user?.name || "Participant"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      zp.joinRoom({
        container: meetingRef.current,
        scenario: { 
            mode: ZegoUIKitPrebuilt.GroupCall,
            config: { role: ZegoUIKitPrebuilt.Audience }
          },
        showScreenSharingButton: false,
        showUserList: true,
      });
    };

    if (session) joinMeeting();
  }, [session, router, eventId]);

  return (
    <div
      ref={meetingRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default VideoCallPage; 