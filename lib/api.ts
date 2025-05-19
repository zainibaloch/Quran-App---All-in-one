// API utilities for fetching Quran data

// Base URLs for different APIs
const QURAN_API_BASE = "https://api.quran.com/api/v4"
const ALQURAN_API_BASE = "https://api.alquran.cloud/v1"
const TARTEEL_API_BASE = "https://api.tarteel.io/v1" // Note: This is a placeholder URL

// Types
export interface QuranVerse {
  id: number
  verse_key: string
  verse_number: number
  text: string
  juz_number: number
  page_number: number
  translations?: {
    id: number
    text: string
    language_name: string
  }[]
  audio?: {
    url: string
    segments?: number[][]
  }
  words?: {
    id: number
    position: number
    text: string
    audio_url?: string
    timestamp?: number
  }[]
}

export interface Surah {
  id: number
  name: string
  english_name: string
  english_name_translation: string
  revelation_place: string
  verses_count: number
}

export interface Reciter {
  id: number
  name: string
  style?: string
  recitation_id?: number
}

export interface Translation {
  id: number
  name: string
  language_name: string
  author_name: string
}

// Get list of all surahs
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/chapters?language=en`)
    if (!response.ok) throw new Error("Failed to fetch surahs")
    const data = await response.json()
    return data.chapters
  } catch (error) {
    console.error("Error fetching surahs:", error)
    // Return some default surahs as fallback
    return [
      {
        id: 1,
        name: "الفاتحة",
        english_name: "Al-Fatiha",
        english_name_translation: "The Opening",
        revelation_place: "makkah",
        verses_count: 7,
      },
      {
        id: 112,
        name: "الإخلاص",
        english_name: "Al-Ikhlas",
        english_name_translation: "Sincerity",
        revelation_place: "makkah",
        verses_count: 4,
      },
      {
        id: 113,
        name: "الفلق",
        english_name: "Al-Falaq",
        english_name_translation: "The Daybreak",
        revelation_place: "makkah",
        verses_count: 5,
      },
      {
        id: 114,
        name: "الناس",
        english_name: "An-Nas",
        english_name_translation: "Mankind",
        revelation_place: "makkah",
        verses_count: 6,
      },
    ]
  }
}

// Get verses for a specific surah
export async function getSurahVerses(surahId: number, translationIds: number[] = [131]): Promise<QuranVerse[]> {
  try {
    // Fetch verses with translations
    const translationsParam = translationIds.join(",")
    const response = await fetch(
      `${QURAN_API_BASE}/verses/by_chapter/${surahId}?language=en&translations=${translationsParam}&fields=text_uthmani,verse_key,verse_number&word_fields=text_uthmani`,
    )

    if (!response.ok) throw new Error("Failed to fetch verses")
    const data = await response.json()

    return data.verses
  } catch (error) {
    console.error(`Error fetching verses for surah ${surahId}:`, error)

    // Return fallback data for Al-Fatiha
    if (surahId === 1) {
      return [
        {
          id: 1,
          verse_key: "1:1",
          verse_number: 1,
          text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
          juz_number: 1,
          page_number: 1,
          translations: [
            {
              id: 131,
              text: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
              language_name: "english",
            },
          ],
        },
        {
          id: 2,
          verse_key: "1:2",
          verse_number: 2,
          text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
          juz_number: 1,
          page_number: 1,
          translations: [
            { id: 131, text: "All praise is due to Allah, Lord of the worlds.", language_name: "english" },
          ],
        },
        {
          id: 3,
          verse_key: "1:3",
          verse_number: 3,
          text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
          juz_number: 1,
          page_number: 1,
          translations: [
            { id: 131, text: "The Entirely Merciful, the Especially Merciful,", language_name: "english" },
          ],
        },
        {
          id: 4,
          verse_key: "1:4",
          verse_number: 4,
          text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
          juz_number: 1,
          page_number: 1,
          translations: [{ id: 131, text: "Sovereign of the Day of Recompense.", language_name: "english" }],
        },
        {
          id: 5,
          verse_key: "1:5",
          verse_number: 5,
          text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
          juz_number: 1,
          page_number: 1,
          translations: [{ id: 131, text: "It is You we worship and You we ask for help.", language_name: "english" }],
        },
        {
          id: 6,
          verse_key: "1:6",
          verse_number: 6,
          text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
          juz_number: 1,
          page_number: 1,
          translations: [{ id: 131, text: "Guide us to the straight path -", language_name: "english" }],
        },
        {
          id: 7,
          verse_key: "1:7",
          verse_number: 7,
          text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
          juz_number: 1,
          page_number: 1,
          translations: [
            {
              id: 131,
              text: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.",
              language_name: "english",
            },
          ],
        },
      ]
    }

    // Return empty array for other surahs
    return []
  }
}

// Get available translations
export async function getTranslations(): Promise<Translation[]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/resources/translations`)
    if (!response.ok) throw new Error("Failed to fetch translations")
    const data = await response.json()
    return data.translations
  } catch (error) {
    console.error("Error fetching translations:", error)
    // Return some default translations as fallback
    return [
      { id: 131, name: "Dr. Mustafa Khattab", language_name: "english", author_name: "Dr. Mustafa Khattab" },
      { id: 20, name: "Sahih International", language_name: "english", author_name: "Sahih International" },
      { id: 84, name: "Mufti Taqi Usmani", language_name: "urdu", author_name: "Mufti Taqi Usmani" },
      { id: 77, name: "Muhammad Hamidullah", language_name: "french", author_name: "Muhammad Hamidullah" },
      { id: 83, name: "Raúl González Bórnez", language_name: "spanish", author_name: "Raúl González Bórnez" },
    ]
  }
}

