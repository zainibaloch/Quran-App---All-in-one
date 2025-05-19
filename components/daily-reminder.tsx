"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Share2 } from "lucide-react"

// Sample reminders data
const reminders = [
  {
    text: "The Prophet Muhammad (peace be upon him) said: 'The best of you are those who learn the Quran and teach it.'",
    source: "Sahih Al-Bukhari",
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    source: "Quran 2:286",
  },
  {
    text: "The Prophet Muhammad (peace be upon him) said: 'Whoever believes in Allah and the Last Day should speak good or remain silent.'",
    source: "Sahih Al-Bukhari",
  },
  {
    text: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    source: "Quran 2:186",
  },
  {
    text: "The Prophet Muhammad (peace be upon him) said: 'The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.'",
    source: "Sahih Al-Bukhari",
  },
]

export default function DailyReminder() {
  const [currentReminder, setCurrentReminder] = useState(0)
  const [loading, setLoading] = useState(false)

  // Get a new random reminder
  const getNewReminder = () => {
    setLoading(true)
    setTimeout(() => {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * reminders.length)
      } while (newIndex === currentReminder)

      setCurrentReminder(newIndex)
      setLoading(false)
    }, 500)
  }

  // Share the reminder (in a real app, this would use the Web Share API)
  const shareReminder = () => {
    const reminder = reminders[currentReminder]
    if (navigator.share) {
      navigator.share({
        title: "Islamic Daily Reminder",
        text: `"${reminder.text}" - ${reminder.source}`,
        url: window.location.href,
      })
    } else {
      alert("Sharing is not supported on this browser.")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Islamic Reminder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4">
          <blockquote className="text-lg italic text-emerald-800 dark:text-emerald-200">
            "{reminders[currentReminder].text}"
          </blockquote>
          <footer className="mt-4 text-right text-emerald-600 dark:text-emerald-400">
            — {reminders[currentReminder].source}
          </footer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={getNewReminder} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          New Reminder
        </Button>
        <Button onClick={shareReminder}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}
