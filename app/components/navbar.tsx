"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ContentNotifications from "./ContentNotifications"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#recycling-programs", label: "Programs" },
    { href: "#education", label: "Education" },
    { href: "#volunteer", label: "Volunteer" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">E-Waste</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Notifications Bell */}
          <div className="ml-2">
            <ContentNotifications />
          </div>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium px-2 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Notifications */}
              <div className="px-2 py-2 flex items-center gap-2">
                <span className="text-lg font-medium">Notifications</span>
                <ContentNotifications />
              </div>
              
              {/* Mobile Auth links */}
              <div className="mt-4 space-y-2 px-2">
                <Link 
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full">
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link 
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

