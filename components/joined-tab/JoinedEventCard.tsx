import { BellIcon, CalendarIcon, DownloadIcon, MapPinIcon, UsersIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"

type EventCardProps = {
  id: string
  title: string
  date: string
  location: string
  imageUrl: string
  seatsLeft: string
  participants: number
  meetingStarted: boolean
  eventId: string
  status: string
}

export default function JoinedEventCard({ id, title, date, location, imageUrl, seatsLeft, participants, meetingStarted, status, eventId }: EventCardProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  const handleNotifyMe = async () => {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });
      alert('You will be notified when this event starts');
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      alert('Failed to subscribe to notifications');
    }
  };

  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" />
        {status && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            status === "ACTIVE" 
              ? "bg-green-500 text-white" 
              : status === "SCHEDULED" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-500 text-white"
          }`}>
            {status}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center mb-2">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>{date}</span>
        </div>
        <div className="flex items-center mb-2">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="font-semibold">{seatsLeft}</span> seats left
          </div>
          <div className="flex items-center text-sm">
            <UsersIcon className="h-5 w-5 mr-1" />
            <span>{participants} participants</span>
          </div>
        </div>
        
        {status === "ACTIVE" && meetingStarted && (
          <Button 
            className="w-full"
            onClick={() => {
              window.location.href = `/join-meeting/${eventId}`;
            }}
          >
            Join Meeting
          </Button>
        )}

        {status === "SCHEDULED" && (
          <Button 
            className="w-full"
            variant="outline"
            onClick={handleNotifyMe}
          >
            <BellIcon className="h-4 w-4 mr-2" />
            Notify Me
          </Button>
        )}

        {status === "ENDED" && (
          <Link href={`/api/certificates/download?eventId=${eventId}&userId=${userId}`} passHref>
            <Button 
              className="w-full" 
              variant="outline"
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
