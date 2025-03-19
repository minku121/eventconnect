"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEventInfo } from "@/app/actions/eventInfo"
import { use, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  ChevronLeft,
  Download,
  Send,
  FileCheck,
  Users,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

interface Attendee {
  id: number;
  name: string;
  email: string;
  hasCertificate: boolean;
  certificateId?: number;
  certificateIssueDate?: string;
}

interface Certificate {
  id: number;
  eventId: string;
  userId: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

const certificateTemplates = [
  {
    id: 1,
    name: "Professional",
    image: "/certificate-templates/template1.png",
    description: "A clean, modern professional certificate design",
  },
  {
    id: 2,
    name: "Academic",
    image: "/certificate-templates/template2.png",
    description: "Traditional academic style certificate",
  },
  {
    id: 3,
    name: "Creative",
    image: "/certificate-templates/template3.png",
    description: "Bold, colorful design for creative events",
  },
  {
    id: 4,
    name: "Minimal",
    image: "/certificate-templates/template4.png",
    description: "Simple, elegant minimal design certificate",
  },
]

export default function CertificatesPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { data: session, status } = useSession()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [sendingCertificates, setSendingCertificates] = useState(false)
  const [certificates, setCertificates] = useState<any[]>([])
  const [loadingCertificates, setLoadingCertificates] = useState(true)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([])
  const [sendProgress, setSendProgress] = useState<number>(0)

  // Unwrap the params promise
  const { eventId } = use(params)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventInfo(eventId, session?.user.id || 0)

        if ('error' in data) {
          throw new Error(data.error)
        }

        setEvent(data)

        // Check if current user is the event owner
        if (session?.user.id !== data.createdBy.id) {
          toast({
            title: "Unauthorized",
            description: "You are not the owner of this event",
            variant: "destructive",
          })
          router.push("/account/manage-events")
          return
        }

        // Fetch the certificate template for this event if it exists
        const templateRes = await fetch(`/api/certificates/template?eventId=${encodeURIComponent(eventId)}`)
        const templateData = await templateRes.json()
        
        if (templateData.templateId) {
          setSelectedTemplate(templateData.templateId)
        }

        // Fetch certificates for this event
        await fetchCertificates()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch event"
        setError(errorMessage)
        console.error("Error:", JSON.stringify({ error: errorMessage }, null, 2))
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchEvent()
    }
  }, [eventId, session, router, toast])

  const fetchCertificates = async () => {
    setLoadingCertificates(true)
    try {
      const res = await fetch(`/api/certificates/list?eventId=${encodeURIComponent(eventId)}`)
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch certificates")
      }
      
      setCertificates(data.certificates || [])
      
      // Get attendees data including who has certificates
      const attendeesResponse = await fetch(`/api/event/${encodeURIComponent(eventId)}/attendees`)
      if (!attendeesResponse.ok) throw new Error("Failed to fetch attendees")
      
      const attendeesData = await attendeesResponse.json()
      
      // Map attendees with certificate information
      const processedAttendees = attendeesData.attendees.map((attendee: any) => {
        const certificate = data.certificates.find(
          (cert: Certificate) => cert.userId === attendee.id
        );
        
        return {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          hasCertificate: Boolean(certificate),
          certificateId: certificate?.id,
          certificateIssueDate: certificate?.createdAt,
        };
      });
      
      setAttendees(processedAttendees)
    } catch (error) {
      console.error("Error fetching certificates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch certificates",
        variant: "destructive",
      })
    } finally {
      setLoadingCertificates(false)
    }
  }

  const handleTemplateSelect = async (templateId: number) => {
    try {
      const res = await fetch("/api/certificates/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          templateId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to set certificate template")
      }

      setSelectedTemplate(templateId)
      toast({
        title: "Success",
        description: "Certificate template has been set",
      })
    } catch (error) {
      console.error("Error setting certificate template:", error)
      toast({
        title: "Error",
        description: "Failed to set certificate template",
        variant: "destructive",
      })
    }
  }

  const handleSendCertificates = async (sendToAll: boolean = false) => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a certificate template first",
        variant: "destructive",
      })
      return
    }

    if (!sendToAll && selectedAttendees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one attendee to send certificates to",
        variant: "destructive",
      })
      return
    }

    setSendingCertificates(true)
    setSendProgress(20)
    
    try {
      const payload = {
        eventId,
        sendToAll,
        userIds: sendToAll ? [] : selectedAttendees,
      };
      
      console.log('Sending certificates payload:', payload);
      
      // Ensure the payload is properly JSON-serializable
      const stringifiedPayload = JSON.stringify(payload);
      console.log('Stringified payload:', stringifiedPayload);
      
      const response = await fetch(`/api/certificates/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: stringifiedPayload,
      });
      
      setSendProgress(70);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Certificate send error:', errorData);
        throw new Error(errorData.error || errorData.details || "Failed to send certificates");
      }
      
      const result = await response.json();
      
      setSendProgress(100);
      
      toast({
        title: "Success",
        description: `${result.message}`,
      });
      
      // Refresh the certificates list
      await fetchCertificates()
      setSelectedAttendees([])
      
    } catch (error) {
      console.error("Error sending certificates:", error)
      toast({
        title: "Error",
        description: "Failed to send certificates",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setSendingCertificates(false)
        setSendProgress(0)
      }, 1000)
    }
  }

  const handleDownloadCertificate = async (userId: number) => {
    // Direct download using URL
    window.open(`/api/certificates/download?eventId=${eventId}&userId=${userId}`, '_blank');
  }

  const handleSelectAllAttendees = (checked: boolean) => {
    if (checked) {
      // Only select attendees who don't have certificates yet if we're on the "Send Certificates" tab
      const ids = attendees.filter(a => !a.hasCertificate).map(a => a.id)
      setSelectedAttendees(ids)
    } else {
      setSelectedAttendees([])
    }
  };

  const handleSelectAttendee = (attendeeId: number, checked: boolean) => {
    if (checked) {
      setSelectedAttendees([...selectedAttendees, attendeeId])
    } else {
      setSelectedAttendees(selectedAttendees.filter(id => id !== attendeeId))
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
        <div className="w-32 h-6 bg-muted rounded animate-pulse"></div>
        <div className="w-full h-64 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <Card className="p-6 border-destructive">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <FileCheck className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Error Loading Event</h2>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <Button variant="outline" onClick={() => router.push(`/account/manage-events/${eventId}`)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Event
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
      {/* Back button */}
      <div>
        <Link
          href={`/account/manage-events/${eventId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Event
        </Link>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{event.name} - Certificates</h1>
          <p className="text-muted-foreground">
            Manage and send certificates for attendees of your event
          </p>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="templates">Certificate Templates</TabsTrigger>
            <TabsTrigger value="issued">Issued Certificates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Select a Certificate Template</h2>
              {selectedTemplate && (
                <div className="space-x-2">
                  <Button 
                    onClick={() => handleSendCertificates(true)}
                    disabled={event.status !== "ENDED" || sendingCertificates}
                    variant="outline"
                  >
                    {sendingCertificates ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Send to All
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => handleSendCertificates(false)}
                    disabled={event.status !== "ENDED" || sendingCertificates || selectedAttendees.length === 0}
                  >
                    {sendingCertificates ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send to Selected ({selectedAttendees.length})
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            {event.status !== "ENDED" && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                <p className="text-amber-800">
                  <strong>Note:</strong> Certificates can only be sent after the event has ended.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificateTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`overflow-hidden relative cursor-pointer border-2 ${selectedTemplate === template.id ? "border-primary" : "border-muted"}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="aspect-[8.5/11] relative bg-muted">
                    <Image
                      src={template.image}
                      alt={template.name}
                      className="object-cover"
                      fill
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{template.name}</h3>
                      {selectedTemplate === template.id && (
                        <Badge className="bg-primary">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="issued" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Issued Certificates</h2>
              <Button variant="outline" onClick={fetchCertificates}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loadingCertificates ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            
            {loadingCertificates ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : attendees.length > 0 ? (
              <ScrollArea className="h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          onCheckedChange={(checked) => 
                            handleSelectAllAttendees(checked === true)
                          } 
                          checked={selectedAttendees.length === attendees.filter(a => a.hasCertificate).length && selectedAttendees.length > 0}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendees
                      .filter(attendee => attendee.hasCertificate)
                      .map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell>
                            <Checkbox 
                              onCheckedChange={(checked) => 
                                handleSelectAttendee(attendee.id, checked === true)
                              }
                              checked={selectedAttendees.includes(attendee.id)}
                            />
                          </TableCell>
                          <TableCell>{attendee.name}</TableCell>
                          <TableCell>{attendee.email}</TableCell>
                          <TableCell>
                            {attendee.certificateIssueDate ? formatDate(attendee.certificateIssueDate) : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDownloadCertificate(attendee.id)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <Card className="p-8 flex flex-col items-center justify-center text-center">
                <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Certificates Issued Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Once you issue certificates, they will appear here.
                </p>
                <Button variant="outline" onClick={() => (document.querySelector('[value="templates"]') as HTMLElement)?.click()}>
                  Select Template
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
