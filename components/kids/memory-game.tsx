"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface MemoryCard {
  id: number
  content: string
  flipped: boolean
  matched: boolean
  category?: string
}

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameComplete, setGameComplete] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [level, setLevel] = useState<number>(1)
  const [totalLevels, setTotalLevels] = useState<number>(10)
  const [category, setCategory] = useState<"letters" | "symbols" | "mixed">("mixed")
  const [score, setScore] = useState<number>(0)

  // Arabic letters and Islamic symbols for the game
  const arabicLetters = [
    "ا",
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ي",
  ]

  const islamicSymbols = [
    "🕋",
    "🕌",
    "📿",
    "☪️",
    "🌙",
    "📖",
    "🤲",
    "🧕",
    "👳‍♂️",
    "🥘",
    "🍇",
    "🌴",
    "🐪",
    "⭐",
    "🌟",
    "🏜️",
    "🌄",
    "🌅",
    "🧿",
    "🧠",
    "❤️",
    "🤍",
    "💚",
    "🧡",
  ]

  // Additional symbols for higher levels
  const additionalSymbols = [
    "🌿",
    "🌱",
    "🌳",
    "🌲",
    "🌊",
    "🔥",
    "💧",
    "🌬️",
    "🌈",
    "☁️",
    "⛅",
    "🌤️",
    "🌥️",
    "🌦️",
    "🌧️",
    "🌨️",
    "🌩️",
    "🌪️",
    "🌫️",
    "🌝",
    "🌚",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
  ]

  // Sound effects
  const playMatchSound = () => {
    try {
      // Create a simple beep sound using the Web Audio API instead of loading external files
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 800 // Higher pitch for match
      gainNode.gain.value = 0.1

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      setTimeout(() => oscillator.stop(), 300)
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }
  }

  const playFlipSound = () => {
    try {
      // Create a simple beep sound using the Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 500 // Lower pitch for flip
      gainNode.gain.value = 0.05

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      setTimeout(() => oscillator.stop(), 100)
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }
  }

  const playWinSound = () => {
    try {
      // Create a victory sound using the Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Play a sequence of tones for victory
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = "sine"
        oscillator.frequency.value = frequency
        gainNode.gain.value = 0.1

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }

      // Play a simple ascending melody
      playTone(523.25, audioContext.currentTime, 0.2) // C
      playTone(659.25, audioContext.currentTime + 0.2, 0.2) // E
      playTone(783.99, audioContext.currentTime + 0.4, 0.4) // G
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }
  }

  // Initialize game based on difficulty and level
  const initializeGame = (
    level: number,
    difficultyLevel: "easy" | "medium" | "hard",
    gameCategory: "letters" | "symbols" | "mixed" = "mixed",
  ) => {
    setDifficulty(difficultyLevel)
    setGameStarted(true)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameComplete(false)
    setLevel(level)
    setCategory(gameCategory)

    let pairCount: number
    switch (difficultyLevel) {
      case "easy":
        pairCount = 6 + Math.floor(level / 2)
        break
      case "medium":
        pairCount = 8 + Math.floor(level / 2)
        break
      case "hard":
        pairCount = 12 + Math.floor(level / 2)
        break
      default:
        pairCount = 6 + Math.floor(level / 2)
    }

    // Cap the maximum pairs based on available symbols
    pairCount = Math.min(pairCount, 25)

    // Select symbols based on category and level
    let selectedSymbols: string[] = []

    if (gameCategory === "letters") {
      selectedSymbols = [...arabicLetters].sort(() => 0.5 - Math.random()).slice(0, pairCount)
    } else if (gameCategory === "symbols") {
      selectedSymbols = [...islamicSymbols].sort(() => 0.5 - Math.random()).slice(0, pairCount)
    } else {
      // For mixed category, use a combination based on level
      const letterCount = Math.floor(pairCount / 2)
      const symbolCount = pairCount - letterCount

      const letters = [...arabicLetters].sort(() => 0.5 - Math.random()).slice(0, letterCount)
      const symbols = [...islamicSymbols].sort(() => 0.5 - Math.random()).slice(0, symbolCount)

      selectedSymbols = [...letters, ...symbols]

      // For higher levels, add some additional symbols
      if (level > 5) {
        const additionalCount = Math.min(Math.floor(level / 2), additionalSymbols.length)
        const additional = [...additionalSymbols].sort(() => 0.5 - Math.random()).slice(0, additionalCount)
        selectedSymbols = selectedSymbols.slice(0, pairCount - additionalCount).concat(additional)
      }
    }

    // Create pairs and shuffle
    const cardPairs = [...selectedSymbols, ...selectedSymbols]
      .map((content, index) => ({
        id: index,
        content,
        flipped: false,
        matched: false,
        category: gameCategory === "mixed" ? (arabicLetters.includes(content) ? "letter" : "symbol") : gameCategory,
      }))
      .sort(() => 0.5 - Math.random())

    setCards(cardPairs)
  }

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore if already flipped or matched
    if (cards[id].flipped || cards[id].matched || flippedCards.length >= 2) {
      return
    }

    // Play flip sound
    playFlipSound()

    // Flip the card
    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      const [firstId, secondId] = newFlippedCards
      if (cards[firstId].content === cards[secondId].content) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstId].matched = true
          matchedCards[secondId].matched = true
          setCards(matchedCards)
          setMatchedPairs(matchedPairs + 1)
          setFlippedCards([])

          // Play match sound
          playMatchSound()

          // Update score - more points for fewer moves
          const basePoints = difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20
          const movesPenalty = Math.max(0, moves - matchedPairs) * 0.5
          const levelBonus = level * 2
          const pointsEarned = Math.max(5, Math.floor(basePoints - movesPenalty + levelBonus))
          setScore((prevScore) => prevScore + pointsEarned)

          // Play confetti for each match
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          })
        }, 500)
      } else {
        // No match, flip back
        setTimeout(() => {
          const unmatchedCards = [...cards]
          unmatchedCards[firstId].flipped = false
          unmatchedCards[secondId].flipped = false
          setCards(unmatchedCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Check for game completion
  useEffect(() => {
    if (gameStarted && matchedPairs === cards.length / 2 && cards.length > 0) {
      setGameComplete(true)

      // Play win sound
      playWinSound()

      // Celebrate with confetti
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }
  }, [matchedPairs, cards.length, gameStarted])

  // Proceed to next level
  const nextLevel = () => {
    if (level < totalLevels) {
      initializeGame(level + 1, difficulty, category)
    } else {
      // Game completed all levels
      setGameStarted(false)

      // Extra celebration for completing all levels
      confetti({
        particleCount: 200,
        spread: 180,
        origin: { y: 0.6 },
      })
    }
  }

  // Render difficulty selection
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-8 text-center">Islamic Memory Game</h2>

        <div className="w-full max-w-md mb-8">
          <h3 className="text-lg font-medium mb-4">Select Category</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Button
              onClick={() => setCategory("letters")}
              className={`p-4 ${category === "letters" ? "bg-purple-500 hover:bg-purple-600" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
            >
              Arabic Letters
            </Button>
            <Button
              onClick={() => setCategory("symbols")}
              className={`p-4 ${category === "symbols" ? "bg-purple-500 hover:bg-purple-600" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
            >
              Islamic Symbols
            </Button>
            <Button
              onClick={() => setCategory("mixed")}
              className={`p-4 ${category === "mixed" ? "bg-purple-500 hover:bg-purple-600" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
            >
              Mixed
            </Button>
          </div>

          <h3 className="text-lg font-medium mb-4">Select Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <Button
              onClick={() => initializeGame(1, "easy", category)}
              className="p-6 text-lg bg-green-500 hover:bg-green-600"
            >
              Easy
            </Button>
            <Button
              onClick={() => initializeGame(1, "medium", category)}
              className="p-6 text-lg bg-yellow-500 hover:bg-yellow-600"
            >
              Medium
            </Button>
            <Button
              onClick={() => initializeGame(1, "hard", category)}
              className="p-6 text-lg bg-red-500 hover:bg-red-600"
            >
              Hard
            </Button>
          </div>
        </div>

        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-xl w-full max-w-md">
          <h3 className="text-lg font-medium mb-2">How to Play</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Flip cards to find matching pairs</li>
            <li>Complete all levels to win</li>
            <li>Each level gets progressively harder</li>
            <li>Earn more points by making fewer moves</li>
          </ul>
        </div>
      </div>
    )
  }

  // Render game completion screen
  if (gameComplete) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-purple-600 dark:text-purple-400">
          Level {level} Complete! 🎉
        </h2>
        <p className="text-xl mb-2 text-center">You completed the level in {moves} moves!</p>
        <p className="text-lg mb-6 text-center">
          Current Score: <span className="font-bold text-green-500">{score}</span>
        </p>

        <div className="w-full max-w-md mb-6">
          <h3 className="text-lg font-medium mb-2">Level Progress</h3>
          <Progress value={(level / totalLevels) * 100} className="h-4 mb-2" />
          <p className="text-sm text-center text-gray-600">
            Level {level} of {totalLevels}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {level < totalLevels ? (
            <Button onClick={nextLevel} className="bg-purple-500 hover:bg-purple-600">
              Next Level
            </Button>
          ) : (
            <Button onClick={() => setGameStarted(false)} className="bg-green-500 hover:bg-green-600">
              You Completed All Levels! Play Again?
            </Button>
          )}
          <Button onClick={() => initializeGame(level, difficulty, category)} variant="outline">
            Replay Level
          </Button>
          <Button onClick={() => setGameStarted(false)} variant="outline">
            Change Difficulty
          </Button>
        </div>
      </motion.div>
    )
  }

  // Calculate grid columns based on difficulty and level
  let gridCols = "grid-cols-3"
  if (difficulty === "easy") {
    gridCols = level <= 3 ? "grid-cols-3" : "grid-cols-4"
  } else if (difficulty === "medium") {
    gridCols = level <= 2 ? "grid-cols-4" : "grid-cols-5"
  } else {
    gridCols = level <= 1 ? "grid-cols-4" : level <= 3 ? "grid-cols-5" : "grid-cols-6"
  }

  // Render game board
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900">
              Level {level}
            </Badge>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
              Score: {score}
            </Badge>
          </div>
          <div className="flex space-x-4">
            <p className="text-sm font-medium">Moves: {moves}</p>
            <p className="text-sm font-medium">
              Pairs: {matchedPairs}/{cards.length / 2}
            </p>
          </div>
        </div>
        <Button onClick={() => initializeGame(level, difficulty, category)} variant="outline" size="sm">
          Restart Level
        </Button>
      </div>

      <div className={`grid ${gridCols} gap-3`}>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
            className="aspect-square"
          >
            <div
              className={`w-full h-full rounded-xl cursor-pointer transition-all duration-300 transform ${
                card.flipped || card.matched ? "rotate-y-180" : ""
              }`}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className={`absolute w-full h-full rounded-xl flex items-center justify-center text-3xl font-bold ${
                  card.matched
                    ? "bg-green-100 dark:bg-green-900"
                    : card.category === "letter"
                      ? "bg-purple-100 dark:bg-purple-900"
                      : "bg-blue-100 dark:bg-blue-900"
                } backface-hidden`}
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                {card.content}
              </div>
              <div
                className="absolute w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  ?
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <Progress value={(matchedPairs / (cards.length / 2)) * 100} className="h-2 mb-2" />
        <p className="text-xs text-center text-gray-500">Match all pairs to complete the level</p>
      </div>
    </div>
  )
}
