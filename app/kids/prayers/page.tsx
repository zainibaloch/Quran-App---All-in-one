"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Volume2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Dua {
  id: string
  title: string
  icon: string
  arabic: string
  transliteration: string
  translation: string
  color: string
  audioUrl: string
}

export default function DuaPage() {
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<"english" | "arabic" | "urdu">("english")

  const duas: Dua[] = [
    {
      id: "milk",
      title: "Dua for Drinking Milk",
      icon: "🥛",
      arabic: "بِسْمِ اللهِ، اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ",
      transliteration: "Bismillah, Allahumma baarik lana feehee wa zidna minhu.",
      translation: "O Allah, bless it for us, give us more of it.",
      color: "bg-blue-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/16.mp3",
    },
    {
      id: "home",
      title: "Dua for Leaving Home",
      icon: "🏠",
      arabic: "بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
      transliteration: "Bismillaahi, tawakkaltu 'alallaahi, wa laa hawla wa laa quwwata ' illaa billaah.",
      translation:
        "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
      color: "bg-green-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/8.mp3",
    },
    {
      id: "eating",
      title: "Dua for Eating",
      icon: "🍽️",
      arabic: "بِسْمِ اللهِ",
      transliteration: "Bismillah",
      translation: "In the name of Allah.",
      color: "bg-orange-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/1.mp3",
    },
    {
      id: "knowledge",
      title: "Dua for Seeking Knowledge",
      icon: "📚",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidni ilma",
      translation: "O Allah, increase me in knowledge.",
      color: "bg-purple-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/38.mp3",
    },
    {
      id: "protection",
      title: "Dua for Protection",
      icon: "🛡️",
      arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      transliteration: "A'oodhu bi kalimatillahit-tammati min sharri ma khalaq",
      translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      color: "bg-red-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/27.mp3",
    },
    {
      id: "forgiveness",
      title: "Dua for Forgiveness",
      icon: "🤲",
      arabic: "أَسْتَغْفِرُ اللهَ",
      transliteration: "Astaghfirullah",
      translation: "I seek forgiveness from Allah.",
      color: "bg-teal-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/31.mp3",
    },
    {
      id: "character",
      title: "Dua for Good Character",
      icon: "😇",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى، وَالتُّقَى، وَالْعَفَافَ، وَالْغِنَى",
      transliteration: "Allahumma innee as'alukal-huda, wattuqa, wal-afafa, wal-ghina",
      translation: "O Allah, I ask You for guidance, righteousness, chastity, and self-sufficiency.",
      color: "bg-indigo-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/48.mp3",
    },
    {
      id: "anger",
      title: "Dua When You Get Angry",
      icon: "😠",
      arabic: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A'oothu billaahi minash-Shaytaanir-rajeem",
      translation: "I seek refuge with Allah against the Satan, the outcast.",
      color: "bg-pink-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/28.mp3",
    },
    {
      id: "easy",
      title: "Dua to Make Things Easy",
      icon: "🌈",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
      transliteration: "Rabbish Rahli Sadri wa Yasirli Amri Wahlul Auqdatan Min Lisane, Yafkahu Kauli.",
      translation:
        "My Lord, expand for me my breast [with assurance] and ease for me my task and untie the knot from my tongue That they may understand my speech.",
      color: "bg-yellow-500",
      audioUrl: "https://www.islamicfinder.org/audio/dua/39.mp3",
    },
  ]

  // Update the playAudio function to handle errors better
  const playAudio = (dua: Dua) => {
    setIsPlaying(true)

    // Create and play audio
    const audio = new Audio(dua.audioUrl)
    audio.preload = "auto"

    // Add event listeners
    audio.addEventListener("ended", () => setIsPlaying(false))
    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      setIsPlaying(false)
      toast({
        title: "Sound Error",
        description: "Could not play the dua audio. The audio might not be available or supported by your browser.",
        variant: "destructive",
      })
    })

    // Play with error handling
    audio.play().catch((error) => {
      console.error("Error playing audio:", error)
      setIsPlaying(false)
      toast({
        title: "Sound Error",
        description: "Could not play the dua audio. The audio might not be available or supported by your browser.",
        variant: "destructive",
      })
    })
  }

  // Translations for UI elements
  const uiTranslations = {
    english: {
      pageTitle: "Daily Duas",
      backButton: "Back to Duas",
      listenButton: "Listen",
      playingText: "Playing...",
      backToHome: "Back",
    },
    arabic: {
      pageTitle: "الأدعية اليومية",
      backButton: "العودة إلى الأدعية",
      listenButton: "استمع",
      playingText: "جاري التشغيل...",
      backToHome: "العودة",
    },
    urdu: {
      pageTitle: "روزانہ کی دعائیں",
      backButton: "دعاؤں پر واپس جائیں",
      listenButton: "سنیں",
      playingText: "چل رہا ہے...",
      backToHome: "واپس",
    },
  }

  const currentTranslation = uiTranslations[currentLanguage]

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 overflow-hidden">
      {/* Floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            {["🤲", "📿", "☪️", "🕌", "🕋"][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            {selectedDua ? (
              <Button variant="ghost" className="mr-4" onClick={() => setSelectedDua(null)}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                {currentTranslation.backButton}
              </Button>
            ) : (
              <Link href="/kids">
                <Button variant="ghost" className="mr-4">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  {currentTranslation.backToHome}
                </Button>
              </Link>
            )}
            <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-300">
              {selectedDua ? selectedDua.title : currentTranslation.pageTitle}
            </h1>
          </div>

          {/* Language selector */}
          <div className="flex space-x-2">
            <Button
              variant={currentLanguage === "english" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentLanguage("english")}
            >
              English
            </Button>
            <Button
              variant={currentLanguage === "arabic" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentLanguage("arabic")}
            >
              العربية
            </Button>
            <Button
              variant={currentLanguage === "urdu" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentLanguage("urdu")}
            >
              اردو
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!selectedDua ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {duas.map((dua, index) => (
                <motion.div
                  key={dua.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`overflow-hidden cursor-pointer shadow-lg border-b-4 ${dua.color}`}
                    onClick={() => setSelectedDua(dua)}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <motion.div
                        className={`w-16 h-16 rounded-full ${dua.color} flex items-center justify-center text-white text-3xl mb-3`}
                        whileHover={{ rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {dua.icon}
                      </motion.div>
                      <h2 className="font-bold">{dua.title}</h2>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`overflow-hidden shadow-xl border-t-8 ${selectedDua.color}`}>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center mb-6">
                    <motion.div
                      className={`w-24 h-24 rounded-full ${selectedDua.color} flex items-center justify-center text-white text-5xl mb-4`}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    >
                      {selectedDua.icon}
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-1">{selectedDua.title}</h2>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-inner">
                    <p className="text-right text-3xl leading-loose font-arabic mb-4">{selectedDua.arabic}</p>
                    <p className="text-lg italic mb-4">{selectedDua.transliteration}</p>
                    <p className="text-gray-700 dark:text-gray-300">{selectedDua.translation}</p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={() => playAudio(selectedDua)}
                      disabled={isPlaying}
                      className={`${selectedDua.color} hover:opacity-90`}
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Volume2 className={`h-4 w-4 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
                      {isPlaying ? currentTranslation.playingText : currentTranslation.listenButton}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
