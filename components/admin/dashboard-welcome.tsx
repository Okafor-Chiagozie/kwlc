"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  X, 
  CheckCircle, 
  Building, 
  Users, 
  Calendar, 
  Settings,
  ArrowRight,
  Lightbulb
} from "lucide-react"
import { useRouter } from "next/navigation"

interface WelcomeWidgetProps {
  userName?: string
  isFirstLogin?: boolean
  onDismiss?: () => void
}

export function DashboardWelcome({ 
  userName = "Admin", 
  isFirstLogin = false,
  onDismiss 
}: WelcomeWidgetProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const router = useRouter()

  const quickStartTasks = [
    {
      id: 1,
      title: "Setup Church Information",
      description: "Configure your church details and contact information",
      icon: Settings,
      route: "/admin/church-info",
      completed: false
    },
    {
      id: 2,
      title: "Add Your First Branch",
      description: "Create a branch location for your church",
      icon: Building,
      route: "/admin/branches",
      completed: false
    },
    {
      id: 3,
      title: "Add Ministry Leaders",
      description: "Add pastors and ministry leaders to your system",
      icon: Users,
      route: "/admin/pastors",
      completed: false
    },
    {
      id: 4,
      title: "Create Your First Event",
      description: "Schedule an upcoming church event or service",
      icon: Calendar,
      route: "/admin/events",
      completed: false
    }
  ]

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  const handleTaskClick = (route: string) => {
    router.push(route)
  }

  if (isDismissed) {
    return null
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Welcome back, {userName}! 👋
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isFirstLogin 
                  ? "Let's get your church management system set up. Here are some quick tasks to get you started:"
                  : "Here's your church dashboard overview. You can quickly access common tasks below:"
                }
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickStartTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border hover:border-primary/30 cursor-pointer transition-colors"
              onClick={() => handleTaskClick(task.route)}
            >
              <div className="flex-shrink-0">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <task.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  {task.completed && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 <strong>Tip:</strong> You can access all these features from the sidebar navigation. 
            Need help? Check out our documentation or contact support.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardWelcome 