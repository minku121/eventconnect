"use client"

import { useState } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Notification {
  id: number
  title: string
  message: string
  read: boolean
  timestamp: string
}

export default function DisplayNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New message",
      message: "You have a new message from John",
      read: false,
      timestamp: "2 minutes ago",
    },
    {
      id: 2,
      title: "Friend request",
      message: "Sarah sent you a friend request",
      read: false,
      timestamp: "1 hour ago",
    },
    { id: 3, title: "System update", message: "A new system update is available", read: false, timestamp: "1 day ago" },
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  return (
    <Card className="w-full max-w-full border-none h-screen">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-screen pr-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-4 p-3 rounded-lg ${notification.read ? "bg-secondary" : "bg-primary/10"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  {!notification.read && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                      <Check className="h-4 w-4 mr-1" /> Mark as read
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => deleteNotification(notification.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

