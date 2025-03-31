"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "The e-waste collection process was incredibly smooth. The team was professional and made it easy for our company to dispose of old equipment responsibly.",
      author: "John Smith",
      role: "Corporate Donor",
    },
    {
      quote:
        "As a recycling partner, I'm impressed with the systematic approach to e-waste management. The platform has streamlined our entire process.",
      author: "Sarah Johnson",
      role: "Recycling Partner",
    },
    {
      quote:
        "Volunteering with the e-waste management team has been a rewarding experience. The educational programs are making a real difference in our community.",
      author: "Mike Davis",
      role: "Volunteer",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">What People Say</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card/50 border-border h-full">
                    <CardContent className="pt-6 pb-6">
                      <div className="text-primary mb-4">
                        <Quote className="h-8 w-8" />
                      </div>
                      <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                      <div>
                        <h4 className="font-semibold text-primary">{testimonial.author}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 gap-4">
            <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-primary" : "bg-muted-foreground/30"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

