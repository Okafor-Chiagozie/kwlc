"use client"

import Image from "next/image"
import { MapPin, Phone, Mail, Heart, Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import HeroSlider from "@/components/hero-slider"
import ServicesGrid from "@/components/services-grid"
import WelcomeSection from "@/components/welcome-section"
import LocationsSection from "@/components/locations-section"
import LocationPin from "@/components/location-pin"
import MainLayout from "@/components/main-layout"
import Link from "next/link"
import { useApi } from "@/hooks/useApi"
import { getUpcomingEvents } from "@/services/event"
import { useChurchInfo } from "@/components/church-info-provider"

export default function Home() {
  // Fetch upcoming events
  const { data: upcomingEvents, loading: eventsLoading, error: eventsError } = useApi(
    () => getUpcomingEvents(),
    []
  )
  const { details, socials } = useChurchInfo()

  // Format date for display
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    return { day, month }
  }

  // Format time for display
  const formatEventTime = (startTime: string, closeTime: string) => {
    const formatTime = (timeStr: string) => {
      const time = new Date(`2000-01-01T${timeStr}`)
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).toLowerCase()
    }
    return `${formatTime(startTime)} - ${formatTime(closeTime)}`
  }
  return (
    <MainLayout>
      <main className="flex-1 scroll-smooth">
        {/* Hero Slider Section */}
        <section className="relative h-[700px] overflow-hidden">
          <HeroSlider />
        </section>

        {/* Services Grid Section */}
        <ServicesGrid />

        {/* Welcome Section */}
        <WelcomeSection />

        {/* Worship With Us */}
        <LocationsSection />

        {/* Join the Family */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-tr-[100px]"></div>
          <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-primary/10 mix-blend-multiply"></div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-primary/10 mix-blend-multiply"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Become Part of Our Community</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Join the family
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Experience the joy of fellowship and spiritual growth in our vibrant community of believers
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 group">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jointhefamily1-pRIZsRznCch0qMViqggja9a1QCm5hG.png"
                    alt="Fellowship"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="w-12 h-1 bg-primary mb-4"></div>
                    <h3 className="text-2xl text-white font-medium mb-2">Fellowship With Us</h3>
                    <p className="text-white/90">Join our community in worship and praise</p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="p-1 border-l-4 border-primary mb-6">
                  <h3 className="text-3xl font-bold mb-4 pl-4">FELLOWSHIP WITH US IN ANY OF OUR BRANCHES</h3>
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Join our vibrant community of believers as we worship, learn, and grow together in faith. Our branches
                  offer a welcoming environment for everyone seeking spiritual growth and fellowship. Experience the
                  power of collective worship and the joy of being part of a loving church family.
                </p>
                <Button className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all">
                  <Link href={'/branches'}>Learn More</Link>
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
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center mt-24">
              <div>
                <div className="p-1 border-l-4 border-primary mb-6">
                  <h3 className="text-3xl font-bold mb-4 pl-4">JOIN OUR BIBLE CLASSES TODAY</h3>
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Deepen your understanding of God's word through our comprehensive Bible study classes. Our experienced
                  teachers will guide you through scripture in an engaging and accessible way. Discover the profound
                  truths of the Bible and how they apply to your daily life in a supportive and interactive learning
                  environment.
                </p>
                <Button className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all">
                  <Link href={'/branches'}>Learn More</Link>
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
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Button>
              </div>
              <div className="group">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jointhefamily2-HdjteQq2HsXowGZL3DweqcAVHAHdX2.png"
                    alt="Bible Classes"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="w-12 h-1 bg-primary mb-4"></div>
                    <h3 className="text-2xl text-white font-medium mb-2">Bible Study</h3>
                    <p className="text-white/90">Grow in knowledge and understanding</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24 text-center">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Link href={'/events'}>View All Programs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-11 -left-11 w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply"></div>
                <div className="absolute -bottom-11 -right-11 w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply"></div>
                <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl transform-gpu transition-transform hover:scale-[1.02] duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/donation.png-9JtcRLA0zWlxl6ac4XovOm11jhfnK9.jpeg"
                    alt="Happy children supported by donations"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                  <Heart className="h-4 w-4" />
                  <span>Support Our Mission</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Make a Difference Today
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Your generous contribution helps us continue our mission of spreading God's love and supporting those
                  in need. Together, we can create lasting change in our communities and beyond.
                </p>
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Support Children's Education</h3>
                      <p className="text-gray-600">
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
                      <p className="text-gray-600">
                        Partner with us in sharing the message of hope and faith to those who need it most.
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all group text-lg h-12">
                  <Heart className="h-5 w-5 mr-2" />
                  <Link href={'/donations'}>Make a Donation</Link>
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
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  All donations are tax-deductible. Together, we can make a lasting impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location Map */}
        <section id="find-us" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-full h-64 bg-primary/5 -skew-y-3 transform-gpu"></div>
            <div className="absolute bottom-0 left-0 w-full h-64 bg-primary/5 skew-y-3 transform-gpu"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6 animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Find Us</span>
              </div>
              <h2
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in"
                style={{ animationDelay: "400ms" }}
              >
                Where's Your Location?
              </h2>
              <p
                className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in"
                style={{ animationDelay: "600ms" }}
              >
                Visit our headquarters or any of our branches to experience the warmth of our community
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <LocationPin
                location={{
                  name: details.name || "KWLC Headquarters",
                  title: "KINGDOM WAYS LIVING CHURCH HEADQUARTERS",
                  description:
                    details.welcomeAddress || "Our main church location with multiple services throughout the week. Join us for worship, prayer, and fellowship.",
                  address:
                    details.address || "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road, Jakande Bus Stop, Osapa London, Lagos",
                  phone: details.phoneNumber || "+234 70 433 2832",
                  email: details.email || "info@kwlchq.org",
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lagos-VgjOxtCXSS5PU2WpGNpg21KuQQyOqw.png",
                }}
              />
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Call Us</h3>
                    <p className="text-gray-600">{details.phoneNumber || "+234 70 433 2832"}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary text-primary"
                >
                  <a href={details.phoneNumber ? `tel:${details.phoneNumber}` : "tel:+234704332832"}>Call Now</a>
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email Us</h3>
                    <p className="text-gray-600">{details.email || "info@kwlchq.org"}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary text-primary"
                >
                  <a href={`mailto:${details.email || "info@kwlchq.org"}`}>Send Email</a>
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Visit Us</h3>
                    <p className="text-gray-600">Get directions to our location</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary text-primary"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Events */}
        <section id="contact" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="relative mb-8">
                  <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/5 rounded-full mix-blend-multiply"></div>
                  <div className="flex items-center gap-4 relative">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-md"></div>
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
                        alt="Kingdom Ways Living Church Logo"
                        width={60}
                        height={60}
                        className="h-14 w-auto relative z-10"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        KINGDOM WAYS
                      </h3>
                      <p className="text-sm text-gray-600">LIVING CHURCH</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-8 relative">
                  <div className="absolute -right-4 bottom-1/2 w-24 h-24 bg-primary/5 rounded-full mix-blend-multiply -z-10"></div>

                  <div className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Call us directly at</p>
                      <p className="font-medium text-gray-800">{details.phoneNumber || "+234 70 433 2832"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group transition-all duration-300 hover:translate-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Our location</p>
                      <p className="text-sm text-gray-800">
                        {details.address || "24 Prince Ibrahim Eletu Avenue, Shoprite Circle Mall Road, Jakande Bus Stop, Osapa London, Lagos"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email us at</p>
                      <p className="font-medium text-gray-800">{details.email || "info@kwlchq.org"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  {socials.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                  )}
                  {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </a>
                  )}
                  {socials.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                  )}
                  {socials.youtube && (
                    <a
                      href={socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                        <path d="m10 15 5-3-5-3z"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6">CONTACT US</h3>
                <form className="space-y-4">
                  <Input placeholder="Name" />
                  <Input placeholder="Email" type="email" />
                  <Textarea placeholder="Message" className="min-h-[120px]" />
                  <Button type="submit" className="w-full">
                    Send
                  </Button>
                </form>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-bold">UPCOMING EVENTS</h3>
                </div>

                <div className="space-y-6">
                  {eventsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                      <span className="text-gray-600">Loading events...</span>
                    </div>
                  ) : eventsError ? (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>Unable to load events</span>
                    </div>
                  ) : upcomingEvents && upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 3).map((event) => {
                      const { day, month } = formatEventDate(event.date)
                      return (
                        <div key={event.id} className="group flex gap-4 p-3 transition-colors">
                          <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex flex-col items-center justify-center text-primary">
                            <span className="text-lg font-bold">{day}</span>
                            <span className="text-xs font-medium">{month}</span>
                          </div>
                          <div>
                            <h4 className="font-bold group-hover:text-primary transition-colors">{event.name}</h4>
                            <p className="text-gray-600 text-sm">{formatEventTime(event.startTime, event.closeTime)}</p>
                            <p className="text-gray-500 text-sm mt-1">{event.venue || event.location}</p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No upcoming events scheduled</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4">
                  <button className="w-full text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Link href={'/events'}>View All Events</Link>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
