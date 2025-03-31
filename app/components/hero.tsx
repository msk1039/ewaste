import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Recycle, Users, ShieldCheck } from "lucide-react"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
    >
      {/* Try alternative approach with regular img tag */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/international-e-waste-day.webp" 
          alt="E-Waste Background" 
          className="object-cover w-full h-full opacity-30"
          style={{ zIndex: -1 }}
        />
      </div>
      <div className="absolute inset-0 bg-green-100/50 dark:bg-green-900/70 z-[1]" /> {/* Semi-transparent overlay */}
      <div className="container mx-auto px-4 relative z-[2]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent animate-fade-in">
            E-Waste Management Solution
          </h1>
          <p className="text-lg md:text-xl text-green-700 dark:text-green-300 mb-12 animate-fade-in animation-delay-200">
            Transform your electronic waste into a sustainable future. Join our mission to responsibly collect, recycle,
            and manage e-waste.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animation-delay-300">
            {/* Donate Card */}
            <div className="bg-white dark:bg-green-800/30 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-green-200 dark:border-green-800 group">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-700/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <Recycle size={36} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Donate E-Waste</h3>
              <p className="text-green-600 dark:text-green-400 mb-4">Responsibly dispose of your electronic waste and make a positive impact on the environment.</p>
              <Link href="/signup?role=donor" passHref>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                  Join as Donor
                </Button>
              </Link>
            </div>
            
            {/* Volunteer Card */}
            <div className="bg-white dark:bg-green-800/30 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-green-200 dark:border-green-800 group">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-700/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <Users size={36} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Volunteer</h3>
              <p className="text-green-600 dark:text-green-400 mb-4">Help us collect, sort, and process e-waste. Be part of our community of environmental champions.</p>
              <Link href="/signup?role=volunteer" passHref>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                  Join as Volunteer
                </Button>
              </Link>
            </div>
            
            {/* Admin Card */}
            <div className="bg-white dark:bg-green-800/30 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-green-200 dark:border-green-800 group">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-700/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={36} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Admin Access</h3>
              <p className="text-green-600 dark:text-green-400 mb-4">Manage operations, track metrics, and oversee the entire e-waste management process.</p>
              <Link href="/signup?role=admin" passHref>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:60px_60px] opacity-30 z-[1]" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-green-50 dark:to-green-950 z-[1]" />
    </section>
  )
}

