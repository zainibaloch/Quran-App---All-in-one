"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, Loader2 } from "lucide-react"
import { getPrayerTimes } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface PrayerTime {
  name: string
  time: string
}

export default function PrayerTimes() {
  const [location, setLocation] = useState("New York")
  const [country, setCountry] = useState("United States")
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [error, setError] = useState<string | null>(null)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Load prayer times on component mount and when location changes
  useEffect(() => {
    fetchPrayerTimes()
  }, [])

  const fetchPrayerTimes = async () => {
    setLoading(true)
    setError(null)

    try {
      const timings = await getPrayerTimes(location, country)

      // Format the prayer times
      const formattedTimes: PrayerTime[] = [
        { name: "Fajr", time: formatTime(timings.Fajr) },
        { name: "Sunrise", time: formatTime(timings.Sunrise) },
        { name: "Dhuhr", time: formatTime(timings.Dhuhr) },
        { name: "Asr", time: formatTime(timings.Asr) },
        { name: "Maghrib", time: formatTime(timings.Maghrib) },
        { name: "Isha", time: formatTime(timings.Isha) },
      ]

      setPrayerTimes(formattedTimes)
    } catch (error) {
      console.error("Error fetching prayer times:", error)
      setError("Failed to fetch prayer times. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format time from 24-hour to 12-hour format
  const formatTime = (time: string): string => {
    if (!time) return ""

    // If time already includes AM/PM, return as is
    if (time.includes("AM") || time.includes("PM")) {
      return time
    }

    try {
      // Parse the time (assuming format is HH:MM or HH:MM:SS)
      const [hours, minutes] = time.split(":").map(Number)

      const period = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM

      return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
    } catch (e) {
      console.error("Error formatting time:", e)
      return time // Return original if parsing fails
    }
  }

  // Find the next prayer time
  const getNextPrayer = (): string => {
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeMinutes = currentHour * 60 + currentMinute

    // Convert prayer times to minutes since midnight for comparison
    const prayerTimeMinutes = prayerTimes.map((prayer) => {
      const [time, period] = prayer.time.split(" ")
      let [hours, minutes] = time.split(":").map(Number)

      // Adjust hours for PM
      if (period === "PM" && hours !== 12) {
        hours += 12
      }
      // Adjust for 12 AM
      if (period === "AM" && hours === 12) {
        hours = 0
      }

      return {
        name: prayer.name,
        minutes: hours * 60 + minutes,
      }
    })

    // Find the next prayer
    for (const prayer of prayerTimeMinutes) {
      if (prayer.minutes > currentTimeMinutes) {
        return prayer.name
      }
    }

    // If all prayers for today have passed, the next prayer is Fajr tomorrow
    return "Fajr"
  }

  const nextPrayer = getNextPrayer()

  const handleLocationChange = () => {
    fetchPrayerTimes()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Prayer Times</span>
          <span className="text-sm font-normal text-emerald-600">
            {currentTime.toLocaleDateString()} |{" "}
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <Input
            placeholder="Enter city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleLocationChange} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
            Update
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="grid gap-4">
          {loading
            ? // Skeleton loading state
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
            : prayerTimes.map((prayer) => (
                <div
                  key={prayer.name}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    prayer.name === nextPrayer ? "bg-emerald-100 dark:bg-emerald-800" : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                    <span>{prayer.name}</span>
                  </div>
                  <span className="font-medium">{prayer.time}</span>
                  {prayer.name === nextPrayer && (
                    <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">Next</span>
                  )}
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
