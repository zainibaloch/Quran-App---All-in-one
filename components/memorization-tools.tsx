"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Play, Repeat, Eye } from "lucide-react"

// Sample Quran data for memorization
const memorizationData = {
  surah: "Al-Fatiha",
  verses: [
    {
      number: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      memorized: true,
    },
    {
      number: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "All praise is due to Allah, Lord of the worlds.",
      memorized: true,
    },
    {
      number: 3,
      arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "The Entirely Merciful, the Especially Merciful,",
      memorized: false,
    },
    {
      number: 4,
      arabic: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Sovereign of the Day of Recompense.",
      memorized: false,
    },
    {
      number: 5,
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation: "It is You we worship and You we ask for help.",
      memorized: false,
    },
    {
      number: 6,
      arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation: "Guide us to the straight path -",
      memorized: false,
    },
    {
      number: 7,
      arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translation:
        "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
      memorized: false,
    },
  ],
}

export default function MemorizationTools() {
  const [selectedSurah, setSelectedSurah] = useState("Al-Fatiha")
  const [hideArabic, setHideArabic] = useState(false)
  const [hideTranslation, setHideTranslation] = useState(false)
  const [repetitions, setRepetitions] = useState(3)
  const [currentVerse, setCurrentVerse] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [memorizationProgress, setMemorizationProgress] = useState(
    (memorizationData.verses.filter((v) => v.memorized).length / memorizationData.verses.length) * 100,
  )
  const [verses, setVerses] = useState(memorizationData.verses)
  const [activeTab, setActiveTab] = useState("practice")

  const toggleMemorized = (index: number) => {
    const updatedVerses = [...verses]
    updatedVerses[index].memorized = !updatedVerses[index].memorized
    setVerses(updatedVerses)

    // Update progress
    const memorizedCount = updatedVerses.filter((v) => v.memorized).length
    setMemorizationProgress((memorizedCount / updatedVerses.length) * 100)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control audio playback
  }

  const handleNextVerse = () => {
    setCurrentVerse((prev) => (prev < verses.length - 1 ? prev + 1 : prev))
  }

  const handlePrevVerse = () => {
    setCurrentVerse((prev) => (prev > 0 ? prev - 1 : 0))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Memorization Tools</span>
          <div className="flex items-center space-x-2">
            <Select value={selectedSurah} onValueChange={setSelectedSurah}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Surah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Al-Fatiha">Al-Fatiha</SelectItem>
                <SelectItem value="Al-Baqarah">Al-Baqarah</SelectItem>
                <SelectItem value="Al-Ikhlas">Al-Ikhlas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="practice">
            <div className="mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4">
                {!hideArabic && (
                  <p className="text-right text-3xl leading-loose font-arabic mb-4">{verses[currentVerse].arabic}</p>
                )}

                {!hideTranslation && <p className="text-lg">{verses[currentVerse].translation}</p>}

                {(hideArabic || hideTranslation) && (
                  <div className="flex justify-center my-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setHideArabic(false)
                        setHideTranslation(false)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Reveal All
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">
                  Verse {verses[currentVerse].number} of {verses.length}
                </span>
                <div className="flex items-center space-x-2">
                  <Repeat className="h-4 w-4" />
                  <span>Repeat {repetitions}x</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handlePrevVerse}>
                  Previous Verse
                </Button>
                <Button onClick={handlePlayPause}>
                  <Play className="h-4 w-4 mr-2" />
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button variant="outline" onClick={handleNextVerse}>
                  Next Verse
                </Button>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  variant={verses[currentVerse].memorized ? "default" : "outline"}
                  onClick={() => toggleMemorized(currentVerse)}
                >
                  <CheckCircle className={`h-4 w-4 mr-2 ${verses[currentVerse].memorized ? "" : "opacity-50"}`} />
                  {verses[currentVerse].memorized ? "Memorized" : "Mark as Memorized"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Memorization Progress</h3>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Surah {selectedSurah}</span>
                  <span>{Math.round(memorizationProgress)}%</span>
                </div>
                <Progress value={memorizationProgress} className="h-2" />
              </div>

              <div className="space-y-3 mt-6">
                {verses.map((verse, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      verse.memorized ? "bg-emerald-100 dark:bg-emerald-800" : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <span>Verse {verse.number}</span>
                    <Button variant="ghost" size="sm" onClick={() => toggleMemorized(index)}>
                      <CheckCircle
                        className={`h-4 w-4 mr-2 ${verse.memorized ? "text-emerald-600" : "text-gray-400"}`}
                      />
                      {verse.memorized ? "Memorized" : "Not Memorized"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-arabic">Hide Arabic Text</Label>
                  <p className="text-sm text-muted-foreground">Test your memorization by hiding the Arabic text</p>
                </div>
                <Switch id="hide-arabic" checked={hideArabic} onCheckedChange={setHideArabic} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-translation">Hide Translation</Label>
                  <p className="text-sm text-muted-foreground">Focus on the Arabic text by hiding the translation</p>
                </div>
                <Switch id="hide-translation" checked={hideTranslation} onCheckedChange={setHideTranslation} />
              </div>

              <div className="space-y-2">
                <Label>Repetition Count</Label>
                <Select
                  value={repetitions.toString()}
                  onValueChange={(value) => setRepetitions(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select repetitions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 time</SelectItem>
                    <SelectItem value="3">3 times</SelectItem>
                    <SelectItem value="5">5 times</SelectItem>
                    <SelectItem value="10">10 times</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h3 className="text-sm font-medium mb-2">Daily Goal</h3>
          <Progress value={40} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">2 of 5 verses memorized today</p>
        </div>
      </CardFooter>
    </Card>
  )
}
