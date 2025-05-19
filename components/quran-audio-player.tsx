"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const surahData: Record<string, number> = {
  الفاتحة: 7,
  البقرة: 286,
  "آل عمران": 200,
  النساء: 176,
  المائدة: 120,
  الأنعام: 165,
  الأعراف: 206,
  الأنفال: 75,
  التوبة: 129,
  يونس: 109,
  هود: 123,
  يوسف: 111,
  الرعد: 43,
  إبراهيم: 52,
  الحجر: 99,
  النحل: 128,
  الإسراء: 111,
  الكهف: 110,
  مريم: 98,
  طه: 135,
  الأنبياء: 112,
  الحج: 78,
  المؤمنون: 118,
  النور: 64,
  الفرقان: 77,
  الشعراء: 227,
  النمل: 93,
  القصص: 88,
  العنكبوت: 69,
  الروم: 60,
  // More surahs can be added as needed
}

// Map surah names to their numbers for the API
const surahNameToNumber: Record<string, number> = {}
Object.keys(surahData).forEach((name, index) => {
  surahNameToNumber[name] = index + 1
})

export default function QuranAudioPlayer() {
  const [selectedSurah, setSelectedSurah] = useState<string | null>(null)
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null)
  const [verses, setVerses] = useState<string[]>([])
  const [quranData, setQuranData] = useState<any>(null)
  const [verseText, setVerseText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    setIsLoading(true)
    fetch("https://api.alquran.cloud/v1/quran/quran-uthmani")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200 && data.data) {
          setQuranData(data.data)
          setIsLoading(false)
          setError(null)
        } else {
          throw new Error("Failed to load Quran data")
        }
      })
      .catch((err) => {
        console.error("Failed to load Quran data", err)
        setIsLoading(false)
        setError("Failed to load Quran data. Please try again later.")
      })
  }, [])

  const updateVerses = (surah: string) => {
    const count = surahData[surah]
    const newVerses = Array.from({ length: count }, (_, i) => (i + 1).toString())
    setVerses(newVerses)
    setSelectedVerse(null)
    setVerseText("")
  }

  const playAudio = () => {
    if (!selectedSurah || !selectedVerse) return

    const surahNumber = surahNameToNumber[selectedSurah]
    const verseNum = Number.parseInt(selectedVerse, 10)

    // Using a more reliable audio source
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber}${verseNum}.mp3`

    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err)
        setError("Failed to play audio. Please try again.")
      })
      setIsPlaying(true)

      audioRef.current.onended = () => {
        setIsPlaying(false)
      }
    }

    if (quranData) {
      try {
        const surah = quranData.surahs.find((s: any) => s.number === surahNumber)
        if (surah && verseNum <= surah.ayahs.length) {
          setVerseText(surah.ayahs[verseNum - 1].text)
          setError(null)
        } else {
          setVerseText("Verse not found.")
          setError("Verse not found in the selected surah.")
        }
      } catch (err) {
        console.error("Error getting verse text:", err)
        setVerseText("")
        setError("Error retrieving verse text.")
      }
    }
  }

  const handleNextVerse = () => {
    if (!selectedVerse || !selectedSurah) return

    const currentVerseNum = Number.parseInt(selectedVerse, 10)
    const maxVerses = surahData[selectedSurah]

    if (currentVerseNum < maxVerses) {
      const nextVerse = (currentVerseNum + 1).toString()
      setSelectedVerse(nextVerse)

      // Auto-play next verse
      setTimeout(() => {
        playAudio()
      }, 100)
    }
  }

  const handlePrevVerse = () => {
    if (!selectedVerse || !selectedSurah) return

    const currentVerseNum = Number.parseInt(selectedVerse, 10)

    if (currentVerseNum > 1) {
      const prevVerse = (currentVerseNum - 1).toString()
      setSelectedVerse(prevVerse)

      // Auto-play previous verse
      setTimeout(() => {
        playAudio()
      }, 100)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-emerald-800 dark:text-emerald-300">Quran Audio Player</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-4">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Select Surah</label>
              <Select
                disabled={isLoading}
                onValueChange={(value) => {
                  setSelectedSurah(value)
                  updateVerses(value)
                }}
                value={selectedSurah || ""}
              >
                <SelectTrigger className="w-full bg-white dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                  <SelectValue placeholder="Choose Surah" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {Object.keys(surahData).map((surah) => (
                    <SelectItem key={surah} value={surah}>
                      {surah} ({surahNameToNumber[surah]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Select Verse</label>
              <Select
                disabled={!verses.length || isLoading}
                onValueChange={(value) => setSelectedVerse(value)}
                value={selectedVerse || ""}
              >
                <SelectTrigger className="w-full bg-white dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                  <SelectValue placeholder="Choose Verse" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {verses.map((verse) => (
                    <SelectItem key={verse} value={verse}>
                      {verse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            <Button
              onClick={handlePrevVerse}
              disabled={!selectedSurah || !selectedVerse || selectedVerse === "1" || isLoading}
              variant="outline"
              className="border-emerald-200 dark:border-emerald-800"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={playAudio}
              disabled={!selectedSurah || !selectedVerse || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pause" : "Play Audio"}
            </Button>

            <Button
              onClick={handleNextVerse}
              disabled={
                !selectedSurah ||
                !selectedVerse ||
                (selectedVerse && Number(selectedVerse) >= surahData[selectedSurah!]) ||
                isLoading
              }
              variant="outline"
              className="border-emerald-200 dark:border-emerald-800"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">Audio Player:</p>
            <audio
              ref={audioRef}
              controls
              className="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">Verse Text:</p>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="p-4 bg-white dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800 min-h-[100px]">
                <p className="text-2xl text-right font-arabic" dir="rtl">
                  {verseText || "Select a surah and verse to display text"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
