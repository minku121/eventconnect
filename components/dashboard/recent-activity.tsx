"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentActivity({ activities, loading }: { 
  activities: Array<{
    name: string
    email: string
    activity: string
    time: string
  }>
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <div className="flex items-center" key={index}>
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="ml-auto h-4 w-[50px]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.activity}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  )
}

