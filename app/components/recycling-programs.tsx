"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"

export function RecyclingPrograms() {
  const [activeTab, setActiveTab] = useState("residential")

  const programs = {
    residential: {
      title: "Residential E-Waste Collection",
      features: [
        "Door-to-door collection service",
        "Monthly collection drives",
        "Reward points system",
        "Free pickup for large items",
      ],
      buttonText: "Schedule Pickup",
    },
    corporate: {
      title: "Corporate Recycling Solutions",
      features: [
        "Bulk collection services",
        "Asset management",
        "Data destruction certification",
        "Regular pickup schedule",
      ],
      buttonText: "Partner With Us",
    },
    educational: {
      title: "School & University Programs",
      features: [
        "Campus collection points",
        "Awareness workshops",
        "Student volunteer programs",
        "Green campus initiatives",
      ],
      buttonText: "Join Program",
    },
  }

  return (
    <section id="recycling-programs" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recycling Programs</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="residential" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="residential">Residential</TabsTrigger>
              <TabsTrigger value="corporate">Corporate</TabsTrigger>
              <TabsTrigger value="educational">Educational</TabsTrigger>
            </TabsList>

            {Object.entries(programs).map(([key, program]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-primary">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {program.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-4 rounded-full">{program.buttonText}</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

