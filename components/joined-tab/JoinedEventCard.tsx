import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import Image from "next/image"

type EventCardProps = {
  id: string
  title: string
  date: string
  location: string
  imageUrl: string
  seatsLeft: number
  participants: number
  meetingStarted: boolean
  eventId:string
  hasCertificate: boolean
  isPaidCertificate: boolean
}

export default function JoinedEventCard({ id, title, date, location, imageUrl, seatsLeft, participants, meetingStarted ,eventId, hasCertificate, isPaidCertificate }: EventCardProps) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" />
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
        <button 
          className={`w-full py-2 px-4 rounded-md transition duration-300 ${
            hasCertificate ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!hasCertificate}
          onClick={() => {
            if (isPaidCertificate) {
              // Handle payment flow
              alert('Redirecting to payment gateway...');
            } else {
              window.location.href = `/certificates/${eventId}`;
            }
          }}
        >
          {hasCertificate ? 
            (isPaidCertificate ? 'Purchase Certificate' : 'Download Certificate') : 
            'Certificate Not Available'}
        </button>
      </div>
    </div>
  )
}

