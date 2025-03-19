"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface Notification {
  id: number
  type: string
  message: string
  read: boolean
  createdAt: string
}

export default function DisplayNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchNotifications = async () => {
    if (!session?.user?.id) return
    
    setRefreshing(true)
    try {
      const res = await fetch(`/api/notifications/list`)
      
      if (!res.ok) {
        throw new Error("Failed to fetch notifications")
      }
      
      const data = await res.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
    }
  }, [session?.user?.id])

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/markAsRead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      
      if (!res.ok) {
        throw new Error("Failed to mark notification as read")
      }
      
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
      
      toast({
        title: "Success",
        description: "Notification marked as read",
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const removeNotification = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      
      if (!res.ok) {
        throw new Error("Failed to remove notification")
      }
      
      setNotifications(notifications.filter(n => n.id !== id))
      
      toast({
        title: "Success",
        description: "Notification removed",
      })
    } catch (error) {
      console.error("Error removing notification:", error)
      toast({
        title: "Error",
        description: "Failed to remove notification",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-full border-none h-screen">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchNotifications}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          {loading ? (
            <div className="flex flex-col space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-muted animate-pulse h-24"></div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No notifications</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchNotifications}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${notification.read ? "bg-secondary/50" : "bg-primary/10"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`${notification.read ? "font-normal" : "font-semibold"}`}>
                        {getNotificationTitle(notification.type)}
                      </h3>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    {!notification.read && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                        <Check className="h-4 w-4 mr-1" /> Mark as read
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => removeNotification(notification.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function getNotificationTitle(type: string): string {
  switch (type) {
    case "EVENT_JOINED":
      return "Event Joined";
    case "EVENT_CREATED":
      return "Event Created";
    case "NEW_MESSAGE":
      return "New Message";
    case "CERTIFICATE_AVAILABLE":
      return "Certificate Available";
    default:
      return "Notification";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day ago`;
  
  return date.toLocaleDateString();
}
