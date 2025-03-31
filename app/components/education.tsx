"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, GraduationCap } from "lucide-react"

export function Education() {
  return (
    <section id="education" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Educational Resources</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card/50 border-border">
            <CardHeader className="bg-primary/10 border-b border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>E-Waste Learning Hub</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is E-Waste?</AccordionTrigger>
                  <AccordionContent>
                    Learn about electronic waste, its components, and environmental impact. Understand what items
                    qualify as e-waste and proper disposal methods.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Environmental Impact</AccordionTrigger>
                  <AccordionContent>
                    Discover how improper e-waste disposal affects our environment and learn about sustainable
                    alternatives and their benefits.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Recycling Process</AccordionTrigger>
                  <AccordionContent>
                    Step-by-step guide to the e-waste recycling process, from collection to material recovery and proper
                    disposal methods.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="bg-primary/10 border-b border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <CardTitle>Interactive Learning</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3">Test Your Knowledge</h3>
                  <Button variant="outline" className="rounded-full">
                    Take Quiz
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-center">Upcoming Workshops</h3>
                  <ul className="space-y-2 mb-4">
                    <li className="p-2 bg-muted rounded-md">E-Waste Management Basics - Every Monday</li>
                    <li className="p-2 bg-muted rounded-md">Responsible Electronics Disposal - Wednesday</li>
                    <li className="p-2 bg-muted rounded-md">Sustainable Technology - Friday</li>
                  </ul>
                  <div className="text-center mt-4">
                    <Button className="rounded-full">Register Now</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

