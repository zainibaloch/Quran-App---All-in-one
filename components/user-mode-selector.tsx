"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface UserModeSelectorProps {
  onSelect: (mode: "adult" | "kid") => void
}

export default function UserModeSelector({ onSelect }: UserModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<"adult" | "kid" | null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-950 p-4">
      <Card className="w-full max-w-3xl overflow-hidden shadow-xl rounded-3xl">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <motion.div
              className={`p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                hoveredMode === "adult" ? "bg-emerald-100 dark:bg-emerald-800" : "bg-white dark:bg-gray-900"
              }`}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredMode("adult")}
              onHoverEnd={() => setHoveredMode(null)}
              onClick={() => onSelect("adult")}
            >
              <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Adult Mode</h2>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Full access to all features including Quran, prayer times, and more.
              </p>
              <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">Enter Adult Mode</Button>
            </motion.div>

            <motion.div
              className={`p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                hoveredMode === "kid" ? "bg-pink-100 dark:bg-pink-900" : "bg-white dark:bg-gray-900"
              }`}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredMode("kid")}
              onHoverEnd={() => setHoveredMode(null)}
              onClick={() => onSelect("kid")}
            >
              <div className="w-32 h-32 rounded-full bg-pink-500 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18h6"></path>
                  <path d="M10 22h4"></path>
                  <path d="M8 12h8"></path>
                  <path d="M17 6.1a6 6 0 1 0-10 0"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Kids Mode</h2>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Fun and interactive learning experience for children with Qaida and more.
              </p>
              <Button className="mt-6 bg-pink-600 hover:bg-pink-700">Enter Kids Mode</Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
