"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Square, RotateCcw, CheckCircle, XCircle, AlertCircle, Info, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSurahs, getSurahVerses } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Tajweed rules for learning section
const tajweedRules = [
  {
    name: "Idgham",
    description: "Merging of a non-voweled letter into another",
    examples: ["نْ م", "نْ و", "نْ ي", "نْ ر", "نْ ل"],
    details:
      "When noon saakin (ن) or tanween is followed by certain letters, the noon sound merges into the following letter.",
  },
  {
    name: "Ikhfa",
    description: "Partial pronunciation of noon sakinah or tanween",
    examples: ["نْ ت", "نْ ث", "نْ ج", "نْ د", "نْ ذ"],
    details:
      "When noon saakin (ن) or tanween is followed by certain letters, the noon is pronounced with a nasal sound.",
  },
  {
    name: "Qalqalah",
    description: "Vibration in the sound of certain letters",
    examples: ["ق", "ط", "ب", "ج", "د"],
    details:
      "When any of these five letters appears with a sukoon, it should be pronounced with a slight bounce or echo.",
  },
  {
    name: "Madd",
    description: "Elongation of certain letters",
    examples: ["آ", "وْ", "يْ"],
    details:
      "The natural madd is held for 2 counts. Other types of madd may be held for 2, 4, or 6 counts depending on the rule.",
  },
  {
    name: "Ghunnah",
    description: "Nasalization of certain letters",
    examples: ["نّ", "مّ"],
    details: "When noon or meem has a shaddah, it should be pronounced with a nasal sound held for 2 counts.",
  },
]

export default function RecitationAnalyzer() {
  // State for Quran data
  const [surahs, setSurahs] = useState<any[]>([])
  const [selectedSurah, setSelectedSurah] = useState<any>(null)
  const [verses, setVerses] = useState<any[]>([])
  const [selectedVerse, setSelectedVerse] = useState<any>(null)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [micPermission, setMicPermission] = useState<boolean | null>(null)
  const [volume, setVolume] = useState([50])
  const [feedback, setFeedback] = useState<any[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [activeTab, setActiveTab] = useState("record")
  const [loading, setLoading] = useState({
    surahs: true,
    verses: false,
  })

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioStreamRef = useRef<MediaStream | null>(null)

  // Load surahs on component mount
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahsData = await getSurahs()
        setSurahs(surahsData)
        setSelectedSurah(surahsData[0]) // Default to Al-Fatiha
      } catch (error) {
        console.error("Error loading surahs:", error)
      } finally {
        setLoading((prev) => ({ ...prev, surahs: false }))
      }
    }

    loadSurahs()
  }, [])

  // Load verses when surah changes
  useEffect(() => {
    const loadVerses = async () => {
      if (!selectedSurah) return

      setLoading((prev) => ({ ...prev, verses: true }))

      try {
        const versesData = await getSurahVerses(selectedSurah.id)
        setVerses(versesData)
        setSelectedVerse(versesData[0]) // Default to first verse
      } catch (error) {
        console.error(`Error loading verses for surah ${selectedSurah.id}:`, error)
      } finally {
        setLoading((prev) => ({ ...prev, verses: false }))
      }
    }

    loadVerses()
  }, [selectedSurah])

  // Check for microphone permission
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMicPermission(true)
        // Stop the stream immediately after permission check
        stream.getTracks().forEach((track) => track.stop())
      })
      .catch(() => {
        setMicPermission(false)
      })
  }, [])

  // Clean up audio stream when component unmounts
  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleSurahChange = (value: string) => {
    const surah = surahs.find((s) => s.id.toString() === value)
    if (surah) {
      setSelectedSurah(surah)
      resetRecording()
    }
  }

  const handleVerseChange = (value: string) => {
    const verse = verses.find((v) => v.verse_key === value)
    if (verse) {
      setSelectedVerse(verse)
      resetRecording()
    }
  }

  const startRecording = async () => {
    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream

      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(audioBlob)
        }
        setHasRecorded(true)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setMicPermission(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all tracks on the stream
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const analyzeRecitation = async () => {
    if (!selectedVerse || !hasRecorded) return

    setIsAnalyzing(true)

    try {
      // Get the audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })

      // Send to API for analysis
      const result = await analyzeRecitation(audioBlob, selectedVerse.verse_key)

      // Update state with results
      setFeedback(result.feedback)
      setOverallScore(result.overall_score)
      setAnalysisComplete(true)
      setActiveTab("feedback")
    } catch (error) {
      console.error("Error analyzing recitation:", error)
      // Show error message to user
      setFeedback([
        {
          type: "error",
          rule: "System Error",
          word: "",
          feedback: "There was an error analyzing your recitation. Please try again.",
          timeStamp: "",
        },
      ])
      setOverallScore(0)
      setAnalysisComplete(true)
      setActiveTab("feedback")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetRecording = () => {
    setHasRecorded(false)
    setAnalysisComplete(false)
    setFeedback([])
    setOverallScore(0)
    setActiveTab("record")

    if (audioRef.current) {
      audioRef.current.src = ""
    }

    // Stop any ongoing recording
    if (isRecording && mediaRecorderRef.current) {
      stopRecording()
    }

    // Clear audio chunks
    audioChunksRef.current = []
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span>AI Recitation Analyzer</span>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Select
              value={selectedSurah?.id.toString()}
              onValueChange={handleSurahChange}
              disabled={loading.surahs || isRecording}
            >
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
              value={selectedVerse?.verse_key}
              onValueChange={handleVerseChange}
              disabled={loading.verses || isRecording}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Verse" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {loading.verses ? (
                  <div className="p-2">Loading verses...</div>
                ) : (
                  verses.map((verse) => (
                    <SelectItem key={verse.verse_key} value={verse.verse_key}>
                      Verse {verse.verse_number}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="feedback" disabled={!analysisComplete}>
              Feedback
            </TabsTrigger>
            <TabsTrigger value="learn">Learn Tajweed</TabsTrigger>
          </TabsList>

          <TabsContent value="record">
            <div className="mb-6">
              {loading.verses ? (
                <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4">
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : selectedVerse ? (
                <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                      {selectedVerse.verse_key}
                    </Badge>
                  </div>
                  <p className="text-right text-3xl leading-loose font-arabic mb-4">{selectedVerse.text}</p>
                  {selectedVerse.translations && selectedVerse.translations.length > 0 && (
                    <p className="text-lg">{selectedVerse.translations[0].text}</p>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4 text-center">
                  <p>No verse selected. Please select a surah and verse.</p>
                </div>
              )}

              {micPermission === false && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Microphone Access Required</AlertTitle>
                  <AlertDescription>Please allow microphone access to use the recitation analyzer.</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center space-y-4 flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center mb-4">
                  {isRecording ? (
                    <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                      <MicOff className="h-8 w-8 text-white" />
                    </div>
                  ) : (
                    <Mic className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                  )}
                </div>

                <div className="flex space-x-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      disabled={micPermission === false || isAnalyzing || !selectedVerse}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive">
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}

                  {hasRecorded && (
                    <Button onClick={resetRecording} variant="outline" disabled={isAnalyzing}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>

                {hasRecorded && (
                  <div className="w-full mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Playback:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Volume: {volume}%</span>
                      </div>
                    </div>

                    <audio ref={audioRef} controls className="w-full mb-4" />

                    <Slider value={volume} max={100} step={1} className="mb-6" onValueChange={setVolume} />

                    <Button onClick={analyzeRecitation} className="w-full" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>Analyze Recitation</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-4">Recitation Analysis</h3>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Overall Score:</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-emerald-600">{overallScore}%</span>
                  </div>
                </div>

                <Progress value={overallScore} className="h-2 mb-6" />

                <h4 className="font-medium mb-2">Detailed Feedback:</h4>
                <div className="space-y-4">
                  {feedback.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        item.type === "success"
                          ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                          : item.type === "error"
                            ? "border-red-200 bg-red-50 dark:bg-red-900/20"
                            : "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">{getFeedbackIcon(item.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{item.rule}</span>
                            <span className="text-sm text-gray-500">{item.timeStamp}</span>
                          </div>
                          <p className="text-lg font-arabic mb-2 text-right">{item.word}</p>
                          <p>{item.feedback}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={resetRecording}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => setActiveTab("learn")}>Learn Tajweed Rules</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learn">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Tajweed Rules</h3>

              <div className="space-y-4">
                {tajweedRules.map((rule, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-1">{rule.name}</h4>
                    <p className="mb-2">{rule.description}</p>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">Examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {rule.examples.map((example, i) => (
                          <Badge key={i} variant="outline" className="font-arabic text-base">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{rule.details}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900 rounded-lg">
                <h4 className="font-medium mb-2">Practice Tips</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Listen to expert reciters and try to mimic their pronunciation</li>
                  <li>Record yourself and compare with professional recitations</li>
                  <li>Practice regularly, even if just for a few minutes each day</li>
                  <li>Focus on one rule at a time until you master it</li>
                  <li>Join a Quran study group for feedback and motivation</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
