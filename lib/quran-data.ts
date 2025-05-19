// Quran data utilities with local data instead of fetching from GitHub

// Types for Quran data
export interface QuranSurah {
  number: number
  name: string
  name_latin: string
  name_translation: string
  revelation_type: string
  verse_count: number
}

export interface QuranVerse {
  surah_number: number
  verse_number: number
  verse_key: string
  text: string
  translation: string
  transliteration?: string
  words?: QuranWord[]
  audio_url?: string
  tafsir?: string
  sajdah?: boolean
  juz?: number
  page?: number
  ruku?: number
  manzil?: number
}

export interface QuranWord {
  position: number
  text: string
  translation?: string
  transliteration?: string
  audio_url?: string
  timing?: [number, number]
}

export interface SearchResult {
  verse: QuranVerse
  matchType: "text" | "translation" | "both"
  matchScore: number
  highlights: {
    text?: string[]
    translation?: string[]
  }
}

// Cache for loaded data
const dataCache: {
  surahs?: QuranSurah[]
  verses?: Record<string, QuranVerse[]>
} = {}

// Local data for all surahs
const LOCAL_SURAHS: QuranSurah[] = [
  {
    number: 1,
    name: "الفاتحة",
    name_latin: "Al-Fatihah",
    name_translation: "The Opening",
    revelation_type: "Meccan",
    verse_count: 7,
  },
  {
    number: 2,
    name: "البقرة",
    name_latin: "Al-Baqarah",
    name_translation: "The Cow",
    revelation_type: "Medinan",
    verse_count: 286,
  },
  {
    number: 3,
    name: "آل عمران",
    name_latin: "Ali 'Imran",
    name_translation: "Family of Imran",
    revelation_type: "Medinan",
    verse_count: 200,
  },
  {
    number: 4,
    name: "النساء",
    name_latin: "An-Nisa",
    name_translation: "The Women",
    revelation_type: "Medinan",
    verse_count: 176,
  },
  {
    number: 5,
    name: "المائدة",
    name_latin: "Al-Ma'idah",
    name_translation: "The Table Spread",
    revelation_type: "Medinan",
    verse_count: 120,
  },
  {
    number: 6,
    name: "الأنعام",
    name_latin: "Al-An'am",
    name_translation: "The Cattle",
    revelation_type: "Meccan",
    verse_count: 165,
  },
  {
    number: 7,
    name: "الأعراف",
    name_latin: "Al-A'raf",
    name_translation: "The Heights",
    revelation_type: "Meccan",
    verse_count: 206,
  },
  {
    number: 8,
    name: "الأنفال",
    name_latin: "Al-Anfal",
    name_translation: "The Spoils of War",
    revelation_type: "Medinan",
    verse_count: 75,
  },
  {
    number: 9,
    name: "التوبة",
    name_latin: "At-Tawbah",
    name_translation: "The Repentance",
    revelation_type: "Medinan",
    verse_count: 129,
  },
  {
    number: 10,
    name: "يونس",
    name_latin: "Yunus",
    name_translation: "Jonah",
    revelation_type: "Meccan",
    verse_count: 109,
  },
  {
    number: 36,
    name: "يس",
    name_latin: "Ya-Sin",
    name_translation: "Ya Sin",
    revelation_type: "Meccan",
    verse_count: 83,
  },
  {
    number: 55,
    name: "الرحمن",
    name_latin: "Ar-Rahman",
    name_translation: "The Beneficent",
    revelation_type: "Medinan",
    verse_count: 78,
  },
  {
    number: 56,
    name: "الواقعة",
    name_latin: "Al-Waqi'ah",
    name_translation: "The Inevitable",
    revelation_type: "Meccan",
    verse_count: 96,
  },
  {
    number: 67,
    name: "الملك",
    name_latin: "Al-Mulk",
    name_translation: "The Sovereignty",
    revelation_type: "Meccan",
    verse_count: 30,
  },
  {
    number: 112,
    name: "الإخلاص",
    name_latin: "Al-Ikhlas",
    name_translation: "Sincerity",
    revelation_type: "Meccan",
    verse_count: 4,
  },
  {
    number: 113,
    name: "الفلق",
    name_latin: "Al-Falaq",
    name_translation: "The Daybreak",
    revelation_type: "Meccan",
    verse_count: 5,
  },
  {
    number: 114,
    name: "الناس",
    name_latin: "An-Nas",
    name_translation: "Mankind",
    revelation_type: "Meccan",
    verse_count: 6,
  },
]

