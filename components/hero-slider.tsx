"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useApi } from "@/hooks/useApi"
import { getHomePage } from "@/services/homepage"
import { getLivestreamUrl } from "@/services/livestream"

// No more dummy data - using real API data only

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  label: string;
}

export default function HeroSlider() {
  // Fetch homepage data (carousel images)
  const { data: homeResponse, loading: imagesLoading, error: imagesError } = useApi(
    () => getHomePage(),
    []
  )

  // Slide content - API only provides images, text content is static
  const slideContent = [
    {
    title: "Join the prayer today",
      subtitle: "Visit Your local church and become a part of our flock by contributing to the community in anyway you possibly can",
    label: "Living church",
  },
  {
    title: "Grow in faith together",
    subtitle: "Experience the joy of worship and fellowship in a community that cares",
    label: "Community church",
  },
  {
    title: "Discover God's purpose",
    subtitle: "Join us on a journey of spiritual growth and discovery through Christ",
    label: "Spiritual growth",
    }
  ]

  // Fallback images from public when API doesn't return carousel images
  const fallbackImages = [
    "/banner-1.png",
    "/banner-2.png",
    "/banner-3.png",
  ]

  // Absolute fallback image (remote) for any individual missing image
  const fallbackImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-kwlc-X45sTS2cVZ0mNgtttsneuf0aeXrYtI.jpeg"

  // Transform API data to slides format using GetHomePage().data.carouselImage (array of URLs)
  const homepageCarousel: string[] =
    homeResponse?.isSuccessful && (homeResponse as any)?.data?.carouselImage?.length > 0
      ? ((homeResponse as any).data.carouselImage as string[])
      : []

  const apiSlides = (homepageCarousel.length > 0 ? homepageCarousel : fallbackImages).map((img, index) => ({
    id: index + 1,
    image: img || fallbackImage,
    title: slideContent[index]?.title || "Join the prayer today",
    subtitle: slideContent[index]?.subtitle || "Visit Your local church and become a part of our flock by contributing to the community in anyway you possibly can",
    label: slideContent[index]?.label || "Living church",
  }))

  // Use up to 5 slides when API provides images; otherwise default to 3 fallback slides
  const slides = (homepageCarousel.length > 0 ? apiSlides.slice(0, 5) : apiSlides.slice(0, 3))

  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next")
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const goToSlide = useCallback(
    (index: number, direction: "next" | "prev" = "next") => {
      setPrevSlideIndex(currentSlide)
      setSlideDirection(direction)
      setCurrentSlide(index)
    },
    [currentSlide],
  )

  const nextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % slides.length
    goToSlide(newIndex, "next")
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1
    goToSlide(newIndex, "prev")
  }, [currentSlide, goToSlide])

  // Auto play slides
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setTimeout(() => {
        nextSlide()
      }, 7000)
    }

    startAutoPlay()

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
    }
  }, [nextSlide])

  // Animation for text elements
  const AnimatedText = ({ 
    text, 
    className, 
    wordDelay = 100, 
    baseDelay = 0 
  }: {
    text: string;
    className: string;
    wordDelay?: number;
    baseDelay?: number;
  }) => {
    return (
      <div className={className}>
        {text.split(" ").map((word: string, i: number) => (
          <span key={i} className="inline-block" style={{ margin: "0 0.2rem" }}>
            <span
              className="inline-block animate-word-slide-up opacity-0"
              style={{
                animationDelay: `${baseDelay + i * wordDelay}ms`,
                animationFillMode: "forwards",
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </div>
    )
  }

  // Fetch current livestream availability; show CTA only when live exists
  const { data: liveResponse } = useApi(() => getLivestreamUrl(), [])
  const liveDataRaw: any = liveResponse as any
  const liveStreamUrl: string | null | undefined = liveDataRaw?.data?.liveStreamUrl
  const lastStreamUrl: string | null | undefined = liveDataRaw?.data?.lastStreamUrl
  const hasLive = !!liveStreamUrl

  // Show loading state while fetching images
  if (imagesLoading) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/80">Loading slides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide: Slide, index: number) => {
        const isCurrent = index === currentSlide
        const isPrev = index === prevSlideIndex

        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              isCurrent ? "z-10 opacity-100" : "opacity-0 z-0",
            )}
          >
            {/* Background Image */}
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-1500 ease-out",
                isCurrent && slideDirection === "next" ? "animate-zoom-in" : "",
                isCurrent && slideDirection === "prev" ? "animate-zoom-in-reverse" : "",
                isPrev ? "scale-110" : "",
              )}
            >
              <Image
                src={slide.image || fallbackImage}
                alt={slide.title}
                fill
                className="object-cover object-center brightness-[0.7]"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
            </div>

            {/* Slide Content */}
            {isCurrent && (
              <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 md:px-8 w-full mx-auto">
                <div className="overflow-hidden mb-2 sm:mb-4">
                  <span
                    className="inline-block text-sm sm:text-base md:text-lg uppercase tracking-wider bg-primary/80 px-2 sm:px-3 py-1 rounded animate-slide-down opacity-0"
                    style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
                  >
                    {slide.label}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 sm:mb-6 drop-shadow-lg">
                  <AnimatedText text={slide.title} wordDelay={80} baseDelay={500} className="leading-tight" />
                </h1>

                <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mb-4 sm:mb-8">
                  <AnimatedText
                    text={slide.subtitle}
                    wordDelay={40}
                    baseDelay={800}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="overflow-hidden">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 animate-button-reveal opacity-0 text-base sm:text-lg"
                      style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}
                    >
                      <a href="#experience">See More</a>
                    </Button>
                  </div>

                  {hasLive && (
                    <div className="overflow-hidden">
                      <Button
                        size="lg"
                        className="relative group bg-red-600 text-white hover:bg-red-700 animate-button-reveal opacity-0 text-base sm:text-lg rounded-full px-6 py-6 overflow-hidden"
                        style={{ animationDelay: "1300ms", animationFillMode: "forwards" }}
                      >
                        <span className="pointer-events-none absolute -inset-1 rounded-full bg-red-500/30 blur opacity-60 group-hover:opacity-80"></span>
                        <Link href={'/livestream'} className="relative flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping mr-2"></span>
                          <span className="inline-block w-2 h-2 rounded-full bg-white mr-2"></span>
                          Watch Live Now
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Slide Indicators - Hidden on mobile, visible on sm screens and up */}
      <div
        className="hidden sm:flex absolute bottom-32 md:bottom-36 lg:bottom-40 left-0 right-0 z-20 justify-center gap-2 animate-fade-in opacity-0"
        style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index, index > currentSlide ? "next" : "prev")}
            className={cn(
              "h-3 rounded-full transition-all duration-500",
              index === currentSlide ? "bg-white w-10" : "bg-white/50 hover:bg-white/80 w-3",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Service Timer */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center z-20">
        <div
          className="bg-black/70 backdrop-blur-sm text-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg flex flex-col sm:flex-row items-center gap-3 sm:gap-6 animate-slide-up opacity-0 max-w-[95%] sm:max-w-none mx-auto"
          style={{ animationDelay: "1500ms", animationFillMode: "forwards" }}
        >
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-medium text-primary mb-1">Our next Live service:</p>
            <p className="font-bold text-sm sm:text-base">thursday 20th October</p>
          </div>
          <div className="h-px w-16 sm:h-12 sm:w-px bg-gray-500 my-2 sm:my-0 mx-auto sm:mx-0"></div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div className="flex items-center">
              <div className="bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 font-mono text-sm sm:text-xl rounded-sm">
                09
              </div>
              <span className="mx-0.5 sm:mx-1 text-sm sm:text-xl">:</span>
              <div className="bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 font-mono text-sm sm:text-xl rounded-sm">
                00
              </div>
              <span className="ml-1 sm:ml-2 text-sm sm:text-xl">AM</span>
            </div>
          </div>
          <div className="h-px w-16 sm:h-12 sm:w-px bg-gray-500 my-2 sm:my-0 mx-auto sm:mx-0"></div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div className="flex items-center">
              <div className="bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 font-mono text-sm sm:text-xl rounded-sm">
                20
              </div>
              <span className="mx-0.5 sm:mx-1 text-sm sm:text-xl">/</span>
              <div className="bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 font-mono text-sm sm:text-xl rounded-sm">
                10
              </div>
              <span className="mx-0.5 sm:mx-1 text-sm sm:text-xl">/</span>
              <div className="bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 font-mono text-sm sm:text-xl rounded-sm">
                23
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 animate-fade-in opacity-0"
        style={{ animationDelay: "1000ms", animationFillMode: "forwards" }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 animate-fade-in opacity-0"
        style={{ animationDelay: "1000ms", animationFillMode: "forwards" }}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
    </div>
  )
}
