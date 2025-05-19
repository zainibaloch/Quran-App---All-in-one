"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PrayerTimes from "@/components/prayer-times"
import QiblaFinder from "@/components/qibla-finder"
import QuranReader from "@/components/quran-reader"
import UnifiedSearch from "@/components/unified-search"
import LearningAnalytics from "@/components/learning-analytics"
import AppFooter from "@/components/app-footer"
import { Button } from "@/components/ui/button"
import { Settings, Moon, Sun } from "lucide-react"
import { useUserMode } from "@/components/user-mode-provider"
import { useRouter } from "next/navigation"
import QuranAudioPlayer from "@/components/quran-audio-player"
import HadithSearch from "@/components/hadith-search"
import { useTheme } from "next-themes"

export default function AdultHomePage() {
  const { setMode } = useUserMode()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">Islamic Companion</h1>
            <p className="text-emerald-600 dark:text-emerald-400">Your daily guide for Islamic practices</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/settings")} className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode("kid")}
              className="bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-300 dark:border-pink-700 dark:hover:bg-pink-800"
            >
              Switch to Kids Mode
            </Button>
          </div>
        </header>

        <Tabs defaultValue="prayers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 md:grid-cols-7 rounded-full p-1 bg-emerald-100 dark:bg-emerald-900">
            <TabsTrigger value="prayers" className="rounded-full">
              Prayer Times
            </TabsTrigger>
            <TabsTrigger value="qibla" className="rounded-full">
              Qibla Finder
            </TabsTrigger>
            <TabsTrigger value="quran" className="rounded-full">
              Quran
            </TabsTrigger>
            <TabsTrigger value="audio" className="rounded-full">
              Quran Audio
            </TabsTrigger>
            <TabsTrigger value="hadith" className="rounded-full">
              Hadith
            </TabsTrigger>
            <TabsTrigger value="search" className="rounded-full">
              Search
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-full">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prayers" className="mt-4">
            <PrayerTimes />
          </TabsContent>

          <TabsContent value="qibla" className="mt-4">
            <QiblaFinder />
          </TabsContent>

          <TabsContent value="quran" className="mt-4">
            <QuranReader />
          </TabsContent>

          <TabsContent value="audio" className="mt-4">
            <QuranAudioPlayer />
          </TabsContent>

          <TabsContent value="hadith" className="mt-4">
            <HadithSearch />
          </TabsContent>

          <TabsContent value="search" className="mt-4">
            <UnifiedSearch />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <LearningAnalytics />
          </TabsContent>
        </Tabs>
      </div>
      <AppFooter />
    </main>
  )
}