// Local data for Al-Fatiha verses
const AL_FATIHA_VERSES: QuranVerse[] = [
  {
    surah_number: 1,
    verse_number: 1,
    verse_key: "1:1",
    text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    transliteration: "Bismillahir rahmanir raheem",
  },
  {
    surah_number: 1,
    verse_number: 2,
    verse_key: "1:2",
    text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
    translation: "All praise is due to Allah, Lord of the worlds.",
    transliteration: "Alhamdu lillahi rabbil alamin",
  },
  {
    surah_number: 1,
    verse_number: 3,
    verse_key: "1:3",
    text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    translation: "The Entirely Merciful, the Especially Merciful,",
    transliteration: "Ar-Rahmanir Raheem",
  },
  {
    surah_number: 1,
    verse_number: 4,
    verse_key: "1:4",
    text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
    translation: "Sovereign of the Day of Recompense.",
    transliteration: "Maliki yawmid deen",
  },
  {
    surah_number: 1,
    verse_number: 5,
    verse_key: "1:5",
    text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translation: "It is You we worship and You we ask for help.",
    transliteration: "Iyyaka nabudu wa iyyaka nastaeen",
  },
  {
    surah_number: 1,
    verse_number: 6,
    verse_key: "1:6",
    text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    translation: "Guide us to the straight path -",
    transliteration: "Ihdinas siratal mustaqeem",
  },
  {
    surah_number: 1,
    verse_number: 7,
    verse_key: "1:7",
    text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    translation:
      "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.",
    transliteration: "Siratal lazeena anamta alaihim, ghairil maghdubi alaihim wa lad daalleen",
  },
]

// Local data for Al-Ikhlas verses
const AL_IKHLAS_VERSES: QuranVerse[] = [
  {
    surah_number: 112,
    verse_number: 1,
    verse_key: "112:1",
    text: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    translation: 'Say, "He is Allah, [who is] One,"',
    transliteration: "Qul huwa Allahu ahad",
  },
  {
    surah_number: 112,
    verse_number: 2,
    verse_key: "112:2",
    text: "ٱللَّهُ ٱلصَّمَدُ",
    translation: "Allah, the Eternal Refuge.",
    transliteration: "Allahu as-samad",
  },
  {
    surah_number: 112,
    verse_number: 3,
    verse_key: "112:3",
    text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    translation: "He neither begets nor is born,",
    transliteration: "Lam yalid wa lam yoolad",
  },
  {
    surah_number: 112,
    verse_number: 4,
    verse_key: "112:4",
    text: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
    translation: 'Nor is there to Him any equivalent."',
    transliteration: "Wa lam yakun lahu kufuwan ahad",
  },
]

