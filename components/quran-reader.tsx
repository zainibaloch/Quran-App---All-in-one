"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  BookOpen,
  Settings,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  getSurahs,
  getSurahVerses,
  getReciters,
  getTranslations,
  getTafsir,
  getWordTimings,
  type Surah,
  type QuranVerse,
  type Reciter,
  type Translation,
} from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function QuranReader() {
  // State for Quran data
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [verses, setVerses] = useState<QuranVerse[]>([])
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null)
  const [translations, setTranslations] = useState<Translation[]>([])
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null)
  const [tafsir, setTafsir] = useState<string>("")
  const [audioSrc, setAudioSrc] = useState<string>("")

  // UI state
  const [loading, setLoading] = useState({
    surahs: true,
    verses: false,
    reciters: true,
    translations: true,
    audio: false,
    tafsir: false,
  })
  const [showTafsir, setShowTafsir] = useState(false)
  const [volume, setVolume] = useState(75)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [repeatCount, setRepeatCount] = useState(1)
  const [currentRepeat, setCurrentRepeat] = useState(0)
  const [autoScroll, setAutoScroll] = useState(true)
  const [highlightWords, setHighlightWords] = useState(true)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wordTimings, setWordTimings] = useState<number[][]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const verseRefs = useRef<(HTMLDivElement | null)[]>([])
  const wordIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load surahs
        const surahsData = await getSurahs()
        setSurahs(surahsData)
        setSelectedSurah(surahsData[0]) // Default to Al-Fatiha
        setLoading((prev) => ({ ...prev, surahs: false }))

        // Load reciters
        const recitersData = await getReciters()
        setReciters(recitersData)
        setSelectedReciter(recitersData[0])
        setLoading((prev) => ({ ...prev, reciters: false }))

        // Load translations
        const translationsData = await getTranslations()
        setTranslations(translationsData)
        // Find English translation (Sahih International)
        const englishTranslation = translationsData.find(
          (t) => t.language_name === "english" && t.name === "Sahih International",
        )
        setSelectedTranslation(englishTranslation || translationsData[0])
        setLoading((prev) => ({ ...prev, translations: false }))
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [])

  // Load verses when surah changes
  useEffect(() => {
    const loadVerses = async () => {
      if (!selectedSurah) return

      setLoading((prev) => ({ ...prev, verses: true }))
      setCurrentVerseIndex(0)
      setCurrentWordIndex(-1)
      setIsPlaying(false)

      try {
        const translationId = selectedTranslation?.id || 131 // Default to Dr. Mustafa Khattab
        const versesData = await getSurahVerses(selectedSurah.id, [translationId])
        setVerses(versesData)
      } catch (error) {
        console.error(`Error loading verses for surah ${selectedSurah.id}:`, error)
      } finally {
        setLoading((prev) => ({ ...prev, verses: false }))
      }
    }

    loadVerses()
  }, [selectedSurah, selectedTranslation])

  // Load tafsir when verse changes
  useEffect(() => {
    const loadTafsir = async () => {
      if (!verses.length || !showTafsir) return

      const currentVerse = verses[currentVerseIndex]
      setLoading((prev) => ({ ...prev, tafsir: true }))
      setTafsir("") // Reset tafsir when loading new one

      try {
        const tafsirText = await getTafsir(currentVerse.verse_key)
        setTafsir(tafsirText)
      } catch (error) {
        console.error(`Error fetching tafsir for verse ${currentVerse.verse_key}:`, error)
        // Set a fallback message instead of showing an error
        setTafsir("Tafsir could not be loaded. Please try again later.")
      } finally {
        setLoading((prev) => ({ ...prev, tafsir: false }))
      }
    }

    loadTafsir()
  }, [currentVerseIndex, verses, showTafsir])

  // Load audio when verse or reciter changes
  useEffect(() => {
    const loadAudio = async () => {
      if (!verses.length || !selectedReciter) return

      // Stop any current playback
      setIsPlaying(false)

      const currentVerse = verses[currentVerseIndex]
      setLoading((prev) => ({ ...prev, audio: true }))
      setAudioError(null)

      try {
        // Create a fallback URL based on verse key
        const [surah, ayah] = currentVerse.verse_key.split(":")
        const formattedSurah = surah.padStart(3, "0")
        const formattedAyah = ayah.padStart(3, "0")

        // Use a reliable fallback URL directly
        const audioUrl = `https://verses.quran.com/Alafasy/mp3/${formattedSurah}${formattedAyah}.mp3`
        console.log("Using audio URL:", audioUrl)

        // Set the audio source
        setAudioSrc(audioUrl)

        // Get word timings for highlighting
        if (highlightWords) {
          try {
            const timings = await getWordTimings(currentVerse.verse_key, selectedReciter.recitation_id)
            setWordTimings(timings)
          } catch (error) {
            console.warn(`Error fetching word timings for verse ${currentVerse.verse_key}:`, error)
            setWordTimings([])
          }
        }
      } catch (error) {
        console.error(`Error in audio loading process for verse ${currentVerse.verse_key}:`, error)
        setAudioError("Failed to load audio. Please try another verse or reciter.")
      } finally {
        setLoading((prev) => ({ ...prev, audio: false }))
      }
    }
    loadAudio()
  }, [currentVerseIndex, verses, selectedReciter, highlightWords])

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      // Check if we need to repeat
      if (currentRepeat < repeatCount - 1) {
        // Repeat the same verse
        setCurrentRepeat((prev) => prev + 1)
        audio.currentTime = 0

        // Use a small timeout to ensure the audio is ready to play again
        setTimeout(() => {
          audio.play().catch((error) => {
            console.error("Error replaying audio:", error)
            setIsPlaying(false)
          })
        }, 100)
      } else {
        // Move to next verse
        setCurrentRepeat(0)
        if (currentVerseIndex < verses.length - 1) {
          setCurrentVerseIndex((prev) => prev + 1)
        } else {
          setIsPlaying(false)
        }
      }
    }

    const handleError = (e: Event) => {
      console.error("Audio error event:", e)
      if (audio.error) {
        console.error("Audio error details:", {
          code: audio.error.code,
          message: audio.error.message,
        })
      }
      setIsPlaying(false)
      setAudioError("Error playing audio. Please try another verse or reciter.")
    }

    // Add event listeners
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    // Cleanup
    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [currentRepeat, repeatCount, currentVerseIndex, verses.length])

  // Handle play/pause state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.volume = volume / 100
      audio.playbackRate = playbackSpeed

      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
        setAudioError("Failed to play audio. Please try again.")
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, volume, playbackSpeed])

  // Word highlighting based on audio time
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isPlaying || !highlightWords || wordTimings.length === 0) {
      // Clear any existing interval
      if (wordIntervalRef.current) {
        clearInterval(wordIntervalRef.current)
        wordIntervalRef.current = null
      }
      setCurrentWordIndex(-1)
      return
    }

    // Set up interval to check audio time and highlight words
    wordIntervalRef.current = setInterval(() => {
      const currentTime = audio.currentTime * 1000 // Convert to milliseconds

      // Find the current word based on timing
      for (let i = 0; i < wordTimings.length; i++) {
        const [startTime, endTime] = wordTimings[i]
        if (currentTime >= startTime && currentTime <= endTime) {
          setCurrentWordIndex(i)
          break
        } else if (i === wordTimings.length - 1 || currentTime < wordTimings[0][0]) {
          setCurrentWordIndex(-1)
        }
      }
    }, 100)

    // Cleanup
    return () => {
      if (wordIntervalRef.current) {
        clearInterval(wordIntervalRef.current)
      }
    }
  }, [isPlaying, highlightWords, wordTimings])

  // Handlers
  const handleSurahChange = (value: string) => {
    const surah = surahs.find((s) => s.id.toString() === value)
    if (surah) {
      setSelectedSurah(surah)
    }
  }

  const handleReciterChange = (value: string) => {
    const reciter = reciters.find((r) => r.id.toString() === value)
    if (reciter) {
      setSelectedReciter(reciter)
      setIsPlaying(false)
    }
  }

  const handleTranslationChange = (value: string) => {
    const translation = translations.find((t) => t.id.toString() === value)
    if (translation) {
      setSelectedTranslation(translation)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      setCurrentVerseIndex((prev) => prev - 1)
      setCurrentRepeat(0)
    }
  }

  const handleNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      setCurrentVerseIndex((prev) => prev + 1)
      setCurrentRepeat(0)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  const handleSpeedChange = (value: string) => {
    const speed = Number.parseFloat(value)
    setPlaybackSpeed(speed)
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }

  const handleRepeatChange = (value: string) => {
    setRepeatCount(Number.parseInt(value))
    setCurrentRepeat(0)
  }

  const toggleTafsir = () => {
    setShowTafsir(!showTafsir)
  }

  const playSpecificVerse = (index: number) => {
    // If we're already on this verse, just toggle play/pause
    if (index === currentVerseIndex) {
      setIsPlaying(!isPlaying)
      return
    }

    // Otherwise, change to the new verse
    setIsPlaying(false)
    setCurrentVerseIndex(index)
    setCurrentRepeat(0)

    // Add a small delay to ensure state updates have completed
    setTimeout(() => {
      setIsPlaying(true)
    }, 500)
  }

  // Helper function to highlight Arabic text word by word
  const highlightArabicText = (text: string) => {
    if (!highlightWords || currentWordIndex === -1) {
      return <span>{text}</span>
    }

    const words = text.split(" ")
    return (
      <>
        {words.map((word, index) => (
          <span
            key={index}
            className={index === currentWordIndex ? "bg-emerald-200 dark:bg-emerald-700 px-1 rounded" : ""}
          >
            {word}{" "}
          </span>
        ))}
      </>
    )
  }

  // Get current verse
  const currentVerse = verses.length > 0 ? verses[currentVerseIndex] : null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <span>Quran Reader</span>
            {selectedSurah && (
              <span className="text-sm text-muted-foreground">
                {selectedSurah.english_name} ({selectedSurah.name})
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Select value={selectedSurah?.id.toString()} onValueChange={handleSurahChange} disabled={loading.surahs}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Surah" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {loading.surahs ? (
                  <div className="p-2">Loading surahs...</div>
                ) : (
                  surahs.map((surah) => (
                    <SelectItem key={surah.id} value={surah.id.toString()}>
                      {surah.english_name} ({surah.id})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select
              value={selectedReciter?.id.toString()}
              onValueChange={handleReciterChange}
              disabled={loading.reciters}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Reciter" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {loading.reciters ? (
                  <div className="p-2">Loading reciters...</div>
                ) : (
                  reciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id.toString()}>
                      {reciter.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          {loading.verses ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : verses.length === 0 ? (
            <div className="text-center py-8">
              <p>No verses found for this surah. Please try another surah.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">
                Surah {selectedSurah?.english_name} ({selectedSurah?.name})
              </h2>

              {audioError && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
                  {audioError}
                </div>
              )}

              {/* Audio element - visible for debugging */}
              {audioSrc ? (
                <audio ref={audioRef} src={audioSrc} className="w-full mb-4" controls={false} preload="auto" />
              ) : null}

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {verses.map((verse, index) => (
                    <div
                      key={verse.id}
                      ref={(el) => (verseRefs.current[index] = el)}
                      className={`bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg ${
                        currentVerseIndex === index ? "border-2 border-emerald-500" : ""
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                          {verse.verse_key}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playSpecificVerse(index)}
                          disabled={loading.audio && currentVerseIndex === index}
                        >
                          {loading.audio && currentVerseIndex === index ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : currentVerseIndex === index && isPlaying ? (
                            <Pause className="h-3 w-3 mr-1" />
                          ) : (
                            <Play className="h-3 w-3 mr-1" />
                          )}
                          {currentVerseIndex === index && isPlaying ? "Pause" : "Play"}
                        </Button>
                      </div>

                      <p className="text-right text-3xl leading-loose font-arabic mb-4">
                        {index === currentVerseIndex && isPlaying ? highlightArabicText(verse.text) : verse.text}
                      </p>

                      {verse.translations && verse.translations.length > 0 && (
                        <div className="mt-4">
                          <Tabs defaultValue="translation">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="translation">Translation</TabsTrigger>
                              <TabsTrigger value="transliteration">Transliteration</TabsTrigger>
                            </TabsList>
                            <TabsContent value="translation" className="mt-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">
                                  {selectedTranslation?.name || "Translation"}
                                </span>
                                <Select
                                  value={selectedTranslation?.id.toString()}
                                  onValueChange={handleTranslationChange}
                                  disabled={loading.translations}
                                >
                                  <SelectTrigger className="w-[150px] h-8 text-xs">
                                    <SelectValue placeholder="Select Translation" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px]">
                                    {loading.translations ? (
                                      <div className="p-2">Loading translations...</div>
                                    ) : (
                                      translations.map((translation) => (
                                        <SelectItem key={translation.id} value={translation.id.toString()}>
                                          {translation.name} ({translation.language_name})
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <p className="text-lg">{verse.translations[0].text}</p>
                            </TabsContent>
                            <TabsContent value="transliteration" className="mt-2">
                              <p className="text-lg italic">
                                {/* Transliteration would be available in a real API */}
                                {verse.verse_key === "1:1"
                                  ? "Bismillahir rahmanir raheem"
                                  : verse.verse_key === "1:2"
                                    ? "Alhamdu lillahi rabbil 'alamin"
                                    : verse.verse_key === "1:3"
                                      ? "Ar-Rahmanir Raheem"
                                      : verse.verse_key === "1:4"
                                        ? "Maliki yawmid deen"
                                        : verse.verse_key === "1:5"
                                          ? "Iyyaka na'budu wa iyyaka nasta'een"
                                          : verse.verse_key === "1:6"
                                            ? "Ihdinas siratal mustaqeem"
                                            : verse.verse_key === "1:7"
                                              ? "Siratal lazeena an'amta 'alaihim, ghairil maghdubi 'alaihim wa lad daalleen"
                                              : "Transliteration not available"}
                              </p>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}

                      {showTafsir && index === currentVerseIndex && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold mb-2">Tafsir (Commentary)</h4>
                          {loading.tafsir ? <Skeleton className="h-20 w-full" /> : <p>{tafsir}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-end mt-4 mb-4">
                <Button variant="outline" onClick={toggleTafsir}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
                </Button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider value={[volume]} max={100} step={1} className="w-24" onValueChange={handleVolumeChange} />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="ml-auto"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {showSettings ? "Hide Settings" : "Settings"}
                    {showSettings ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                  </Button>
                </div>

                {showSettings && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Speed:</span>
                      <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Repeat:</span>
                      <Select value={repeatCount.toString()} onValueChange={handleRepeatChange}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Repeat" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="3">3x</SelectItem>
                          <SelectItem value="5">5x</SelectItem>
                          <SelectItem value="10">10x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between col-span-1 md:col-span-3">
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-scroll" checked={autoScroll} onCheckedChange={setAutoScroll} />
                        <Label htmlFor="auto-scroll">Auto-scroll</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="highlight-words" checked={highlightWords} onCheckedChange={setHighlightWords} />
                        <Label htmlFor="highlight-words">Highlight words</Label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="icon" onClick={handlePrevVerse} disabled={currentVerseIndex === 0}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={handlePlayPause} disabled={loading.audio || verses.length === 0}>
                    {loading.audio ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {loading.audio ? "Loading..." : isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextVerse}
                    disabled={currentVerseIndex === verses.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {currentRepeat > 0 && repeatCount > 1 && (
                  <div className="mt-2 text-center">
                    <span className="text-xs text-muted-foreground">
                      Repeat: {currentRepeat + 1}/{repeatCount}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
