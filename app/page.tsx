import Image from "next/image"
import { Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroSlider from "@/components/hero-slider"
import ServicesGrid from "@/components/services-grid"
import WelcomeSection from "@/components/welcome-section"
import LocationsSection from "@/components/locations-section"
import MainLayout from "@/components/main-layout"
import FadeIn from "@/components/ui/fade-in"
import Link from "next/link"

export default function Home() {
  return (
    <MainLayout>
      <HeroSlider />
      <ServicesGrid />
      <WelcomeSection />
      <LocationsSection />

      {/* Join the Family Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Community</span>
              <h2 className="text-4xl md:text-5xl font-bold my-4">Join The Family</h2>
              <p className="text-lg text-slate-600">
                Experience the joy of fellowship and spiritual growth in our vibrant community of believers.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jointhefamily1-pRIZsRznCch0qMViqggja9a1QCm5hG.png"
                  alt="Fellowship"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">Fellowship With Us</h3>
                  <p className="text-white/90">Join our community in worship and praise.</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div>
                <h3 className="text-3xl font-bold mb-4 text-slate-800">FELLOWSHIP WITH US IN ANY OF OUR BRANCHES</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Our branches offer a welcoming environment for everyone seeking spiritual growth and fellowship.
                  Experience the power of collective worship and the joy of being part of a loving church family.
                </p>
                <Button asChild>
                  <Link href="/locations">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative">
                <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/donation.png-9JtcRLA0zWlxl6ac4XovOm11jhfnK9.jpeg"
                    alt="Happy children supported by donations"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} className="relative">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Give Generously</span>
              <h2 className="text-4xl md:text-5xl font-bold my-4">Make a Difference Today</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Your generous contribution helps us continue our mission of spreading God's love and supporting those in
                need. Together, we can create lasting change.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Support Children's Education</h3>
                    <p className="text-slate-600">
                      Help provide educational resources and opportunities for children in need.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Spread Hope & Faith</h3>
                    <p className="text-slate-600">
                      Partner with us in sharing the message of hope and faith to those who need it most.
                    </p>
                  </div>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/donations">
                  <Heart className="h-5 w-5 mr-2" />
                  Make a Donation
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
