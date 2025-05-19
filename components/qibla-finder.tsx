"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Compass, Loader2 } from "lucide-react"

export default function QiblaFinder() {
  const [direction, setDirection] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findQibla = () => {
    setLoading(true)
    setError(null)

    // In a real app, this would use the Geolocation API and calculate the Qibla direction
    // For this demo, we'll simulate it
    if (navigator.geolocation) {
      setTimeout(() => {
        // Simulating a Qibla direction (this would be calculated based on user's location)
        setDirection(Math.floor(Math.random() * 360))
        setLoading(false)
      }, 2000)
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Qibla Direction Finder</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-64 h-64 mb-6">
          {direction !== null ? (
            <>
              <div className="w-full h-full rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full">
                  <div className="absolute top-0 left-1/2 -ml-0.5 h-3 w-1 bg-gray-400"></div>
                  <div className="absolute bottom-0 left-1/2 -ml-0.5 h-3 w-1 bg-gray-400"></div>
                  <div className="absolute left-0 top-1/2 -mt-0.5 w-3 h-1 bg-gray-400"></div>
                  <div className="absolute right-0 top-1/2 -mt-0.5 w-3 h-1 bg-gray-400"></div>
                </div>
                <div
                  className="w-1 h-32 bg-emerald-600 origin-bottom transform transition-transform duration-1000"
                  style={{ transform: `rotate(${direction}deg)` }}
                ></div>
                <div className="absolute w-4 h-4 bg-emerald-600 rounded-full"></div>
                <div className="absolute bottom-0 w-full text-center">
                  <span className="text-sm text-gray-500">N</span>
                </div>
                <div className="absolute top-0 w-full text-center">
                  <span className="text-sm text-gray-500">S</span>
                </div>
                <div className="absolute left-0 h-full flex items-center">
                  <span className="text-sm text-gray-500">W</span>
                </div>
                <div className="absolute right-0 h-full flex items-center">
                  <span className="text-sm text-gray-500">E</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-medium">
                  Qibla is <span className="text-emerald-600">{direction}°</span> from North
                </p>
              </div>
            </>
          ) : (
            <div className="w-full h-full rounded-full border-2 border-gray-300 flex items-center justify-center">
              <Compass className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Button onClick={findQibla} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Qibla...
            </>
          ) : (
            <>
              <Compass className="mr-2 h-4 w-4" />
              Find Qibla Direction
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
