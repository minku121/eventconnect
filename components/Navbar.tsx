"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { ThemeToggle } from "./theme-toggle"
import { useSession } from 'next-auth/react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    if (status === 'authenticated') {
      setIsOpen(false)
    }
  }, [status])

  return (
    <nav className="flex items-center justify-between p-3 h-[60px] bg-transparent bg-opacity-50 backdrop-blur-md fixed top-0 w-full border-b border-slate-700 border-0.5 z-[99]" style={{ zIndex: 9999 }}>
      <Link href="/" className="text-lg font-medium">
        TeamConnect
      </Link>
      <div className="hidden md:flex items-center gap-4">
        <Link 
          href="/events"
          className="text-sm text-gray-400 hover:text-[#cb5215] transition-colors"
        >
          Events
        </Link>
        <Link 
          href="/teams"
          className="text-sm text-gray-400 hover:text-[#a015cb] transition-colors"
        >
          Teams
        </Link>
        <Link 
          href="/challenges"
          className="text-sm text-gray-400 hover:text-[#29cb15] transition-colors"
        >
          Challenges
        </Link>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/join">
            Join Now
          </Link>
        </Button>

        <ThemeToggle />
        {session ? (
          <Button variant="link" size="sm" asChild>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
        ) : (
          <Button variant="link" size="sm" asChild>
            <Link href="/auth/signin">
              Sign In
            </Link>
          </Button>
        )}
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[300px] sm:w-[400px] bg-white bg-opacity-50 backdrop-blur-sm mt-[60px] h-[calc(100vh-60px)]"
        >
          <nav className="flex flex-col gap-4">
            <Link 
              href="/events"
              className="block px-2 py-1 text-lg"
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link 
              href="/teams"
              className="block px-2 py-1 text-lg"
              onClick={closeMenu}
            >
              Teams
            </Link>
            <Link 
              href="/challenges"
              className="block px-2 py-1 text-lg"
              onClick={closeMenu}
            >
              Challenges
            </Link>
            <Link 
              href="/join"
              className="block px-2 py-1 text-lg"
              onClick={closeMenu}
            >
              Join Now
            </Link>
            {session ? (
              <Link 
                href="/dashboard"
                className="block px-2 py-1 text-lg"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/auth/signin"
                className="block px-2 py-1 text-lg"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
    
  )
}