// Get available reciters
export async function getReciters(): Promise<Reciter[]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/resources/recitations`)
    if (!response.ok) throw new Error("Failed to fetch reciters")
    const data = await response.json()
    return data.recitations
  } catch (error) {
    console.error("Error fetching reciters:", error)
    // Return some default reciters as fallback
    return [
      { id: 1, name: "Mishari Rashid al-`Afasy", style: "Murattal", recitation_id: 1 },
      { id: 2, name: "AbdulBaset AbdulSamad", style: "Murattal", recitation_id: 2 },
      { id: 3, name: "Mahmoud Khalil Al-Husary", style: "Murattal", recitation_id: 3 },
      { id: 4, name: "Mohamed Siddiq al-Minshawi", style: "Murattal", recitation_id: 4 },
      { id: 5, name: "Hani ar-Rifai", style: "Murattal", recitation_id: 5 },
    ]
  }
}

// Get audio for a specific verse by a specific reciter
export async function getVerseAudio(verseKey: string, reciterId = 7): Promise<string> {
  try {
    // Format the verse key for the fallback URL (e.g., 1:1 -> 001001)
    const [surah, ayah] = verseKey.split(":")
    const formattedSurah = surah.padStart(3, "0")
    const formattedAyah = ayah.padStart(3, "0")

    // Default fallback URL (Mishary Rashid Alafasy recitation)
    const fallbackUrl = `https://verses.quran.com/Alafasy/mp3/${formattedSurah}${formattedAyah}.mp3`

    // Try to get from API
    const response = await fetch(`${QURAN_API_BASE}/recitations/${reciterId}/by_ayah/${verseKey}`)

    if (!response.ok) {
      console.warn(`API returned ${response.status} for audio request, using fallback`)
      return fallbackUrl
    }

    const data = await response.json()

    // Check various possible response structures
    if (data.audio_file && data.audio_file.audio_url) {
      return data.audio_file.audio_url
    }

    if (data.audio_files && data.audio_files.length > 0 && data.audio_files[0].url) {
      return data.audio_files[0].url
    }

    if (data.audio && typeof data.audio === "string") {
      return data.audio
    }

    // If we can't find the audio URL in the response, use the fallback
    console.warn(`Could not find audio URL in API response, using fallback for ${verseKey}`)
    return fallbackUrl
  } catch (error) {
    console.error(`Error fetching audio for verse ${verseKey}:`, error)

    // Construct a fallback URL based on the verse key
    const [surah, ayah] = verseKey.split(":")
    const formattedSurah = surah.padStart(3, "0")
    const formattedAyah = ayah.padStart(3, "0")

    return `https://verses.quran.com/Alafasy/mp3/${formattedSurah}${formattedAyah}.mp3`
  }
}