// Local data for Al-Falaq verses
const AL_FALAQ_VERSES: QuranVerse[] = [
  {
    surah_number: 113,
    verse_number: 1,
    verse_key: "113:1",
    text: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
    translation: 'Say, "I seek refuge in the Lord of daybreak',
    transliteration: "Qul audhu bi rabbil-falaq",
  },
  {
    surah_number: 113,
    verse_number: 2,
    verse_key: "113:2",
    text: "مِن شَرِّ مَا خَلَقَ",
    translation: "From the evil of that which He created",
    transliteration: "Min sharri ma khalaq",
  },
  {
    surah_number: 113,
    verse_number: 3,
    verse_key: "113:3",
    text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    translation: "And from the evil of darkness when it settles",
    transliteration: "Wa min sharri ghasiqin idha waqab",
  },
  {
    surah_number: 113,
    verse_number: 4,
    verse_key: "113:4",
    text: "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ",
    translation: "And from the evil of the blowers in knots",
    transliteration: "Wa min sharrin-naffathati fil uqad",
  },
  {
    surah_number: 113,
    verse_number: 5,
    verse_key: "113:5",
    text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "And from the evil of an envier when he envies.",
    transliteration: "Wa min sharri hasidin idha hasad",
  },
]

// Local data for An-Nas verses
const AN_NAS_VERSES: QuranVerse[] = [
  {
    surah_number: 114,
    verse_number: 1,
    verse_key: "114:1",
    text: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
    translation: 'Say, "I seek refuge in the Lord of mankind,',
    transliteration: "Qul audhu bi rabbin-nas",
  },
  {
    surah_number: 114,
    verse_number: 2,
    verse_key: "114:2",
    text: "مَلِكِ ٱلنَّاسِ",
    translation: "The Sovereign of mankind,",
    transliteration: "Malikin-nas",
  },
  {
    surah_number: 114,
    verse_number: 3,
    verse_key: "114:3",
    text: "إِلَـٰهِ ٱلنَّاسِ",
    translation: "The God of mankind,",
    transliteration: "Ilahin-nas",
  },
  {
    surah_number: 114,
    verse_number: 4,
    verse_key: "114:4",
    text: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
    translation: "From the evil of the retreating whisperer -",
    transliteration: "Min sharril-waswasil-khannas",
  },
  {
    surah_number: 114,
    verse_number: 5,
    verse_key: "114:5",
    text: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",
    translation: "Who whispers [evil] into the breasts of mankind -",
    transliteration: "Alladhi yuwaswisu fi sudurin-nas",
  },
  {
    surah_number: 114,
    verse_number: 6,
    verse_key: "114:6",
    text: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
    translation: "From among the jinn and mankind.",
    transliteration: "Minal-jinnati wan-nas",
  },
]

// Local data for tafsir
const LOCAL_TAFSIR: Record<string, string> = {
  "1:1":
    "This verse is known as the Basmalah. It is recommended to begin all actions with this phrase. It acknowledges that everything we do is with the help of Allah, who is characterized by His abundant mercy to all creation (Ar-Rahman) and His specific mercy to the believers (Ar-Raheem).",
  "1:2":
    "This verse establishes that all praise belongs to Allah alone, who is the Lord, Creator, Sustainer, and Nourisher of everything that exists. The term 'worlds' refers to all of creation, including humans, jinn, angels, and all that exists in the heavens and earth.",
  "1:3":
    "This verse reaffirms Allah's attributes of mercy. Ar-Rahman refers to His mercy that encompasses all creation, while Ar-Raheem refers to His special mercy reserved for the believers in the Hereafter.",
  "1:4":
    "This verse establishes Allah's absolute sovereignty on the Day of Judgment, when all souls will be held accountable for their deeds. On that day, no one will have any authority except Allah, who will judge with perfect justice.",
  "1:5":
    "This verse represents the essence of Islamic monotheism: worship and seeking help are directed solely to Allah. It establishes the direct relationship between the servant and Allah, without any intermediaries.",
  "1:6":
    "This verse teaches believers to ask Allah for guidance to the straight path, which is the path of Islam, the path of truth and righteousness.",
  "1:7":
    "This verse clarifies that the straight path is the path of those whom Allah has blessed, not the path of those who have earned Allah's anger or those who have gone astray.",
  "112:1":
    "This verse establishes the absolute oneness of Allah (Tawhid), which is the foundation of Islamic monotheism. It refutes any notion of plurality within the divine nature.",
  "112:2":
    "This verse describes Allah as 'As-Samad', which means the one upon whom all depend while He depends on none. He is the ultimate source of all sustenance.",
  "112:3":
    "This verse negates any notion of Allah having offspring or being born, refuting the beliefs of those who attribute children to Allah or claim that He came into existence.",
  "112:4":
    "This verse completes the concept of Tawhid by affirming that there is nothing comparable to Allah in His essence, attributes, or actions.",
}

