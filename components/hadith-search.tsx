"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, BookOpen, Filter, ChevronDown, ChevronUp, Loader2, X, Copy, Bookmark } from "lucide-react"
import { HADITH_BOOKS, searchHadiths, type Hadith, type HadithSearchResult } from "@/lib/hadith-data"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

export default function HadithSearch() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<HadithSearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [selectedBooks, setSelectedBooks] = useState<string[]>(HADITH_BOOKS.map((book) => book.id))
  const [language, setLanguage] = useState<"english" | "arabic" | "urdu">("english")
  const [currentPage, setCurrentPage] = useState(1)

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults(null)
    setError(null)
    setSelectedHadith(null)

    try {
      const results = await searchHadiths(searchQuery, selectedBooks, currentPage, 10, language)

      setSearchResults(results)

      if (results.total === 0) {
        setError("No results found. Try a different search term or adjust your filters.")
      }
    } catch (error) {
      console.error("Error searching hadiths:", error)
      setError("An error occurred while searching. Please try again later.")
    } finally {
      setIsSearching(false)
    }
  }

  // Handle page change
  const handlePageChange = async (page: number) => {
    if (page === currentPage) return

    setCurrentPage(page)
    setIsSearching(true)

    try {
      const results = await searchHadiths(searchQuery, selectedBooks, page, 10, language)

      setSearchResults(results)
    } catch (error) {
      console.error("Error changing page:", error)
      setError("An error occurred while changing page. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Handle book selection
  const handleBookSelect = (bookId: string) => {
    setSelectedBooks((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId)
      } else {
        return [...prev, bookId]
      }
    })
  }

  // Select all books
  const selectAllBooks = () => {
    setSelectedBooks(HADITH_BOOKS.map((book) => book.id))
  }

  // Clear all book selections
  const clearBookSelection = () => {
    setSelectedBooks([])
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
    setSelectedHadith(null)
  }

  // Copy hadith to clipboard
  const copyToClipboard = (hadith: Hadith) => {
    const textToCopy = `${hadith.reference}\n\n${hadith.arabic}\n\n${hadith.text}`
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Hadith copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  // Handle hadith selection
  const handleHadithSelect = (hadith: Hadith) => {
    setSelectedHadith(hadith)
  }

  // Effect to run search when language changes
  useEffect(() => {
    if (searchQuery && searchResults) {
      handleSearch()
    }
  }, [language])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-emerald-800 dark:text-emerald-300">Hadith Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search hadith..."
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
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={selectAllBooks}>
                      Select All
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearBookSelection}>
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Language</h4>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="lang-english"
                        name="language"
                        checked={language === "english"}
                        onChange={() => setLanguage("english")}
                      />
                      <Label htmlFor="lang-english">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="lang-arabic"
                        name="language"
                        checked={language === "arabic"}
                        onChange={() => setLanguage("arabic")}
                      />
                      <Label htmlFor="lang-arabic">Arabic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="lang-urdu"
                        name="language"
                        checked={language === "urdu"}
                        onChange={() => setLanguage("urdu")}
                      />
                      <Label htmlFor="lang-urdu">Urdu</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Books</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {HADITH_BOOKS.map((book) => (
                      <div key={book.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`book-${book.id}`}
                          checked={selectedBooks.includes(book.id)}
                          onCheckedChange={() => handleBookSelect(book.id)}
                        />
                        <Label htmlFor={`book-${book.id}`} className="text-sm">
                          {book.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">{error}</div>
            )}

            {isSearching ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : searchResults && searchResults.hadiths.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Search Results</h3>
                  <Badge variant="outline">{searchResults.total} results</Badge>
                </div>

                <Tabs defaultValue={language}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="english" onClick={() => setLanguage("english")}>
                      English
                    </TabsTrigger>
                    <TabsTrigger value="arabic" onClick={() => setLanguage("arabic")}>
                      Arabic
                    </TabsTrigger>
                    <TabsTrigger value="urdu" onClick={() => setLanguage("urdu")}>
                      Urdu
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="english" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {searchResults.hadiths.map((hadith) => (
                          <div
                            key={`${hadith.bookSlug}-${hadith.id}`}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleHadithSelect(hadith)}
                          >
                            <div className="flex justify-between mb-2">
                              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                                {hadith.reference}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(hadith)
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleHadithSelect(hadith)
                                  }}
                                >
                                  <BookOpen className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{hadith.text}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="arabic" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {searchResults.hadiths.map((hadith) => (
                          <div
                            key={`${hadith.bookSlug}-${hadith.id}-ar`}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleHadithSelect(hadith)}
                          >
                            <div className="flex justify-between mb-2">
                              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                                {hadith.reference}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(hadith)
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleHadithSelect(hadith)
                                  }}
                                >
                                  <BookOpen className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-right text-xl leading-loose font-arabic" dir="rtl">
                              {hadith.arabic || "Arabic text not available"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="urdu" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {searchResults.hadiths.map((hadith) => (
                          <div
                            key={`${hadith.bookSlug}-${hadith.id}-ur`}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleHadithSelect(hadith)}
                          >
                            <div className="flex justify-between mb-2">
                              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">
                                {hadith.reference}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(hadith)
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleHadithSelect(hadith)
                                  }}
                                >
                                  <BookOpen className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-right text-lg leading-loose" dir="rtl">
                              {hadith.urdu || "Urdu text not available"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                {searchResults.totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, searchResults.totalPages) }, (_, i) => {
                        let pageNumber: number

                        if (searchResults.totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= searchResults.totalPages - 2) {
                          pageNumber = searchResults.totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(searchResults.totalPages, currentPage + 1))}
                          className={currentPage === searchResults.totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            ) : searchQuery && !isSearching && !error ? (
              <div className="text-center py-8">
                <p>No results found. Try a different search term or adjust your filters.</p>
              </div>
            ) : null}

            {selectedHadith && (
              <div className="mt-8 border-t pt-4">
                <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg mb-4">
                  <div className="flex justify-between mb-4">
                    <div>
                      <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800 mb-2">
                        {selectedHadith.reference}
                      </Badge>
                      <h3 className="text-lg font-medium">
                        {HADITH_BOOKS.find((b) => b.id === selectedHadith.bookSlug)?.name || selectedHadith.bookName}
                      </h3>
                      {selectedHadith.chapterTitle && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Chapter: {selectedHadith.chapterTitle}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedHadith)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          // Add to bookmarks functionality could be added here
                          alert("Bookmark feature will be implemented soon")
                        }}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="arabic">Arabic</TabsTrigger>
                      <TabsTrigger value="english">English</TabsTrigger>
                      <TabsTrigger value="urdu">Urdu</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">Arabic</h4>
                        <p className="text-right text-2xl leading-loose font-arabic" dir="rtl">
                          {selectedHadith.arabic || "Arabic text not available"}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">English</h4>
                        <p className="text-lg">{selectedHadith.text || "English translation not available"}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">Urdu</h4>
                        <p className="text-right text-lg" dir="rtl">
                          {selectedHadith.urdu || "Urdu translation not available"}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="arabic" className="mt-4">
                      <p className="text-right text-2xl leading-loose font-arabic" dir="rtl">
                        {selectedHadith.arabic || "Arabic text not available"}
                      </p>
                    </TabsContent>

                    <TabsContent value="english" className="mt-4">
                      <p className="text-lg">{selectedHadith.text || "English translation not available"}</p>
                    </TabsContent>

                    <TabsContent value="urdu" className="mt-4">
                      <p className="text-right text-lg" dir="rtl">
                        {selectedHadith.urdu || "Urdu translation not available"}
                      </p>
                    </TabsContent>
                  </Tabs>

                  {selectedHadith.grade && (
                    <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
                      <p className="text-sm">
                        <span className="font-medium">Grade: </span>
                        {selectedHadith.grade}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-gray-500">Data sourced from AhmedBaset/hadith-json</p>
        </CardFooter>
      </Card>
    </div>
  )
}
