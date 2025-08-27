import { Calendar } from "lucide-react"

interface EmptyEventsStateProps {
  title?: string
  description?: string
}

export function EmptyEventsState({ 
  title = "No Events Found", 
  description = "There are no events available at the moment. Please check back later." 
}: EmptyEventsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md">{description}</p>
    </div>
  )
}
