"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BarChart3,
  Calendar,
  Clock,
  Edit,
  FileCheck,
  MapPin,
  Trash2,
  Users,
  ChevronLeft,
  Share2,
  ArrowUpRight,
  BarChart4,
  Video,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getEventInfo } from "@/app/actions/eventInfo"
import { use, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { EditEventDialog } from "@/components/event-tab/EditEventDialog"
import { useSession} from "next-auth/react";

const animationStyles = {
  "@keyframes pulseSlow": {
    "0%, 100%": { boxShadow: "0 0 15px rgba(255,255,255,0.5)" },
    "50%": { boxShadow: "0 0 25px rgba(255,255,255,0.8)" },
  },
  ".animate-pulse-slow": {
    animation: "pulseSlow 3s infinite",
  },
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Unwrap the params promise
  const { eventId } = use(params)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventInfo(eventId, session?.user.id || 0);
        
        if ('error' in data) {
          throw new Error(data.error);
        }

        setEvent(data);

        // Check if current user is the event owner
        if (session?.user.id !== data.createdBy.id) {
          toast({
            title: "Unauthorized",
            description: "You are not the owner of this event",
            variant: "destructive",
          });
          router.push("/account/manage-events");
          return;
        }

      
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch event";
        setError(errorMessage);
        console.error("Error:", JSON.stringify({ error: errorMessage }, null, 2));
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchEvent();
    }
  }, [eventId, session, router, toast]);

  const handleDeleteEvent = async () => {
    if (!event) return;

    try {
      const response = await fetch("/api/event/deleteevent", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: event.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      router.push("/account/manage-events");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleStartMeeting = () => {
    router.push(`/account/manage-events/startmeeting/${eventId}`)
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
        {/* Back button skeleton */}
        <div className="w-32 h-6 bg-muted rounded animate-pulse"></div>

        {/* Action buttons skeleton */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <div className="w-40 h-10 bg-muted rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-32 h-10 bg-muted rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* Image skeleton */}
        <div className="relative">
          <div className="aspect-video w-full bg-muted rounded-lg animate-pulse"></div>
        </div>

        {/* Title and description skeleton */}
        <div className="space-y-4 pt-4">
          <div className="w-3/4 h-10 bg-muted rounded animate-pulse"></div>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-6 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <Card className="p-6 border-destructive">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Error Loading Event</h2>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <Button variant="outline" onClick={() => router.push("/account/manage-events")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <Card className="p-6 border-destructive">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <FileCheck className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Event Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="outline" onClick={() => router.push("/account/manage-events")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
      <style jsx global>{`
  @keyframes pulseSlow {
    0%, 100% { box-shadow: 0 0 15px rgba(255,255,255,0.5); }
    50% { box-shadow: 0 0 25px rgba(255,255,255,0.8); }
  }
  .animate-pulse-slow {
    animation: pulseSlow 3s infinite;
  }
`}</style>
      {/* Back button */}
      <div>
        <Link
          href="/account/manage-events"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>
      </div>

      {/* Action buttons bar - positioned above the image */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="shadow-md">
            <FileCheck className="mr-2 h-4 w-4" />
            Manage Certificates
          </Button>
          <Button variant="outline" className="shadow-md" onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="shadow-md">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          {event.status === "SCHEDULED" && (
            <Button
              variant="default"
              className="shadow-md bg-green-600 hover:bg-green-700"
              onClick={handleStartMeeting}
            >
              <Video className="mr-2 h-4 w-4" />
              Start Meeting Now
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shadow-md">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this event and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDeleteEvent}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main card */}
      <div className="relative">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={event.image || ""}
              alt="Event cover image"
              className="object-cover shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse-slow"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
              {event.status}
            </Badge>
          </div>
        </Card>
      </div>

      <EditEventDialog
        event={event}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(updatedEvent: any) => {
          setEvent((prev: any) => ({ 
            ...updatedEvent,
            createdBy: prev.createdBy
          }));
        }}
      />

      {/* Title and description */}
      <div className="space-y-4 pt-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.name}</h1>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(event.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{new Date(event.startTime).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{event.participantCount} Registered</span>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">{event.description}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">Technology</Badge>
          <Badge variant="outline">Web Development</Badge>
          <Badge variant="outline">AI & Machine Learning</Badge>
          <Badge variant="outline">Networking</Badge>
        </div>
      </div>

      <Separator />

      {/* Tabbed content */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-4 sm:w-[600px]">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Event Information</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <Button variant="outline" className="w-full mt-4">
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Registration Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total capacity</span>
                  <span className="font-medium">{event.maxParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registered</span>
                  <span className="font-medium">{event.participantCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="font-normal">
                    {event.maxParticipants === null ? "Not Limited" : event.maxParticipants - event.participantCount}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width:
                        event.maxParticipants === null
                          ? "2%"
                          : `${(event.participantCount / event.maxParticipants) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <Button className="w-full mt-4">Manage Registrations</Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View Public Page
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Certificate Templates
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="schedule">
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Event {event.status}</h3>
            <p className="text-muted-foreground">
              {event.status === "ENDED"
                ? "This event has concluded. Thank you to all participants!"
                : event.status === "SCHEDULED"
                  ? "This event is scheduled to start soon. Please check back at the scheduled time."
                  : event.status === "ACTIVE"
                    ? "The meeting is currently in progress. Join now to participate!"
                    : "Event status information is not available"}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="speakers">
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Event Speakers</h3>
            <p className="text-muted-foreground">{event.createdBy.name}</p>
          </div>
        </TabsContent>
        <TabsContent value="attendees">
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Registered Attendees</h3>
            {event.participants?.length > 0 ? (
              event.participants.map((participant: any) => (
                <Badge variant="outline" key={participant.id} className="inline-block mr-2">
                  {participant.email}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No attendees yet</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

