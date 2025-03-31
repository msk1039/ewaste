import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HandHelping, Recycle, GraduationCap, Users } from "lucide-react"

export function Services() {
  const services = [
    {
      icon: <HandHelping className="h-10 w-10" />,
      title: "Donation Services",
      description: "Easy and convenient e-waste donation process for individuals and organizations",
      features: ["Schedule pickup", "Drop-off locations", "Donation tracking"],
      buttonText: "Donate Now",
    },
    {
      icon: <Recycle className="h-10 w-10" />,
      title: "Recycling Services",
      description: "Professional recycling solutions with certified partners",
      features: ["Secure data destruction", "Eco-friendly processing", "Material recovery"],
      buttonText: "Learn More",
    },
    {
      icon: <GraduationCap className="h-10 w-10" />,
      title: "Educational Programs",
      description: "Awareness and training programs about e-waste management",
      features: ["Workshop sessions", "Online resources", "Community outreach"],
      buttonText: "Join Program",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Volunteer Programs",
      description: "Join our community of environmental champions",
      features: ["Collection drives", "Education initiatives", "Community events"],
      buttonText: "Volunteer",
    },
  ]

  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Our Services</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-card/50 border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto text-primary mb-4">{service.icon}</div>
                <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="text-muted-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-0 flex justify-center">
                <Button variant="default" size="sm" className="rounded-full">
                  {service.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

