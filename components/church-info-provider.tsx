"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getHomePage, getAllServiceSchedules, getChurchImages } from "@/services/homepage"

export type SocialLinks = {
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  linkedin?: string
  [key: string]: string | undefined
}

export type ChurchDetails = {
  id?: number | null
  name?: string
  email?: string
  address?: string
  location?: string
  phoneNumber?: string
  welcomeAddress?: string
}

export type ChurchInfoContextValue = {
  details: ChurchDetails
  schedules: any[]
  images: any
  socials: SocialLinks
  isLoading: boolean
  refresh: () => Promise<void>
}

const ChurchInfoContext = createContext<ChurchInfoContextValue | undefined>(undefined)

export function ChurchInfoProvider({ children }: { children: React.ReactNode }) {
  const [details, setDetails] = useState<ChurchDetails>({})
  const [schedules, setSchedules] = useState<any[]>([])
  const [images, setImages] = useState<any>(null)
  const [socials, setSocials] = useState<SocialLinks>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const load = async () => {
    try {
      setIsLoading(true)
      // Home page aggregate (if available)
      try {
        const hp = await getHomePage()
        if (hp?.isSuccessful && hp?.data) {
          const cd = (hp.data as any).churchDetails || (hp.data as any).data?.churchDetails
          if (cd) setDetails(cd)
        }
      } catch {}

      // Service schedules
      try {
        const ss = await getAllServiceSchedules()
        if (ss?.isSuccessful && Array.isArray(ss.data)) setSchedules(ss.data)
      } catch {}

      // Images
      try {
        const imgs = await getChurchImages()
        if (imgs?.isSuccessful) setImages(imgs.data)
      } catch {}

      // Social links from localStorage (saved from admin church-info)
      try {
        const raw = localStorage.getItem("churchSocialMedia")
        if (raw) setSocials(JSON.parse(raw))
      } catch {}
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const value = useMemo(
    () => ({ details, schedules, images, socials, isLoading, refresh: load }),
    [details, schedules, images, socials, isLoading]
  )

  return (
    <ChurchInfoContext.Provider value={value}>{children}</ChurchInfoContext.Provider>
  )
}

export function useChurchInfo() {
  const ctx = useContext(ChurchInfoContext)
  if (!ctx) throw new Error("useChurchInfo must be used within ChurchInfoProvider")
  return ctx
} 