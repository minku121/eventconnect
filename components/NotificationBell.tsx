"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: number
  message: string
  read: boolean
  createdAt: string
  type: string
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchNotifications = async () => {
    if (!session?.user?.id) return
    
    try {
      setLoading(true)
      const res = await fetch(`/api/notifications/list`)
      
      if (!res.ok) {
        throw new Error("Failed to fetch notifications")
      }
      
      const data = await res.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
    }
  }, [session?.user?.id])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Button>
  )
}
