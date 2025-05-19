// Types for Hadith data
export interface Hadith {
  id: string
  bookSlug: string
  bookName: string
  chapterId: string
  chapterTitle: string
  urn: string
  arabic: string
  text: string
  urdu?: string
  grade?: string
  reference: string
}

export interface HadithSearchResult {
  hadiths: Hadith[]
  total: number
  page: number
  totalPages: number
}

// Books available for search
export const HADITH_BOOKS = [
  { id: "bukhari", name: "Sahih al-Bukhari", arabicName: "صحيح البخاري" },
  { id: "muslim", name: "Sahih Muslim", arabicName: "صحيح مسلم" },
  { id: "tirmidhi", name: "Jami` at-Tirmidhi", arabicName: "جامع الترمذي" },
  { id: "abudawud", name: "Sunan Abi Dawud", arabicName: "سنن أبي داود" },
  { id: "ibnmajah", name: "Sunan Ibn Majah", arabicName: "سنن ابن ماجه" },
  { id: "malik", name: "Muwatta Malik", arabicName: "موطأ مالك" },
]

// Cache for hadith data
const hadithCache: Record<string, any> = {}

/**
 * Fetch hadith data from GitHub
 */
export async function fetchHadithData(bookId: string): Promise<any> {
  // Check cache first
  if (hadithCache[bookId]) {
    return hadithCache[bookId]
  }

  try {
    const url = `https://raw.githubusercontent.com/AhmedBaset/hadith-json/main/db/by_book/the_9_books/${bookId}.json`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data = await response.json()
    hadithCache[bookId] = data
    return data
  } catch (error) {
    console.error(`Error fetching ${bookId}:`, error)
    throw error
  }
}

/**
 * Search for hadiths across selected books
 */
export async function searchHadiths(
  query: string,
  selectedBooks: string[] = HADITH_BOOKS.map((book) => book.id),
  page = 1,
  limit = 10,
  language: "english" | "arabic" | "urdu" = "english",
): Promise<HadithSearchResult> {
  try {
    // Fetch data from all selected books
    const booksData = await Promise.all(selectedBooks.map((bookId) => fetchHadithData(bookId)))

    // Combine all hadiths from selected books
    let allHadiths: Hadith[] = []

    booksData.forEach((bookData, index) => {
      const bookId = selectedBooks[index]
      const bookInfo = HADITH_BOOKS.find((b) => b.id === bookId)

      if (bookData && bookData.hadiths) {
        const bookHadiths = bookData.hadiths.map((h: any) => ({
          id: h.id || `${bookId}-${h.hadithNumber}`,
          bookSlug: bookId,
          bookName: bookInfo?.name || bookId,
          chapterId: h.chapterId || "",
          chapterTitle: h.chapterTitle || "",
          urn: h.urn || `urn:hadith:${bookId}:${h.hadithNumber}`,
          arabic: h.arabic || "",
          text: h.text || "",
          urdu: h.urdu || "",
          grade: h.grade || "",
          reference: `${bookInfo?.name || bookId} ${h.hadithNumber || ""}`,
        }))

        allHadiths = [...allHadiths, ...bookHadiths]
      }
    })

    // Perform search
    const lowerQuery = query.toLowerCase()

    // Simple semantic search (could be enhanced with more sophisticated algorithms)
    const searchTerms = lowerQuery.split(/\s+/).filter((term) => term.length > 2)

    const results = allHadiths.filter((hadith) => {
      const searchText = language === "arabic" ? hadith.arabic : language === "urdu" ? hadith.urdu || "" : hadith.text

      const lowerText = searchText.toLowerCase()

      // Exact match
      if (lowerText.includes(lowerQuery)) {
        return true
      }

      // Semantic match (if any search term is found)
      return searchTerms.some((term) => lowerText.includes(term))
    })

    // Calculate pagination
    const total = results.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = results.slice(startIndex, endIndex)

    return {
      hadiths: paginatedResults,
      total,
      page,
      totalPages,
    }
  } catch (error) {
    console.error("Error in searchHadiths:", error)
    return {
      hadiths: [],
      total: 0,
      page: 1,
      totalPages: 0,
    }
  }
}

/**
 * Get a specific hadith by ID and book
 */
export async function getHadithById(bookId: string, hadithId: string): Promise<Hadith | null> {
  try {
    const bookData = await fetchHadithData(bookId)
    const bookInfo = HADITH_BOOKS.find((b) => b.id === bookId)

    if (bookData && bookData.hadiths) {
      const hadith = bookData.hadiths.find((h: any) => h.id === hadithId || h.hadithNumber === hadithId)

      if (hadith) {
        return {
          id: hadith.id || `${bookId}-${hadith.hadithNumber}`,
          bookSlug: bookId,
          bookName: bookInfo?.name || bookId,
          chapterId: hadith.chapterId || "",
          chapterTitle: hadith.chapterTitle || "",
          urn: hadith.urn || `urn:hadith:${bookId}:${hadith.hadithNumber}`,
          arabic: hadith.arabic || "",
          text: hadith.text || "",
          urdu: hadith.urdu || "",
          grade: hadith.grade || "",
          reference: `${bookInfo?.name || bookId} ${hadith.hadithNumber || ""}`,
        }
      }
    }

    return null
  } catch (error) {
    console.error(`Error getting hadith ${hadithId} from ${bookId}:`, error)
    return null
  }
}
