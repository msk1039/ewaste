import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Recycle, Leaf } from "lucide-react"

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Our E-Waste Management System</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Smart Collection</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Efficient e-waste collection system connecting donors with certified recyclers through our platform.
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Responsible Recycling</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Professional recycling partners ensuring environmentally responsible disposal and material recovery.
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Reducing electronic waste footprint while promoting sustainable practices in our community.
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-muted-foreground">
            Our integrated e-waste management system brings together donors, recyclers, and volunteers in a coordinated
            effort to address the growing challenge of electronic waste. Through our platform, we facilitate responsible
            disposal, educate communities, and promote sustainable practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
            <p className="text-muted-foreground">Donors</p>
          </div>
          <div className="p-6">
            <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
            <p className="text-muted-foreground">Recycling Programs</p>
          </div>
          <div className="p-6">
            <h3 className="text-4xl font-bold text-primary mb-2">5000kg+</h3>
            <p className="text-muted-foreground">E-Waste Collected</p>
          </div>
        </div>
      </div>
    </section>
  )
}

