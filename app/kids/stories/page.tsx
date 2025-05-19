"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Volume2, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Story {
  id: number
  title: string
  image: string
  color: string
  content: string[]
  audioUrl: string
  moral: string
}

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState<"english" | "arabic" | "urdu">("english")

  const stories: Story[] = [
    {
      id: 1,
      title: "Prophet Yunus and the Whale",
      image: "/placeholder.svg?height=200&width=300",
      color: "bg-blue-500",
      content: [
        "Long ago, there was a prophet named Yunus (peace be upon him). Allah sent him to guide the people of Nineveh.",
        "The people of Nineveh did not listen to Prophet Yunus. They continued to do bad things and worship idols. Prophet Yunus became upset and left the city without Allah's permission.",
        "He boarded a ship to travel far away. While at sea, a terrible storm came. The people on the ship were afraid the ship would sink. They decided to lighten the load by throwing someone overboard. They drew lots, and Prophet Yunus's name was chosen.",
        "Prophet Yunus was thrown into the stormy sea. Allah sent a big whale that swallowed him whole! Inside the whale's belly, it was dark and lonely. Prophet Yunus realized his mistake in leaving his people without Allah's permission.",
        'He prayed to Allah: "There is no god but You. Glory be to You! I have been among the wrongdoers."',
        "Allah heard his prayer and forgave him. After three days, Allah commanded the whale to release Prophet Yunus onto the shore. Prophet Yunus was weak, but Allah made a plant grow to give him shade and food.",
        "When Prophet Yunus recovered, he returned to Nineveh. To his surprise, the people had changed their ways and believed in Allah! They had feared Allah's punishment after Prophet Yunus left.",
      ],
      audioUrl: "", // Removed external URL that was causing issues
      moral:
        "This story teaches us to be patient, to seek Allah's forgiveness when we make mistakes, and to never give up hope in Allah's mercy.",
    },
    {
      id: 2,
      title: "The Story of Prophet Nuh",
      image: "/placeholder.svg?height=200&width=300",
      color: "bg-green-500",
      content: [
        "Prophet Nuh (peace be upon him) lived a very long time ago. Allah chose him to guide his people to worship Allah alone.",
        "For 950 years, Prophet Nuh invited his people to believe in Allah and stop worshipping idols. But most of them refused to listen. They made fun of him and continued their bad ways.",
        "Allah told Prophet Nuh to build a big boat called an Ark. The people laughed at him because they couldn't understand why he was building a boat on dry land, far from any water.",
        "Prophet Nuh worked hard and finished building the Ark. Allah then commanded him to take a pair of each animal (a male and a female) onto the Ark, along with his family and the few people who believed in his message.",
        "Then, Allah sent a great flood. It rained for many days, and water covered everything, even the highest mountains. The Ark floated safely on the water, carrying Prophet Nuh, the believers, and all the animals.",
        "After many months, the flood ended. The Ark came to rest on Mount Judi. Prophet Nuh, his family, the believers, and all the animals came out of the Ark to start a new life.",
      ],
      audioUrl: "", // Removed external URL that was causing issues
      moral:
        "This story teaches us about having patience and faith in Allah, even when others make fun of us. It also shows us that Allah protects those who believe in Him and follow His guidance.",
    },
    {
      id: 3,
      title: "The Kindness of Prophet Muhammad",
      image: "/placeholder.svg?height=200&width=300",
      color: "bg-purple-500",
      content: [
        "Prophet Muhammad (peace be upon him) was known for his kindness to everyone - people, animals, and even his enemies.",
        "One day, an old woman used to throw garbage on Prophet Muhammad whenever he passed by her house. She did this because she did not like his message about Islam.",
        "One day, when the Prophet walked by her house, no garbage was thrown on him. He was concerned about the old woman and asked about her. He was told that she was sick.",
        "Instead of being happy that she couldn't throw garbage on him anymore, the Prophet went to visit her because she was sick. He wanted to make sure she was okay and to help her if she needed anything.",
        "The old woman was surprised by his kindness. She couldn't believe that someone she had been so mean to would come to check on her. This kindness touched her heart, and she realized what a good person he was. She later accepted Islam.",
      ],
      audioUrl: "", // Removed external URL that was causing issues
      moral:
        "This story teaches us to be kind to everyone, even those who are not kind to us. It shows us that kindness can change hearts and that we should always care about others, no matter how they treat us.",
    },
  ]

  // Initialize audio when a story is selected
  useEffect(() => {
    if (selectedStory) {
      // Create a new audio element but don't set the source yet
      const newAudio = new Audio()

      // Set up event listeners before setting the source
      newAudio.addEventListener("ended", () => setIsPlaying(false))
      newAudio.addEventListener("error", (e) => {
        console.error("Audio error:", e)
        setIsPlaying(false)
        toast({
          title: "Sound Error",
          description: "Could not play the story audio. Using text-only mode.",
          variant: "destructive",
        })
      })

      // Now set the audio reference
      audioRef.current = newAudio

      // Clean up on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.removeEventListener("ended", () => setIsPlaying(false))
          audioRef.current.removeEventListener("error", () => {})
        }
      }
    }
  }, [selectedStory])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
          toast({
            title: "Sound Error",
            description: "Could not play the story audio. Please try again.",
            variant: "destructive",
          })
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        // Only set the source when we're about to play
        // This prevents immediate loading errors when the component mounts
        if (!audioRef.current.src && selectedStory) {
          audioRef.current.src = selectedStory.audioUrl
        }

        // Try to play with better error handling
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
          toast({
            title: "Sound Error",
            description: "Could not play the story audio. You can still read the story.",
            variant: "destructive",
          })
        })
      } else {
        audioRef.current.pause()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Update the nextPage and prevPage functions to use Web Audio API instead of external sounds
  const nextPage = () => {
    if (selectedStory && currentPage < selectedStory.content.length - 1) {
      setCurrentPage(currentPage + 1)

      // Play page turn sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = "sine"
        oscillator.frequency.value = 400
        gainNode.gain.value = 0.05

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start()
        setTimeout(() => oscillator.stop(), 100)
      } catch (err) {
        console.log("Sound playback not supported in this browser, continuing silently")
      }
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)

      // Play page turn sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = "sine"
        oscillator.frequency.value = 300
        gainNode.gain.value = 0.05

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start()
        setTimeout(() => oscillator.stop(), 100)
      } catch (err) {
        console.log("Sound playback not supported in this browser, continuing silently")
      }
    }
  }

  // Translations for UI elements
  const uiTranslations = {
    english: {
      pageTitle: "Islamic Stories",
      backButton: "Back",
      listenButton: "Listen to Story",
      pauseButton: "Pause Story",
      nextButton: "Next Page",
      prevButton: "Previous Page",
      moralLabel: "Moral of the Story:",
      pageLabel: "Page",
    },
    arabic: {
      pageTitle: "قصص إسلامية",
      backButton: "العودة",
      listenButton: "استمع إلى القصة",
      pauseButton: "إيقاف القصة",
      nextButton: "الصفحة التالية",
      prevButton: "الصفحة السابقة",
      moralLabel: "العبرة من القصة:",
      pageLabel: "صفحة",
    },
    urdu: {
      pageTitle: "اسلامی کہانیاں",
      backButton: "واپس",
      listenButton: "کہانی سنیں",
      pauseButton: "کہانی روکیں",
      nextButton: "اگلا صفحہ",
      prevButton: "پچھلا صفحہ",
      moralLabel: "کہانی کا اخلاقی سبق:",
      pageLabel: "صفحہ",
    },
  }

  const currentTranslation = uiTranslations[currentLanguage]

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 overflow-hidden">
      {/* Floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
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
            📚
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            {selectedStory ? (
              <Button
                variant="ghost"
                className="mr-4"
                onClick={() => {
                  setSelectedStory(null)
                  setCurrentPage(0)
                  setIsPlaying(false)
                }}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {currentTranslation.backButton}
              </Button>
            ) : (
              <Link href="/kids">
                <Button variant="ghost" className="mr-4">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  {currentTranslation.backButton}
                </Button>
              </Link>
            )}
            <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-300">{currentTranslation.pageTitle}</h1>
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
          {selectedStory === null ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden cursor-pointer shadow-lg" onClick={() => setSelectedStory(story)}>
                    <div className={`h-3 ${story.color}`}></div>
                    <CardContent className="p-6">
                      <motion.div
                        className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={story.image || "/placeholder.svg"}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <h2 className="text-xl font-bold mb-2">{story.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{story.content[0].substring(0, 100)}...</p>
                      <Button className={`mt-4 text-white ${story.color}`}>Read Story</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-3xl mx-auto overflow-hidden shadow-xl">
                <div className={`h-3 ${selectedStory.color}`}></div>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">{selectedStory.title}</h2>

                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 overflow-hidden">
                      <img
                        src={selectedStory.image || "/placeholder.svg"}
                        alt={selectedStory.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePlayPause}
                        className={isPlaying ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : ""}
                        disabled={!selectedStory?.audioUrl} // Disable if no audio URL
                      >
                        {selectedStory?.audioUrl ? (
                          isPlaying ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              {currentTranslation.pauseButton}
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-4 w-4 mr-2" />
                              {currentTranslation.listenButton}
                            </>
                          )
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4 mr-2 opacity-50" />
                            Audio Unavailable
                          </>
                        )}
                      </Button>

                      <div className="text-sm text-gray-500">
                        {currentTranslation.pageLabel} {currentPage + 1} / {selectedStory.content.length}
                      </div>
                    </div>

                    <motion.div
                      key={`page-${currentPage}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[200px] bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl mb-6"
                    >
                      <p className="text-lg leading-relaxed">{selectedStory.content[currentPage]}</p>
                    </motion.div>

                    {currentPage === selectedStory.content.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-6"
                      >
                        <h3 className="font-bold mb-2">{currentTranslation.moralLabel}</h3>
                        <p>{selectedStory.moral}</p>
                      </motion.div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={prevPage} disabled={currentPage === 0}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        {currentTranslation.prevButton}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={nextPage}
                        disabled={currentPage === selectedStory.content.length - 1}
                      >
                        {currentTranslation.nextButton}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
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
