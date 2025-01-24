import React from 'react'
import SettingsPage from '@/components/settings/mainSettings'
import { SidebarComponent } from '@/components/inner/sidebar-content'
export default function page() {
    return (
        <div className='flex h-screen'>

            <div className="hidden md:block md:w-1/5 lg:w-1/4 xl:w-1/5">
                <SidebarComponent />
            </div>
            <div>
                <SettingsPage />
            </div>
        </div>
    )
}
