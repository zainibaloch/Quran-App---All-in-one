"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen } from "lucide-react"

// Sample search results
const sampleResults = [
  {
    surah: "Al-Baqarah",
    number: 2,
    verse: 255,
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ",
    translation:
      "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.",
    tafsir:
      "This is Ayat al-Kursi (The Verse of the Throne), considered one of the greatest verses in the Quran. It emphasizes Allah's attributes of self-subsistence, eternal vigilance, and absolute sovereignty over all creation.",
  },
  {
    surah: "Al-Ikhlas",
    number: 112,
    verse: 1,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: 'Say, "He is Allah, [who is] One,"',
    tafsir:
      "This verse establishes the absolute oneness of Allah (Tawhid), which is the foundation of Islamic monotheism. It refutes any notion of plurality within the divine nature.",
  },
  {
    surah: "Al-Fatiha",
    number: 1,
    verse: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    tafsir:
      "This verse is known as the Basmalah. It is recommended to begin all actions with this phrase. It acknowledges that everything we do is with the help of Allah, who is characterized by His abundant mercy to all creation (Ar-Rahman) and His specific mercy to the believers (Ar-Raheem).",
  },
]

export default function SearchQuran() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof sampleResults>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState("keyword")
  const [selectedResult, setSelectedResult] = useState<(typeof sampleResults)[0] | null>(null)
  const [showTafsir, setShowTafsir] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      setSearchResults(sampleResults)
      setIsSearching(false)
    }, 1000)
  }

  const handleResultClick = (result: (typeof sampleResults)[0]) => {
    setSelectedResult(result)
  }

  const toggleTafsir = () => {
    setShowTafsir(!showTafsir)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Quran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search the Quran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keyword">Keyword</SelectItem>
                <SelectItem value="surah">Surah</SelectItem>
                <SelectItem value="topic">Topic</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                "Searching..."
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {selectedResult ? (
            <div className="mt-6">
              <Button variant="outline" size="sm" className="mb-4" onClick={() => setSelectedResult(null)}>
                Back to Results
              </Button>

              <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4">
                <h3 className="font-medium mb-2">
                  Surah {selectedResult.surah} ({selectedResult.number}:{selectedResult.verse})
                </h3>
                <p className="text-right text-2xl leading-loose font-arabic mb-4">{selectedResult.arabic}</p>
                <p className="text-lg">{selectedResult.translation}</p>
              </div>

              {showTafsir && (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-4">
                  <h3 className="font-bold mb-2">Tafsir (Commentary)</h3>
                  <p>{selectedResult.tafsir}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={toggleTafsir}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {searchResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Search Results</h3>
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            Surah {result.surah} ({result.number}:{result.verse})
                          </span>
                          <Button variant="ghost" size="sm">
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {result.translation.length > 100
                            ? `${result.translation.substring(0, 100)}...`
                            : result.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
