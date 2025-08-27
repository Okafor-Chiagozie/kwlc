"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutDashboard,
  Church,
  Video,
  DollarSign,
  Calendar,
  Store,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Church Info", href: "/admin/church-info", icon: Church },
  { name: "Livestream", href: "/admin/livestream", icon: Video },
  { name: "Finance", href: "/admin/finance", icon: DollarSign },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Store", href: "/admin/store", icon: Store },
  { name: "Pastors", href: "/admin/pastors", icon: Users },
  { name: "Branches", href: "/admin/branches", icon: Church },
  { name: "Roles & Access", href: "/admin/roles", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading: isLoadingUser, user: currentUser, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoadingUser, router])

  const handleLogout = () => {
    logout()
  }

  const getDisplayName = () => {
    if (currentUser) {
      const fullName = [currentUser.firstName, currentUser.middleName, currentUser.lastName]
        .filter(Boolean)
        .join(" ")
      return fullName || currentUser.email || "Admin User"
    }
    return "Admin User"
  }

  const getInitials = () => {
    if (currentUser) {
      const firstInitial = currentUser.firstName?.charAt(0)?.toUpperCase() || ""
      const lastInitial = currentUser.lastName?.charAt(0)?.toUpperCase() || ""
      return firstInitial + lastInitial || currentUser.email?.charAt(0)?.toUpperCase() || "AU"
    }
    return "AU"
  }

  const getUserRole = () => {
    if (currentUser) {
      return currentUser.userTypeId === "Admin" ? "Administrator" : "User"
    }
    return "Administrator"
  }

  const getUserStatus = () => {
    if (currentUser) {
      return currentUser.isBanned ? "Suspended" : "Active"
    }
    return "Active"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KWLC%20Logo%201-aSNedKIy42avfHJjhU8zekfvcwmgKh.png"
              alt="KWLC Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-bold text-gray-900">KWLC Admin</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Church Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* User Status Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2">
                <Badge 
                  variant={getUserStatus() === "Active" ? "secondary" : "destructive"} 
                  className="text-xs"
                >
                  {getUserStatus()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getUserRole()}
                </Badge>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">
                      {isLoadingUser ? "Loading..." : getDisplayName()}
                    </div>
                    {currentUser && (
                      <div className="text-xs text-gray-500">
                        {currentUser.email}
                      </div>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{getDisplayName()}</div>
                  {currentUser && (
                    <>
                      <div className="text-xs text-gray-500 mt-1">{currentUser.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={getUserStatus() === "Active" ? "secondary" : "destructive"} 
                          className="text-xs"
                        >
                          {getUserStatus()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getUserRole()}
                        </Badge>
                      </div>
                      {currentUser.phoneNumber && (
                        <div className="text-xs text-gray-500 mt-1">
                          📞 {currentUser.phoneNumber}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Member since {new Date(currentUser.dateCreated).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin/change-password" className="flex items-center w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}