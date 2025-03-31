"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HandHelping, ClapperboardIcon as ChalkboardTeacher, ClipboardList } from "lucide-react"

export function Volunteer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    alert("Thank you for volunteering! We will contact you soon.")
  }

  return (
    <section id="volunteer" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Volunteer Program</h2>
          <p className="text-muted-foreground mb-8">
            Make a difference in your community by joining our e-waste management initiative
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <HandHelping className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Collection Drives</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Help organize and participate in community e-waste collection events
              </p>
              <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                4-6 hours/week
              </span>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <ChalkboardTeacher className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Education Programs</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">Conduct awareness workshops and training sessions</p>
              <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                2-3 hours/week
              </span>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Program Coordination</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">Assist in organizing and managing recycling programs</p>
              <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                5-8 hours/week
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Volunteer Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Enter your name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest">Area of Interest</Label>
                    <Select required>
                      <SelectTrigger id="interest">
                        <SelectValue placeholder="Select area of interest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collection">Collection Drives</SelectItem>
                        <SelectItem value="education">Education Programs</SelectItem>
                        <SelectItem value="coordination">Program Coordination</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us why you want to volunteer" rows={4} />
                  </div>

                  <Button type="submit" className="w-full">
                    Join as Volunteer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

