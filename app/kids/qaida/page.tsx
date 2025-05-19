"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, VolumeIcon as VolumeUp, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function QaidaPage() {
  const [currentLetter, setCurrentLetter] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // Arabic alphabet with their names and sounds
  const arabicAlphabet = [
    { letter: "ا", name: "Alif", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/alif.mp3" },
    { letter: "ب", name: "Ba", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/ba.mp3" },
    { letter: "ت", name: "Ta", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/ta.mp3" },
    { letter: "ث", name: "Tha", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/tha.mp3" },
    { letter: "ج", name: "Jim", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/jiim.mp3" },
    { letter: "ح", name: "Ha", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/ha.mp3" },
    { letter: "خ", name: "Kha", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/kha.mp3" },
    { letter: "د", name: "Dal", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/daal.mp3" },
    { letter: "ذ", name: "Dhal", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/thaal.mp3" },
    { letter: "ر", name: "Ra", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/ra.mp3" },
    { letter: "ز", name: "Zay", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/zay.mp3" },
    { letter: "س", name: "Sin", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/siin.mp3" },
    { letter: "ش", name: "Shin", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/shiin.mp3" },
    { letter: "ص", name: "Sad", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/saad.mp3" },
    { letter: "ض", name: "Dad", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/daad.mp3" },
    { letter: "ط", name: "Ta", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/taa.mp3" },
    { letter: "ظ", name: "Dha", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/thaa.mp3" },
    { letter: "ع", name: "Ayn", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/ayn.mp3" },
    { letter: "غ", name: "Ghayn", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/ghayn.mp3" },
    { letter: "ف", name: "Fa", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/fa.mp3" },
    { letter: "ق", name: "Qaf", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/qaf.mp3" },
    { letter: "ك", name: "Kaf", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/kaf.mp3" },
    { letter: "ل", name: "Lam", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/lam.mp3" },
    { letter: "م", name: "Mim", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/miim.mp3" },
    { letter: "ن", name: "Nun", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/nuun.mp3" },
    { letter: "ه", name: "Ha", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/hha.mp3" },
    { letter: "و", name: "Waw", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/waw.mp3" },
    { letter: "ي", name: "Ya", sound: "https://www.arabicreadingcourse.com/audio/isolated-letters/ya.mp3" },
  ]

  // Colors for the letters
  const colors = [
    "bg-pink-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-red-500",
    "bg-indigo-500",
  ]

  useEffect(() => {
    // Initialize audio
    const newAudio = new Audio(arabicAlphabet[currentLetter].sound)
    newAudio.preload = "auto"

    // Add event listeners
    newAudio.addEventListener("ended", () => setIsPlaying(false))
    newAudio.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      setIsPlaying(false)
      toast({
        title: "Sound Error",
        description: "Could not play the sound. Please try again.",
        variant: "destructive",
      })
    })

    setAudio(newAudio)

    return () => {
      if (newAudio) {
        newAudio.pause()
        newAudio.removeEventListener("ended", () => setIsPlaying(false))
        newAudio.removeEventListener("error", () => {})
      }
    }
  }, [currentLetter])

  const playSound = () => {
    if (audio) {
      setIsPlaying(true)
      audio.currentTime = 0

      // Play with error handling
      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
        toast({
          title: "Sound Error",
          description: "Could not play the sound. The audio might not be available or supported by your browser.",
          variant: "destructive",
        })
      })
    }
  }

  const nextLetter = () => {
    setCurrentLetter((prev) => (prev === arabicAlphabet.length - 1 ? 0 : prev + 1))
  }

  const prevLetter = () => {
    setCurrentLetter((prev) => (prev === 0 ? arabicAlphabet.length - 1 : prev - 1))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 overflow-hidden">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              ["bg-pink-300", "bg-blue-300", "bg-yellow-300", "bg-purple-300", "bg-green-300"][i % 5]
            } opacity-70 dark:opacity-30`}
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 80 - 40, 0],
              y: [0, Math.random() * 80 - 40, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 flex items-center">
          <Link href="/kids">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">Learn Arabic Alphabet</h1>
        </header>

        <div className="max-w-3xl mx-auto">
          <Card className="rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <Button
                  onClick={prevLetter}
                  className="rounded-full h-12 w-12 p-0 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="text-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentLetter + 1} of {arabicAlphabet.length}
                  </span>
                </div>
                <Button
                  onClick={nextLetter}
                  className="rounded-full h-12 w-12 p-0 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLetter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className={`w-48 h-48 rounded-full flex items-center justify-center mb-6 ${
                      colors[currentLetter % colors.length]
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-8xl font-bold text-white font-arabic">
                      {arabicAlphabet[currentLetter].letter}
                    </span>
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                    {arabicAlphabet[currentLetter].name}
                  </h2>
                  <Button
                    onClick={playSound}
                    disabled={isPlaying}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    as={motion.button}
                  >
                    <VolumeUp className={`h-5 w-5 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
                    {isPlaying ? "Playing..." : "Listen"}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-6">
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">All Letters</h3>
              <div className="grid grid-cols-7 gap-2">
                {arabicAlphabet.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`p-2 ${
                      currentLetter === index
                        ? `${colors[index % colors.length]} text-white`
                        : "bg-white dark:bg-gray-800"
                    } rounded-lg`}
                    onClick={() => setCurrentLetter(index)}
                  >
                    <span className="text-xl font-arabic">{item.letter}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Practice writing these letters on paper and come back to learn more!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