/**
 * Get all surahs metadata
 */
export async function getAllSurahs(): Promise<QuranSurah[]> {
  if (dataCache.surahs) {
    return dataCache.surahs
  }

  // Use local data instead of fetching
  dataCache.surahs = LOCAL_SURAHS
  return LOCAL_SURAHS
}

/**
 * Get verses for a specific surah
 */
export async function getSurahVerses(surahNumber: number): Promise<QuranVerse[]> {
  const cacheKey = `surah_${surahNumber}`
  if (dataCache.verses && dataCache.verses[cacheKey]) {
    return dataCache.verses[cacheKey]
  }

  // Use local data for specific surahs
  let verses: QuranVerse[] = []

  if (surahNumber === 1) {
    verses = AL_FATIHA_VERSES
  } else if (surahNumber === 112) {
    verses = AL_IKHLAS_VERSES
  } else if (surahNumber === 113) {
    verses = AL_FALAQ_VERSES
  } else if (surahNumber === 114) {
    verses = AN_NAS_VERSES
  } else {
    // For other surahs, generate placeholder verses
    const surah = LOCAL_SURAHS.find((s) => s.number === surahNumber)
    if (surah) {
      verses = Array.from({ length: surah.verse_count }, (_, i) => ({
        surah_number: surahNumber,
        verse_number: i + 1,
        verse_key: `${surahNumber}:${i + 1}`,
        text: "﴿ نص الآية غير متوفر ﴾", // "Verse text not available" in Arabic
        translation: "Verse text not available. Please try another surah.",
      }))
    }
  }

  // Cache the results
  if (!dataCache.verses) {
    dataCache.verses = {}
  }
  dataCache.verses[cacheKey] = verses

  return verses
}

/**
 * Get a specific verse by its key (e.g., "1:1")
 */
export async function getVerseByKey(verseKey: string): Promise<QuranVerse | null> {
  const [surahNumber, verseNumber] = verseKey.split(":").map(Number)

  if (isNaN(surahNumber) || isNaN(verseNumber)) {
    console.error(`Invalid verse key: ${verseKey}`)
    return null
  }

  try {
    const verses = await getSurahVerses(surahNumber)
    return verses.find((verse) => verse.verse_number === verseNumber) || null
  } catch (error) {
    console.error(`Error fetching verse ${verseKey}:`, error)
    return null
  }
}

/**
 * Get audio URL for a specific verse
 */
export function getVerseAudioUrl(verseKey: string, reciterId = 7): string {
  // Format the verse key for the URL (e.g., 1:1 -> 001001)
  const [surah, ayah] = verseKey.split(":")
  const formattedSurah = surah.padStart(3, "0")
  const formattedAyah = ayah.padStart(3, "0")

  // Default to Mishary Rashid Alafasy recitation
  return `https://verses.quran.com/Alafasy/mp3/${formattedSurah}${formattedAyah}.mp3`
}

/**
 * Search for verses matching a query
 */