// Get word timings for a specific verse by a specific reciter
export async function getWordTimings(verseKey: string, reciterId = 7): Promise<number[][]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/recitations/${reciterId}/by_ayah/${verseKey}`)
    if (!response.ok) throw new Error("Failed to fetch word timings")
    const data = await response.json()

    // Check if the expected structure exists
    if (data.audio_file && Array.isArray(data.audio_file.segments)) {
      return data.audio_file.segments
    }

    // Alternative structure that might be present
    if (data.segments && Array.isArray(data.segments)) {
      return data.segments
    }

    // If we can't find the segments, return an empty array
    return []
  } catch (error) {
    console.error(`Error fetching word timings for verse ${verseKey}:`, error)
    // Return empty array as fallback
    return []
  }
}

// Get tafsir (commentary) for a specific verse
export async function getTafsir(verseKey: string, tafsirId = 1): Promise<string> {
  try {
    // First try to get from API
    try {
      const response = await fetch(`${QURAN_API_BASE}/tafsirs/${tafsirId}/by_ayah/${verseKey}`)
      if (!response.ok) throw new Error("Failed to fetch tafsir")
      const data = await response.json()
      return data.tafsir.text
    } catch (apiError) {
      console.warn(`API tafsir fetch failed for ${verseKey}, using fallback`, apiError)

      // Return fallback tafsir for Al-Fatiha verses
      const fallbackTafsirs: Record<string, string> = {
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
      }

      return fallbackTafsirs[verseKey] || "Tafsir not available for this verse."
    }
  } catch (error) {
    console.error(`Error fetching tafsir for verse ${verseKey}:`, error)
    return "Tafsir not available at this time. Please try again later."
  }
}

// Analyze recitation using Tarteel API (simulated)
export async function analyzeRecitation(audioBlob: Blob, verseKey: string): Promise<any> {
  try {
    // In a real implementation, this would upload the audio to the Tarteel API
    // and get back analysis results

    // Simulate API call with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated response based on verse key
        const response = {
          overall_score: 85,
          tajweed_score: 82,
          pronunciation_score: 88,
          feedback: [
            {
              type: verseKey === "1:1" ? "success" : "warning",
              rule: "Pronunciation",
              word: verseKey === "1:1" ? "بِسْمِ" : "الْحَمْدُ",
              feedback:
                verseKey === "1:1"
                  ? "Excellent pronunciation of 'Bismillah'"
                  : "Good pronunciation, but pay attention to the 'dal' sound",
              timeStamp: "0:01",
            },
            {
              type: "error",
              rule: "Madd",
              word: verseKey === "1:1" ? "الرَّحْمَٰنِ" : "لِلَّهِ",
              feedback: "The elongation (madd) should be 4-5 counts",
              timeStamp: "0:03",
            },
            {
              type: verseKey === "1:1" ? "warning" : "success",
              rule: "Ghunnah",
              word: verseKey === "1:1" ? "الرَّحِيمِ" : "الْعَالَمِينَ",
              feedback:
                verseKey === "1:1"
                  ? "Slight improvement needed in the nasalization"
                  : "Perfect nasalization of the noon sound",
              timeStamp: "0:05",
            },
          ],
        }

        resolve(response)
      }, 2000)
    })
  } catch (error) {
    console.error("Error analyzing recitation:", error)
    throw error
  }
}

// Get prayer times for a location
export async function getPrayerTimes(city: string, country: string, method = 2): Promise<any> {
  try {
    const today = new Date()
    const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`

    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`,
    )

    if (!response.ok) throw new Error("Failed to fetch prayer times")
    const data = await response.json()
    return data.data.timings
  } catch (error) {
    console.error("Error fetching prayer times:", error)

    // Return fallback prayer times
    return {
      Fajr: "05:23",
      Sunrise: "06:45",
      Dhuhr: "12:30",
      Asr: "15:45",
      Maghrib: "18:15",
      Isha: "19:45",
    }
  }
}
