"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg",
    title: "Welcome to Kingdom Ways",
    subtitle: "A place of hope, faith, and community. Join us as we explore God's word and purpose for our lives.",
    label: "Living church",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Grow in Faith Together",
    subtitle: "Experience the joy of worship and fellowship in a community that cares and supports one another.",
    label: "Community",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Discover God's Purpose",
    subtitle: "Join us on a journey of spiritual growth and discovery through the teachings of Jesus Christ.",
    label: "Spiritual Growth",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 8000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [nextSlide])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100 z-10" : "opacity-0",
          )}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        </div>
      ))}

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 z-20">
        <div className="max-w-4xl">
          <span className="inline-block bg-white/10 text-white text-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            {slides[currentSlide].label}
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up animation-delay-200">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-400">
            {slides[currentSlide].subtitle}
          </p>
          <div className="animate-fade-in-up animation-delay-600">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              index === currentSlide ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </section>
  )
}
