"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function IslamicDate() {
  const [gregorianDate, setGregorianDate] = useState(new Date())
  const [islamicDate, setIslamicDate] = useState({
    day: 0,
    month: "",
    year: 0,
    monthArabic: "",
  })

  // Islamic months
  const islamicMonths = [
    { english: "Muharram", arabic: "محرم" },
    { english: "Safar", arabic: "صفر" },
    { english: "Rabi al-Awwal", arabic: "ربيع الأول" },
    { english: "Rabi al-Thani", arabic: "ربيع الثاني" },
    { english: "Jumada al-Awwal", arabic: "جمادى الأولى" },
    { english: "Jumada al-Thani", arabic: "جمادى الثانية" },
    { english: "Rajab", arabic: "رجب" },
    { english: "Sha'ban", arabic: "شعبان" },
    { english: "Ramadan", arabic: "رمضان" },
    { english: "Shawwal", arabic: "شوال" },
    { english: "Dhu al-Qi'dah", arabic: "ذو القعدة" },
    { english: "Dhu al-Hijjah", arabic: "ذو الحجة" },
  ]

  // Convert Gregorian to Islamic date
  // This is a simplified conversion - in a real app, you'd use a proper library
  useEffect(() => {
    // Simplified calculation - this is not accurate
    // In a real app, use a proper Hijri calendar library
    const today = new Date()

    // This is just a placeholder calculation
    // The actual calculation is complex and requires astronomical data
    const estimatedIslamicYear = Math.floor(today.getFullYear() - 622 + today.getMonth() / 12)
    const estimatedIslamicMonth = Math.floor((today.getMonth() + 1) % 12)
    const estimatedIslamicDay = today.getDate()

    setIslamicDate({
      day: estimatedIslamicDay,
      month: islamicMonths[estimatedIslamicMonth].english,
      year: estimatedIslamicYear,
      monthArabic: islamicMonths[estimatedIslamicMonth].arabic,
    })
  }, [gregorianDate])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Islamic Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
              Gregorian Date
            </h3>
            <p className="text-3xl font-bold">
              {gregorianDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex-1 bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
              Islamic Date
            </h3>
            <p className="text-3xl font-bold">
              {islamicDate.day} {islamicDate.month}, {islamicDate.year} AH
            </p>
            <p className="text-xl mt-2 font-arabic text-emerald-700 dark:text-emerald-300">
              {islamicDate.day} {islamicDate.monthArabic} {islamicDate.year}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Important Islamic Dates</h3>
          <div className="space-y-3">
            {[
              { date: "Ramadan 1", description: "Beginning of Ramadan" },
              { date: "Ramadan 27", description: "Laylat al-Qadr (Night of Power)" },
              { date: "Shawwal 1", description: "Eid al-Fitr" },
              { date: "Dhu al-Hijjah 10", description: "Eid al-Adha" },
              { date: "Muharram 1", description: "Islamic New Year" },
            ].map((event, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">{event.date}</span>
                <span>{event.description}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