export async function searchQuran(
  query: string,
  options: {
    limit?: number
    searchArabic?: boolean
    searchTranslation?: boolean
    surahFilter?: number[]
    fuzzySearch?: boolean
  } = {},
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }

  const { limit = 20, searchArabic = true, searchTranslation = true, surahFilter = [], fuzzySearch = true } = options

  // Normalize the query
  const normalizedQuery = query.trim().toLowerCase()
  const arabicQuery = normalizedQuery
  const translationQuery = normalizedQuery

  // Load all surahs
  const surahs = await getAllSurahs()

  // Filter surahs if needed
  const surahsToSearch = surahFilter.length > 0 ? surahs.filter((surah) => surahFilter.includes(surah.number)) : surahs

  // Results array
  const results: SearchResult[] = []

  // Search through each surah
  for (const surah of surahsToSearch) {
    // Skip if we've reached the limit
    if (results.length >= limit) break

    // Get verses for this surah
    const verses = await getSurahVerses(surah.number)

    // Search through verses
    for (const verse of verses) {
      // Skip if we've reached the limit
      if (results.length >= limit) break

      let matchType: "text" | "translation" | "both" | null = null
      let matchScore = 0
      const highlights = { text: [] as string[], translation: [] as string[] }

      // Search in Arabic text
      if (searchArabic) {
        if (verse.text.includes(arabicQuery)) {
          matchType = "text"
          matchScore += 2 // Higher score for exact Arabic matches

          // Create highlighted text
          const textParts = verse.text.split(new RegExp(`(${arabicQuery})`, "i"))
          highlights.text = textParts
        } else if (fuzzySearch) {
          // Implement fuzzy search for Arabic
          // This is a simple implementation - in a real app, you might use a more sophisticated algorithm
          const words = verse.text.split(" ")
          for (const word of words) {
            if (word.includes(arabicQuery) || arabicQuery.includes(word)) {
              matchType = "text"
              matchScore += 1 // Lower score for fuzzy matches

              // Create highlighted text (simplified)
              highlights.text = [verse.text]
              break
            }
          }
        }
      }

      // Search in translation
      if (searchTranslation) {
        if (verse.translation.toLowerCase().includes(translationQuery)) {
          matchType = matchType ? "both" : "translation"
          matchScore += 1 // Lower score for translation matches

          // Create highlighted translation
          const translationParts = verse.translation.split(new RegExp(`(${translationQuery})`, "i"))
          highlights.translation = translationParts
        } else if (fuzzySearch) {
          // Implement fuzzy search for translation
          const words = verse.translation.toLowerCase().split(" ")
          for (const word of words) {
            if (word.includes(translationQuery) || translationQuery.includes(word)) {
              matchType = matchType ? "both" : "translation"
              matchScore += 0.5 // Lowest score for fuzzy translation matches

              // Create highlighted translation (simplified)
              highlights.translation = [verse.translation]
              break
            }
          }
        }
      }

      // Add to results if there's a match
      if (matchType) {
        results.push({
          verse,
          matchType,
          matchScore,
          highlights,
        })
      }
    }
  }

  // Sort results by score (highest first)
  results.sort((a, b) => b.matchScore - a.matchScore)

  return results.slice(0, limit)
}

/**
 * Get tafsir (commentary) for a specific verse
 */
export async function getVerseTafsir(verseKey: string): Promise<string> {
  return LOCAL_TAFSIR[verseKey] || "Tafsir not available for this verse."
}

// User analytics and progress tracking
export interface UserProgress {
  lastRead: {
    surah: number
    verse: number
    timestamp: number
  }
  favorites: string[] // verse keys
  readHistory: {
    date: string
    count: number
  }[]
  memorized: string[] // verse keys
  readCount: Record<string, number> // verse key -> count
}

// Local storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: "quran-user-progress",
  FAVORITES: "quran-favorites",
  HISTORY: "quran-search-history",
  USER_MODE: "user-mode", // 'adult' or 'kid'
}

/**
 * Get user progress data
 */
export function getUserProgress(): UserProgress {
  const defaultProgress: UserProgress = {
    lastRead: {
      surah: 1,
      verse: 1,
      timestamp: Date.now(),
    },
    favorites: [],
    readHistory: [],
    memorized: [],
    readCount: {},
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
    return storedData ? JSON.parse(storedData) : defaultProgress
  } catch (error) {
    console.error("Error getting user progress:", error)
    return defaultProgress
  }
}

