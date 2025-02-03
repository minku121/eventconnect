import React from 'react'
import { Team_Event_Reach } from '@/components/reports/reach'
import { User_joined } from '@/components/reports/userjoined'
import { TotaluserJoined } from '@/components/reports/userintraction'
import Topuser from '@/components/reports/popularuser'
import { SidebarComponent } from '@/components/inner/sidebar-content'
import {
    Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue,} from "@/components/ui/select"
   
export default function page() {
  return (
    <div className="flex h-screen">

          

         <div className="flex-1 flex flex-col gap-10 mt-2 mx-auto p-4">

            <div className='mx-auto'>
        <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Timeline</SelectLabel>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 3 Months</SelectItem>
          
        </SelectGroup>
      </SelectContent>
    </Select>
   
    </div>
        <Team_Event_Reach/>
        <User_joined/>
        <TotaluserJoined/>
        <Topuser/>
        </div>
        
    </div>
    
  )
}
