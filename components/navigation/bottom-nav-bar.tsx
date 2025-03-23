"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, BarChart2, Bookmark, User, Percent } from "lucide-react"

export function BottomNavBar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: BarChart2,
    },
    {
      name: "Deals",
      href: "/deals",
      icon: Percent,
    },
    {
      name: "Boards",
      href: "/boards",
      icon: Bookmark,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-brand-white border-t-2 border-brand-black">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const IconComponent = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center ${
                isActive ? "text-brand-pink" : "text-brand-black hover:text-brand-blue"
              } transition-colors duration-200`}
            >
              <IconComponent className={`h-6 w-6 ${isActive ? "animate-pulse" : ""}`} />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}