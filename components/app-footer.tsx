"use client"
import { Home, Search, Book, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AppFooter() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center">
          <div
            className={cn(
              "p-2 rounded-full",
              isActive("/")
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300",
            )}
          >
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link href="/search" className="flex flex-col items-center">
          <div
            className={cn(
              "p-2 rounded-full",
              isActive("/search")
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300",
            )}
          >
            <Search className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1">Search</span>
        </Link>

        <Link href="/quran" className="flex flex-col items-center">
          <div
            className={cn(
              "p-2 rounded-full",
              isActive("/quran")
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300",
            )}
          >
            <Book className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1">Quran</span>
        </Link>

        <Link href="/settings" className="flex flex-col items-center">
          <div
            className={cn(
              "p-2 rounded-full",
              isActive("/settings")
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300",
            )}
          >
            <Settings className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  )
}
