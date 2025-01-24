import { SidebarComponent } from '@/components/inner/sidebar-content'
import DisplayNotifications from '@/components/notification/displaynotification'
import React from 'react'

export default function page() {
  return (
    <div className="flex h-screen">
        
         <div className="hidden md:block md:w-1/5 lg:w-1/4 xl:w-1/5">
        <SidebarComponent />
      </div>

        <div className='flex-col'>
            
        </div>

            <DisplayNotifications/>
        </div>
  )
}
