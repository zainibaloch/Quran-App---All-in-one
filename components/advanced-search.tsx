"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  BookOpen,
  Play,
  Pause,
  BookMarked,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  StarOff,
  History,
  X,
  Loader2,
} from "lucide-react"
import {
  searchQuran,
  getAllSurahs,
  getVerseByKey,
  getVerseAudioUrl,
  getVerseTafsir,
  type QuranSurah,
  type QuranVerse,
  type SearchResult,
} from "@/lib/quran-data"

export default function AdvancedSearch() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState<string | null>(null)

  // Filter state
  const [surahs, setSurahs] = useState<QuranSurah[]>([])
  const [selectedSurahs, setSelectedSurahs] = useState<number[]>([])
  const [searchArabic, setSearchArabic] = useState(true)
  const [searchTranslation, setSearchTranslation] = useState(true)

  // Selected verse state
  const [selectedVerse, setSelectedVerse] = useState<QuranVerse | null>(null)
  const [showTafsir, setShowTafsir] = useState(false)
  const [tafsir, setTafsir] = useState("")
  const [isLoadingTafsir, setIsLoadingTafsir] = useState(false)

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSrc, setAudioSrc] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)

  // Active tab
  const [activeTab, setActiveTab] = useState("search")

  // Load surahs on component mount
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahsData = await getAllSurahs()
        setSurahs(surahsData)
      } catch (error) {
        console.error("Error loading surahs:", error)
      }

      // Load favorites and search history from localStorage
      const savedFavorites = localStorage.getItem("quran-favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }

      const savedHistory = localStorage.getItem("quran-search-history")
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory))
      }
    }

    loadSurahs()
  }, [])

  // Save favorites and search history to localStorage when they change
  useEffect(() => {
    localStorage.setItem("quran-favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("quran-search-history", JSON.stringify(searchHistory))
  }, [searchHistory])

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setIsPlaying(false)
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [])

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Load tafsir when a verse is selected and tafsir is shown
  useEffect(() => {
    const loadTafsir = async () => {
      if (!selectedVerse || !showTafsir) return

      setIsLoadingTafsir(true)
      try {
        const tafsirText = await getVerseTafsir(selectedVerse.verse_key)
        setTafsir(tafsirText)
      } catch (error) {
        console.error(`Error loading tafsir for verse ${selectedVerse.verse_key}:`, error)
        setTafsir("Failed to load tafsir. Please try again later.")
      } finally {
        setIsLoadingTafsir(false)
      }
    }

    loadTafsir()
  }, [selectedVerse, showTafsir])

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    try {
      const results = await searchQuran(searchQuery, {
        searchArabic,
        searchTranslation,
        surahFilter: selectedSurahs.length > 0 ? selectedSurahs : undefined,
        limit: 50,
      })

      setSearchResults(results)

      // Add to search history if not already present
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory((prev) => [searchQuery, ...prev].slice(0, 10))
      }
    } catch (error) {
      console.error("Error searching Quran:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle selecting a verse
  const handleVerseSelect = useCallback(async (verse: QuranVerse) => {
    setSelectedVerse(verse)
    setShowTafsir(false)
    setTafsir("")

    // Set audio source
    const audioUrl = getVerseAudioUrl(verse.verse_key)
    setAudioSrc(audioUrl)
    setIsPlaying(false)
  }, [])

  // Toggle favorite status
  const toggleFavorite = (verseKey: string) => {
    if (favorites.includes(verseKey)) {
      setFavorites((prev) => prev.filter((key) => key !== verseKey))
    } else {
      setFavorites((prev) => [...prev, verseKey])
    }
  }

  // Load a favorite verse
  const loadFavoriteVerse = async (verseKey: string) => {
    try {
      const verse = await getVerseByKey(verseKey)
      if (verse) {
        handleVerseSelect(verse)
      }
    } catch (error) {
      console.error(`Error loading favorite verse ${verseKey}:`, error)
    }
  }

  // Use a search from history
  const useHistorySearch = (query: string) => {
    setHistorySearchQuery(query)
  }

  useEffect(() => {
    if (historySearchQuery) {
      setSearchQuery(historySearchQuery)
      setSearchHistory((prev) =>
        [historySearchQuery, ...prev.filter((item) => item !== historySearchQuery)].slice(0, 10),
      )
      setHistorySearchQuery(null)
    }
  }, [historySearchQuery])

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([])
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Toggle tafsir
  const toggleTafsir = () => {
    setShowTafsir(!showTafsir)
  }

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Handle surah selection for filtering
  const handleSurahSelect = (surahNumber: string) => {
    const number = Number.parseInt(surahNumber, 10)
    if (selectedSurahs.includes(number)) {
      setSelectedSurahs((prev) => prev.filter((s) => s !== number))
    } else {
      setSelectedSurahs((prev) => [...prev, number])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedSurahs([])
    setSearchArabic(true)
    setSearchTranslation(true)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Quran Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search the Quran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pr-10"
                />
                {searchQuery && (
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={clearSearch}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={toggleFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </div>

            {showFilters && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Search Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Search In</h4>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-arabic"
                        checked={searchArabic}
                        onCheckedChange={(checked) => setSearchArabic(checked === true)}
                      />
                      <Label htmlFor="search-arabic">Arabic Text</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-translation"
                        checked={searchTranslation}
                        onCheckedChange={(checked) => setSearchTranslation(checked === true)}
                      />
                      <Label htmlFor="search-translation">English Translation</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Filter by Surah</h4>
                  <ScrollArea className="h-40">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {surahs.map((surah) => (
                        <div key={surah.number} className="flex items-center space-x-2">
                          <Checkbox
                            id={`surah-${surah.number}`}
                            checked={selectedSurahs.includes(surah.number)}
                            onCheckedChange={() => handleSurahSelect(surah.number.toString())}
                          />
                          <Label htmlFor={`surah-${surah.number}`} className="text-sm">
                            {surah.number}. {surah.name_latin}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}

            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Search Results</h3>
                  <Badge variant="outline">{searchResults.length} results</Badge>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <div
                        key={result.verse.verse_key}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleVerseSelect(result.verse)}
                      >
                        <div className="flex justify-between mb-2">
                          <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                            {result.verse.verse_key}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(result.verse.verse_key)
                              }}
                            >
                              {favorites.includes(result.verse.verse_key) ? (
                                <Star className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVerseSelect(result.verse)
                                togglePlayPause()
                              }}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {/* Arabic text with highlighting */}
                          <p className="text-right text-xl leading-loose font-arabic">
                            {result.highlights.text && result.highlights.text.length > 0
                              ? result.highlights.text.map((part, i) => (
                                  <span
                                    key={i}
                                    className={
                                      part === searchQuery && searchArabic ? "bg-yellow-200 dark:bg-yellow-800" : ""
                                    }
                                  >
                                    {part}
                                  </span>
                                ))
                              : result.verse.text}
                          </p>

                          {/* Translation with highlighting */}
                          <p className="text-gray-700 dark:text-gray-300">
                            {result.highlights.translation && result.highlights.translation.length > 0
                              ? result.highlights.translation.map((part, i) => (
                                  <span
                                    key={i}
                                    className={
                                      part.toLowerCase() === searchQuery.toLowerCase() && searchTranslation
                                        ? "bg-yellow-200 dark:bg-yellow-800"
                                        : ""
                                    }
                                  >
                                    {part}
                                  </span>
                                ))
                              : result.verse.translation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : searchQuery && !isSearching ? (
              <div className="text-center py-8">
                <p>No results found. Try a different search term or adjust your filters.</p>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="favorites">
            {favorites.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {favorites.map((verseKey) => (
                    <div
                      key={verseKey}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => loadFavoriteVerse(verseKey)}
                    >
                      <div className="flex justify-between mb-2">
                        <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                          {verseKey}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(verseKey)
                          }}
                        >
                          <Star className="h-4 w-4 text-yellow-500" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Click to load verse</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <p>No favorites yet. Star verses to add them to your favorites.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {searchHistory.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Search History</h3>
                  <Button variant="outline" size="sm" onClick={clearSearchHistory}>
                    Clear History
                  </Button>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {searchHistory.map((query, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          setSearchQuery(query)
                          setSearchHistory((prev) => [query, ...prev.filter((item) => item !== query)].slice(0, 10))
                        }}
                      >
                        <div className="flex items-center">
                          <History className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{query}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSearchHistory((prev) => prev.filter((_, i) => i !== index))
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No search history yet. Search for verses to build your history.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedVerse && (
          <div className="mt-8 border-t pt-4">
            <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4">
              <div className="flex justify-between mb-4">
                <div>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800 mb-2">
                    {selectedVerse.verse_key}
                  </Badge>
                  <h3 className="text-lg font-medium">
                    Surah{" "}
                    {surahs.find((s) => s.number === selectedVerse.surah_number)?.name_latin ||
                      selectedVerse.surah_number}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => toggleFavorite(selectedVerse.verse_key)}>
                    {favorites.includes(selectedVerse.verse_key) ? (
                      <Star className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant={isPlaying ? "default" : "outline"} size="icon" onClick={togglePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <p className="text-right text-3xl leading-loose font-arabic mb-4">{selectedVerse.text}</p>

              <p className="text-lg">{selectedVerse.translation}</p>

              {selectedVerse.transliteration && (
                <p className="text-gray-600 dark:text-gray-400 mt-2 italic">{selectedVerse.transliteration}</p>
              )}

              {/* Word by word display if available */}
              {selectedVerse.words && selectedVerse.words.length > 0 && (
                <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-700">
                  <h4 className="text-sm font-medium mb-2">Word by Word</h4>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {selectedVerse.words.map((word, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xl font-arabic">{word.text}</p>
                        <p className="text-xs">{word.translation || word.transliteration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={toggleTafsir}>
                <BookOpen className="h-4 w-4 mr-2" />
                {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
              </Button>

              <audio ref={audioRef} src={audioSrc} className="hidden" />
            </div>

            {showTafsir && (
              <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center">
                  <BookMarked className="h-4 w-4 mr-2" />
                  Tafsir (Commentary)
                </h4>
                {isLoadingTafsir ? <Skeleton className="h-20 w-full" /> : <p>{tafsir}</p>}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">Using local Quran data</p>
      </CardFooter>
    </Card>
  )
}
