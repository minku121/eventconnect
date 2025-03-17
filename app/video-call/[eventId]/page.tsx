"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getEventById } from "@/app/actions/events";
import { Loader2 } from "lucide-react";

const VideoCallPage = () => {
  const { eventId } = useParams();
  const { data: session } = useSession();
  const id = Number(session?.user.id);
  const router = useRouter();
  const meetingRef = useRef<HTMLDivElement>(null);
  const attendanceRecorded = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const joinMeeting = async () => {
      const event = await getEventById(eventId as string,id);
      
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
      
      const recordAttendance = async () => {
        if (!attendanceRecorded.current) {
          try {
            const response = await fetch('/api/event/record-attendance', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ eventId })
            });
            
            if (response.ok) {
              attendanceRecorded.current = true;
            }
          } catch (error) {
            console.error('Error recording attendance:', error);
          }
        }
      };

      const recordLeave = async () => {
        try {
          const response = await fetch('/api/event/leave-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eventId })
          });
          
          if (!response.ok) {
            console.error('Failed to record leave');
          }
        } catch (error) {
          console.error('Error recording leave:', error);
        }
      };

      zp.joinRoom({
        container: meetingRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
          config: { role: ZegoUIKitPrebuilt.Audience },
        },
        showScreenSharingButton: true,
        showUserList: false,
        onLeaveRoom: async () => {
          setIsLeaving(true);
          try {
            await recordLeave();
          } finally {
            setIsLeaving(false);
            router.push('/account/events');
          }
        }
      });

      recordAttendance();
    };

    if (session) joinMeeting();
  }, [session, router, eventId]);

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
            <p className="text-card-foreground">Recording your attendance...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCallPage; 