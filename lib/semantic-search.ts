// Semantic search utilities for Quran data

import type { QuranVerse } from "./quran-data"

// GitHub raw content URLs
const GITHUB_URLS = {
  UTHMANI_TEXT: "https://raw.githubusercontent.com/hablullah/data-quran/master/ayah-text/uthmani-tanzil.md",
  EN_TRANSLATION: "https://raw.githubusercontent.com/hablullah/data-quran/master/ayah-translation/en-sahih-tanzil.md",
  UR_TRANSLATION: "https://raw.githubusercontent.com/hablullah/data-quran/master/ayah-translation/ur-qadri-tanzil.md",
  SURAH_INFO: "https://raw.githubusercontent.com/hablullah/data-quran/master/surah-info/ur-qurancom.md",
}

// Cache for fetched data
const dataCache: Record<string, string> = {}

/**
 * Fetch data from GitHub
 */
export async function fetchGitHubData(dataType: keyof typeof GITHUB_URLS): Promise<string> {
  // Check cache first
  if (dataCache[dataType]) {
    return dataCache[dataType]
  }

  try {
    const url = GITHUB_URLS[dataType]
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data = await response.text()
    dataCache[dataType] = data
    return data
  } catch (error) {
    console.error(`Error fetching ${dataType}:`, error)
    throw error
  }
}

/**
 * Extract surah information from markdown data
 */
export function extractSurahInfo(data: string, surahNumber: number): string[] {
  const lines = data.split("\n")
  const results: string[] = []
  let capture = false
  const headerPattern = /^#\s*(\d+)/

  for (const line of lines) {
    const lineStripped = line.trim()
    if (lineStripped.startsWith("#")) {
      const match = headerPattern.exec(lineStripped)
      if (match) {
        const num = match[1]
        if (Number.parseInt(num) === surahNumber) {
          capture = true
          results.push(lineStripped)
          continue
        } else if (capture) {
          // We've already captured our surah and now hit the next surah header
          break
        }
      }
    } else if (capture) {
      results.push(line)
    }
  }

  return results
}

/**
 * Simple text-based search (fallback when semantic search is not available)
 */
export function textSearch(data: string, query: string, topK = 5): string[] {
  const lines = data.split("\n").filter((line) => line.trim() !== "")

  // Score each line based on how many times the query appears
  const scoredLines = lines.map((line) => {
    const lowerLine = line.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const count = (lowerLine.match(new RegExp(lowerQuery, "g")) || []).length
    return { line, score: count }
  })

  // Sort by score and take top K
  return scoredLines
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.line)
}

/**
 * Parse search results into QuranVerse objects
 */
export function parseSearchResults(results: string[]): QuranVerse[] {
  return results
    .map((line) => {
      // Example line format: "1:1 | بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
      const parts = line.split("|").map((part) => part.trim())
      const verseKey = parts[0]
      const [surahNumber, verseNumber] = verseKey.split(":").map(Number)

      return {
        surah_number: surahNumber,
        verse_number: verseNumber,
        verse_key: verseKey,
        text: parts[1] || "",
        translation: parts[2] || "",
      }
    })
    .filter((verse) => !isNaN(verse.surah_number) && !isNaN(verse.verse_number))
}

/**
 * Main search function that combines fetching and searching
 */
export async function searchQuranData(
  dataType: keyof typeof GITHUB_URLS,
  query: string,
  topK = 5,
): Promise<QuranVerse[]> {
  try {
    const data = await fetchGitHubData(dataType)
    const results = textSearch(data, query, topK)
    return parseSearchResults(results)
  } catch (error) {
    console.error("Error in searchQuranData:", error)
    return []
  }
}

/**
 * Get detailed information about a surah
 */
export async function getSurahDetailedInfo(surahNumber: number): Promise<string> {
  try {
    const data = await fetchGitHubData("SURAH_INFO")
    const info = extractSurahInfo(data, surahNumber)
    return info.join("\n")
  } catch (error) {
    console.error(`Error getting surah info for ${surahNumber}:`, error)
    return ""
  }
}