/**
 * Save user progress data
 */
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
  } catch (error) {
    console.error("Error saving user progress:", error)
  }
}

/**
 * Track verse read
 */
export function trackVerseRead(verseKey: string): void {
  try {
    const progress = getUserProgress()

    // Update read count
    progress.readCount[verseKey] = (progress.readCount[verseKey] || 0) + 1

    // Update last read
    const [surah, verse] = verseKey.split(":").map(Number)
    progress.lastRead = {
      surah,
      verse,
      timestamp: Date.now(),
    }

    // Update read history
    const today = new Date().toISOString().split("T")[0]
    const todayEntry = progress.readHistory.find((entry) => entry.date === today)

    if (todayEntry) {
      todayEntry.count += 1
    } else {
      progress.readHistory.push({
        date: today,
        count: 1,
      })
    }

    // Keep only last 30 days
    progress.readHistory = progress.readHistory
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30)

    saveUserProgress(progress)
  } catch (error) {
    console.error("Error tracking verse read:", error)
  }
}

/**
 * Toggle favorite status for a verse
 */
export function toggleFavorite(verseKey: string): boolean {
  try {
    const progress = getUserProgress()

    if (progress.favorites.includes(verseKey)) {
      progress.favorites = progress.favorites.filter((key) => key !== verseKey)
      saveUserProgress(progress)
      return false
    } else {
      progress.favorites.push(verseKey)
      saveUserProgress(progress)
      return true
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return false
  }
}

/**
 * Toggle memorized status for a verse
 */
export function toggleMemorized(verseKey: string): boolean {
  try {
    const progress = getUserProgress()

    if (progress.memorized.includes(verseKey)) {
      progress.memorized = progress.memorized.filter((key) => key !== verseKey)
      saveUserProgress(progress)
      return false
    } else {
      progress.memorized.push(verseKey)
      saveUserProgress(progress)
      return true
    }
  } catch (error) {
    console.error("Error toggling memorized status:", error)
    return false
  }
}

/**
 * Get reading statistics
 */
export function getReadingStats() {
  const progress = getUserProgress()

  // Calculate total verses read
  const totalReads = Object.values(progress.readCount).reduce((sum, count) => sum + count, 0)

  // Calculate daily average (over last 7 days)
  const last7Days = progress.readHistory
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)

  const dailyAverage = last7Days.length > 0 ? last7Days.reduce((sum, day) => sum + day.count, 0) / last7Days.length : 0

  // Calculate current streak
  let currentStreak = 0
  const today = new Date().toISOString().split("T")[0]

  // Sort history by date (newest first)
  const sortedHistory = [...progress.readHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  // Check if read today
  if (sortedHistory.length > 0 && sortedHistory[0].date === today) {
    currentStreak = 1

    // Check previous days
    for (let i = 1; i < sortedHistory.length; i++) {
      const currentDate = new Date(sortedHistory[i].date)
      const prevDate = new Date(sortedHistory[i - 1].date)

      // Check if dates are consecutive
      const diffTime = prevDate.getTime() - currentDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        currentStreak += 1
      } else {
        break
      }
    }
  }

  return {
    totalReads,
    dailyAverage: Math.round(dailyAverage * 10) / 10,
    currentStreak,
    favoriteCount: progress.favorites.length,
    memorizedCount: progress.memorized.length,
    readHistory: progress.readHistory,
  }
}

/**
 * Get or set user mode (adult or kid)
 */
export function getUserMode(): "adult" | "kid" | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_MODE) as "adult" | "kid" | null
  } catch (error) {
    console.error("Error getting user mode:", error)
    return null
  }
}

export function setUserMode(mode: "adult" | "kid"): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_MODE, mode)
  } catch (error) {
    console.error("Error setting user mode:", error)
  }
}
