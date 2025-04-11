"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, Home, Search, User, ShoppingCart, BookOpen } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 z-50">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          <Link href="/" className={`flex flex-col items-center ${isActive("/") ? "text-teal-600" : "text-gray-500"}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/search"
            className={`flex flex-col items-center ${isActive("/search") ? "text-teal-600" : "text-gray-500"}`}
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link
            href="/camera"
            className={`flex flex-col items-center ${isActive("/camera") ? "text-teal-600" : "text-gray-500"}`}
          >
            <div className="bg-teal-600 rounded-full p-3 -mt-5 mb-1">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs">Scan</span>
          </Link>
          <Link
            href="/blog"
            className={`flex flex-col items-center ${isActive("/blog") ? "text-teal-600" : "text-gray-500"}`}
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs mt-1">Blog</span>
          </Link>
          <Link
            href="/shopping-list"
            className={`flex flex-col items-center ${isActive("/shopping-list") ? "text-teal-600" : "text-gray-500"}`}
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs mt-1">List</span>
          </Link>
          <Link
            href="/profile"
            className={`flex flex-col items-center ${isActive("/profile") ? "text-teal-600" : "text-gray-500"}`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
