"use client"
import { PinContainer } from "@/components/ui/3d-pin"
import { MapPin, Phone, Mail } from "lucide-react"

export default function LocationPin({ location }) {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center">
      <PinContainer title={location.name} href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}>
        <div className="flex basis-full flex-col p-4 tracking-tight text-gray-800 sm:basis-1/2 w-[24rem] h-[24rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-xl text-gray-900">{location.title}</h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-gray-700">{location.description}</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
              <p className="text-sm text-gray-700">{location.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <p className="text-gray-700">{location.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <p className="text-gray-700">{location.email}</p>
            </div>
          </div>

          <div className="flex flex-1 w-full rounded-lg mt-6 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/80 via-primary/50 to-primary/30 p-1 rounded-lg">
              <div className="w-full h-full rounded-md overflow-hidden">
                {location.image && (
                  <img
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </PinContainer>
    </div>
  )
}
