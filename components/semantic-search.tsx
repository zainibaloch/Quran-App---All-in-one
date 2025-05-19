"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, AlertCircle, Loader2, Globe, BookMarked, Info } from "lucide-react"
import { searchQuranData, getSurahDetailedInfo } from "@/lib/semantic-search"
import type { QuranVerse } from "@/lib/quran-data"

export default function SemanticSearch() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<QuranVerse[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Surah info state
  const [surahNumber, setSurahNumber] = useState<string>("1")
  const [surahInfo, setSurahInfo] = useState<string>("")
  const [isLoadingSurahInfo, setIsLoadingSurahInfo] = useState(false)

  // Data source state
  const [dataSource, setDataSource] = useState<string>("EN_TRANSLATION")

  // Active tab
  const [activeTab, setActiveTab] = useState("semantic")

  // Load surah info when surah number changes
  useEffect(() => {
    const loadSurahInfo = async () => {
      if (!surahNumber) return

      setIsLoadingSurahInfo(true)
      try {
        const info = await getSurahDetailedInfo(Number.parseInt(surahNumber))
        setSurahInfo(info || "No detailed information available for this surah.")
      } catch (error) {
        console.error("Error loading surah info:", error)
        setSurahInfo("Failed to load surah information. Please try again.")
      } finally {
        setIsLoadingSurahInfo(false)
      }
    }

    loadSurahInfo()
  }, [surahNumber])

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setSearchResults([])

    try {
      const results = await searchQuranData(dataSource as keyof typeof dataSourceOptions, searchQuery, 10)

      setSearchResults(results)

      if (results.length === 0) {
        setSearchError("No results found. Try a different search term or data source.")
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchError("An error occurred while searching. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  // Data source options
  const dataSourceOptions = {
    UTHMANI_TEXT: "Arabic (Uthmani Text)",
    EN_TRANSLATION: "English Translation (Sahih)",
    UR_TRANSLATION: "Urdu Translation (Qadri)",
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Semantic Quran Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
            <TabsTrigger value="surah">Surah Information</TabsTrigger>
          </TabsList>

          <TabsContent value="semantic" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search the Quran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <Select value={dataSource} onValueChange={setDataSource}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dataSourceOptions).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
            </div>

            {searchError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Search Error</AlertTitle>
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Search Results</h3>
                  <Badge variant="outline">{searchResults.length} results</Badge>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {searchResults.map((result, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                            {result.verse_key}
                          </Badge>
                        </div>

                        {result.text && (
                          <p className="text-right text-xl leading-loose font-arabic mb-2">{result.text}</p>
                        )}

                        {result.translation && <p className="text-gray-700 dark:text-gray-300">{result.translation}</p>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="surah" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-[300px]">
                <Select value={surahNumber} onValueChange={setSurahNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Surah" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Array.from({ length: 114 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Surah {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <BookMarked className="h-5 w-5 mr-2 text-emerald-600" />
                <h3 className="text-lg font-medium">Surah Information</h3>
              </div>

              {isLoadingSurahInfo ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="whitespace-pre-line">
                  {surahInfo || (
                    <div className="text-center py-4 text-gray-500">
                      <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Select a surah to view information</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">Data sourced from hablullah/data-quran</p>
        <div className="flex items-center">
          <Globe className="h-3 w-3 mr-1 text-gray-500" />
          <span className="text-xs text-gray-500">GitHub Repository</span>
        </div>
      </CardFooter>
    </Card>
  )
}
