"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Shuffle } from "lucide-react"
import confetti from "canvas-confetti"

export default function DressUpGame() {
  const [selectedItems, setSelectedItems] = useState({
    hijab: 0,
    dress: 0,
    accessory: 0,
    background: 0,
  })
  const [outfitName, setOutfitName] = useState("")
  const [savedOutfits, setSavedOutfits] = useState<Array<{ name: string; items: typeof selectedItems }>>([])
  const [showSavedMessage, setShowSavedMessage] = useState(false)

  // Hijab styles
  const hijabs = [
    { id: 0, name: "None", color: "bg-transparent" },
    { id: 1, name: "Simple Hijab", color: "bg-blue-500" },
    { id: 2, name: "Patterned Hijab", color: "bg-purple-500" },
    { id: 3, name: "Fancy Hijab", color: "bg-pink-500" },
    { id: 4, name: "Casual Hijab", color: "bg-green-500" },
    { id: 5, name: "Formal Hijab", color: "bg-yellow-500" },
    { id: 6, name: "Elegant Hijab", color: "bg-red-500" },
    { id: 7, name: "Modern Hijab", color: "bg-indigo-500" },
  ]

  // Dress styles
  const dresses = [
    { id: 0, name: "None", color: "bg-transparent" },
    { id: 1, name: "Abaya", color: "bg-black" },
    { id: 2, name: "Jilbab", color: "bg-indigo-500" },
    { id: 3, name: "Kaftan", color: "bg-teal-500" },
    { id: 4, name: "Modern Dress", color: "bg-rose-500" },
    { id: 5, name: "Traditional Dress", color: "bg-amber-500" },
    { id: 6, name: "Formal Dress", color: "bg-purple-700" },
    { id: 7, name: "Casual Dress", color: "bg-emerald-500" },
  ]

  // Accessories
  const accessories = [
    { id: 0, name: "None", color: "bg-transparent" },
    { id: 1, name: "Necklace", color: "bg-yellow-300" },
    { id: 2, name: "Bracelet", color: "bg-gray-300" },
    { id: 3, name: "Bag", color: "bg-red-400" },
    { id: 4, name: "Shoes", color: "bg-brown-500" },
    { id: 5, name: "Glasses", color: "bg-gray-400" },
    { id: 6, name: "Earrings", color: "bg-yellow-500" },
    { id: 7, name: "Scarf", color: "bg-blue-300" },
  ]

  // Backgrounds
  const backgrounds = [
    { id: 0, name: "None", color: "bg-gray-100 dark:bg-gray-700" },
    { id: 1, name: "Mosque", color: "bg-gradient-to-b from-blue-200 to-blue-400" },
    { id: 2, name: "Desert", color: "bg-gradient-to-b from-yellow-200 to-amber-400" },
    { id: 3, name: "Garden", color: "bg-gradient-to-b from-green-200 to-green-400" },
    { id: 4, name: "Home", color: "bg-gradient-to-b from-orange-200 to-orange-300" },
    { id: 5, name: "School", color: "bg-gradient-to-b from-purple-200 to-purple-300" },
    { id: 6, name: "Eid", color: "bg-gradient-to-b from-pink-200 to-pink-300" },
    { id: 7, name: "Sunset", color: "bg-gradient-to-b from-red-200 to-orange-300" },
  ]

  // Load saved outfits from localStorage
  useEffect(() => {
    const savedOutfitsData = localStorage.getItem("savedOutfits")
    if (savedOutfitsData) {
      try {
        setSavedOutfits(JSON.parse(savedOutfitsData))
      } catch (e) {
        console.error("Error loading saved outfits:", e)
      }
    }
  }, [])

  // Save outfits to localStorage when they change
  useEffect(() => {
    if (savedOutfits.length > 0) {
      localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits))
    }
  }, [savedOutfits])

  const handleItemSelect = (category: "hijab" | "dress" | "accessory" | "background", id: number) => {
    setSelectedItems({
      ...selectedItems,
      [category]: id,
    })

    // Play selection sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 600
      gainNode.gain.value = 0.05

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      setTimeout(() => oscillator.stop(), 100)
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }
  }

  const randomize = () => {
    const newOutfit = {
      hijab: Math.floor(Math.random() * hijabs.length),
      dress: Math.floor(Math.random() * dresses.length),
      accessory: Math.floor(Math.random() * accessories.length),
      background: Math.floor(Math.random() * backgrounds.length),
    }

    setSelectedItems(newOutfit)

    // Play randomize sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Play a sequence of tones
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
      playTone(400, audioContext.currentTime, 0.1)
      playTone(600, audioContext.currentTime + 0.1, 0.1)
      playTone(800, audioContext.currentTime + 0.2, 0.2)
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }

    // Show confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const saveOutfit = () => {
    if (!outfitName.trim()) {
      setOutfitName(`Outfit ${savedOutfits.length + 1}`)
    }

    const newOutfit = {
      name: outfitName.trim() || `Outfit ${savedOutfits.length + 1}`,
      items: { ...selectedItems },
    }

    setSavedOutfits([...savedOutfits, newOutfit])
    setOutfitName("")
    setShowSavedMessage(true)

    // Hide message after 3 seconds
    setTimeout(() => {
      setShowSavedMessage(false)
    }, 3000)

    // Play save sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 800
      gainNode.gain.value = 0.1

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      setTimeout(() => oscillator.stop(), 200)
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }
  }

  const loadOutfit = (outfit: { name: string; items: typeof selectedItems }) => {
    setSelectedItems(outfit.items)

    // Play load sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 700
      gainNode.gain.value = 0.1

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      setTimeout(() => oscillator.stop(), 200)
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }
  }

  const deleteOutfit = (index: number) => {
    const newOutfits = [...savedOutfits]
    newOutfits.splice(index, 1)
    setSavedOutfits(newOutfits)

    // Play delete sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 300
      gainNode.gain.value = 0.1

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      setTimeout(() => oscillator.stop(), 200)
    } catch (err) {
      console.log("Sound playback not supported in this browser, continuing silently")
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Islamic Fashion Designer</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preview area */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Your Design</h3>
          <div
            className={`relative w-64 h-80 ${backgrounds[selectedItems.background].color} rounded-2xl overflow-hidden shadow-lg`}
          >
            {/* Character base */}
            <div className="absolute w-full h-full flex items-center justify-center">
              <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simple character silhouette */}
                <ellipse cx="60" cy="40" rx="30" ry="35" fill="#FFD7B5" />
                <path d="M30 40 L30 160 Q60 180 90 160 L90 40 Z" fill="#FFD7B5" />
              </svg>
            </div>

            {/* Dress layer */}
            {selectedItems.dress !== 0 && (
              <motion.div
                className={`absolute w-full h-full flex items-center justify-center`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`dress-${selectedItems.dress}`}
              >
                <div className={`w-48 h-64 ${dresses[selectedItems.dress].color} rounded-2xl`}></div>
              </motion.div>
            )}

            {/* Hijab layer */}
            {selectedItems.hijab !== 0 && (
              <motion.div
                className={`absolute w-full h-full flex items-center justify-center`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`hijab-${selectedItems.hijab}`}
              >
                <div className={`w-40 h-40 ${hijabs[selectedItems.hijab].color} rounded-full absolute top-0`}></div>
              </motion.div>
            )}

            {/* Accessory layer */}
            {selectedItems.accessory !== 0 && (
              <motion.div
                className={`absolute w-full h-full flex items-center justify-center`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`accessory-${selectedItems.accessory}`}
              >
                {selectedItems.accessory === 1 && (
                  <div
                    className={`w-20 h-4 ${accessories[selectedItems.accessory].color} rounded-full absolute top-60`}
                  ></div>
                )}
                {selectedItems.accessory === 2 && (
                  <div
                    className={`w-4 h-10 ${accessories[selectedItems.accessory].color} rounded-full absolute top-80 left-30`}
                  ></div>
                )}
                {selectedItems.accessory === 3 && (
                  <div
                    className={`w-16 h-16 ${accessories[selectedItems.accessory].color} rounded-lg absolute top-80 right-10`}
                  ></div>
                )}
                {selectedItems.accessory === 4 && (
                  <div
                    className={`w-30 h-6 ${accessories[selectedItems.accessory].color} rounded-lg absolute bottom-0`}
                  ></div>
                )}
                {selectedItems.accessory === 5 && (
                  <div
                    className={`w-20 h-6 ${accessories[selectedItems.accessory].color} rounded-lg absolute top-40`}
                  ></div>
                )}
                {selectedItems.accessory === 6 && (
                  <div
                    className={`w-6 h-6 ${accessories[selectedItems.accessory].color} rounded-full absolute top-40 left-30`}
                  ></div>
                )}
                {selectedItems.accessory === 7 && (
                  <div
                    className={`w-30 h-10 ${accessories[selectedItems.accessory].color} rounded-lg absolute top-50`}
                  ></div>
                )}
              </motion.div>
            )}
          </div>

          <div className="mt-6 space-y-4 w-full">
            <div className="flex justify-center space-x-2">
              <Button
                onClick={randomize}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Surprise Me!
              </Button>

              <Button
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveOutfit}
              >
                <Download className="h-4 w-4 mr-2" />
                Save Outfit
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Name your outfit"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {showSavedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-100 text-green-800 p-2 rounded-md text-center text-sm"
              >
                Outfit saved successfully!
              </motion.div>
            )}

            {savedOutfits.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Saved Outfits</h4>
                <div className="max-h-40 overflow-y-auto pr-2">
                  {savedOutfits.map((outfit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-2"
                    >
                      <span className="text-sm">{outfit.name}</span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => loadOutfit(outfit)}>
                          Load
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteOutfit(index)}>
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selection area */}
        <div>
          <Tabs defaultValue="hijab">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="hijab">Hijab</TabsTrigger>
              <TabsTrigger value="dress">Dress</TabsTrigger>
              <TabsTrigger value="accessory">Accessories</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
            </TabsList>

            <TabsContent value="hijab" className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
              <h3 className="text-lg font-medium mb-3">Choose a Hijab Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hijabs.map((hijab) => (
                  <motion.div
                    key={hijab.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-xl cursor-pointer ${
                      selectedItems.hijab === hijab.id
                        ? "ring-2 ring-pink-500 bg-pink-100 dark:bg-pink-800"
                        : "bg-white dark:bg-gray-700"
                    }`}
                    onClick={() => handleItemSelect("hijab", hijab.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full ${hijab.color} mb-2`}></div>
                      <span className="text-sm font-medium">{hijab.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dress" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="text-lg font-medium mb-3">Choose a Dress Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dresses.map((dress) => (
                  <motion.div
                    key={dress.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-xl cursor-pointer ${
                      selectedItems.dress === dress.id
                        ? "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-800"
                        : "bg-white dark:bg-gray-700"
                    }`}
                    onClick={() => handleItemSelect("dress", dress.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-20 rounded-lg ${dress.color} mb-2`}></div>
                      <span className="text-sm font-medium">{dress.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="accessory" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h3 className="text-lg font-medium mb-3">Choose Accessories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {accessories.map((accessory) => (
                  <motion.div
                    key={accessory.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-xl cursor-pointer ${
                      selectedItems.accessory === accessory.id
                        ? "ring-2 ring-purple-500 bg-purple-100 dark:bg-purple-800"
                        : "bg-white dark:bg-gray-700"
                    }`}
                    onClick={() => handleItemSelect("accessory", accessory.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-lg ${accessory.color} mb-2`}></div>
                      <span className="text-sm font-medium">{accessory.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="background" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h3 className="text-lg font-medium mb-3">Choose Background</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {backgrounds.map((background) => (
                  <motion.div
                    key={background.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-xl cursor-pointer ${
                      selectedItems.background === background.id
                        ? "ring-2 ring-green-500 bg-green-100 dark:bg-green-800"
                        : "bg-white dark:bg-gray-700"
                    }`}
                    onClick={() => handleItemSelect("background", background.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-12 rounded-lg ${background.color} mb-2`}></div>
                      <span className="text-sm font-medium">{background.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Islamic Fashion Tips</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Modest clothing is an important part of Islamic tradition</li>
              <li>Hijabs come in many beautiful styles and colors</li>
              <li>Loose-fitting clothes are both modest and comfortable</li>
              <li>You can be fashionable while following Islamic guidelines</li>
              <li>Different cultures have their own traditional Islamic clothing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
