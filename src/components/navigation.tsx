"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, Users, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Boshqaruv paneli", href: "/", icon: LayoutDashboard },
  { name: "Vazifalar", href: "/tasks", icon: Calendar },
  { name: "Foydalanuvchilar", href: "/users", icon: Users },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

    if(pathname === "/dashboard"){
        return
    }

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              mobile ? "w-full justify-start" : "",
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-3 md:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg md:text-xl font-bold text-gray-900">
              Admin Panel
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavItems />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden relative">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative z-50">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-25 z-40 opacity-20" onClick={() => setIsOpen(false)} />

                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                  <div className="py-2">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50",
                            pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900",
                          )}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
