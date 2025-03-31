

import { Navbar } from "@/app/components/navbar"
import { Hero } from "@/app/components/hero"
import { About } from "@/app/components/about"
import { Services } from "@/app/components/services"
import { RecyclingPrograms } from "@/app/components/recycling-programs"
import { Education } from "@/app/components/education"
import { Volunteer } from "@/app/components/volunteer"
import { Testimonials } from "@/app/components/testimonials"
import { Contact } from "@/app/components/contact"
import { Footer } from "@/app/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <RecyclingPrograms />
      <Education />
      <Volunteer />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
