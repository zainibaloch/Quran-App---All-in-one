"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MemoryGame from "@/components/kids/memory-game"
import DressUpGame from "@/components/kids/dress-up-game"

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const games = [
    {
      id: "memory",
      title: "Memory Match",
      description: "Match the Arabic letters and Islamic symbols!",
      color: "bg-purple-500",
      icon: "🎮",
    },
    {
      id: "dressup",
      title: "Islamic Fashion",
      description: "Design beautiful Islamic outfits!",
      color: "bg-pink-500",
      icon: "👗",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 overflow-hidden">
      {/* Floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            {["🎮", "🎯", "🎪", "🎨", "🎭"][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 flex items-center">
          {selectedGame ? (
            <Button variant="ghost" className="mr-4" onClick={() => setSelectedGame(null)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Games
            </Button>
          ) : (
            <Link href="/kids">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </Link>
          )}
          <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            {selectedGame ? games.find((game) => game.id === selectedGame)?.title : "Fun Islamic Games"}
          </h1>
        </header>

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden cursor-pointer shadow-lg" onClick={() => setSelectedGame(game.id)}>
                  <div className={`h-3 ${game.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-16 h-16 rounded-full ${game.color} flex items-center justify-center text-white text-3xl`}
                      >
                        {game.icon}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-bold">{game.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{game.description}</p>
                      </div>
                    </div>
                    <Button className={`mt-2 text-white ${game.color}`}>Play Now</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {selectedGame === "memory" && <MemoryGame />}
            {selectedGame === "dressup" && <DressUpGame />}
          </div>
        )}
      </div>
    </main>
  )
}
