"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useSession } from "next-auth/react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    if (status === "authenticated") {
      setIsOpen(false)
    }
  }, [status])

  return (
    <nav
      className="flex items-center justify-between p-3 h-[70px] bg-background/30 backdrop-blur-sm fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-slate-700/30 shadow-lg z-[99]"
      style={{ zIndex: 9999 }}
    >
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
        {session ? (
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" asChild>
            <Link href="/auth/signin">Join Now</Link>
          </Button>
        )}
        <ThemeToggle />
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            id="menu-button"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="w-full h-[70vh] bg-background/30 backdrop-blur-md text-center bg-opacity-50 rounded-t-3xl border-t border-slate-700/30 mt-[70px]"
        >
          <div className="w-12 h-1.5 bg-slate-700/30 rounded-full mx-auto mb-8" />
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="flex flex-col gap-6">
            <Link
              href="/events"
              className="block px-2 py-3 text-lg hover:bg-background/20 rounded-xl transition-colors"
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link
              href="/teams"
              className="block px-2 py-3 text-lg hover:bg-background/20 rounded-xl transition-colors"
              onClick={closeMenu}
            >
              Teams
            </Link>
            <Link
              href="/challenges"
              className="block px-2 py-3 text-lg hover:bg-background/20 rounded-xl transition-colors"
              onClick={closeMenu}
            >
              Challenges
            </Link>
            {session ? (
              <Link
                href="/dashboard"
                className="block px-2 py-3 text-lg hover:bg-background/20 rounded-xl transition-colors"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="block px-2 py-3 text-lg hover:bg-background/20 rounded-xl transition-colors"
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
