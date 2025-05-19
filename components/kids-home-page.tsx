"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserMode } from "@/components/user-mode-provider"
import { useRouter } from "next/navigation"
import { BookOpen, Compass, Clock, Gamepad2, BookMarked, User, Settings } from "lucide-react"
import AppFooter from "@/components/app-footer"
import Link from "next/link"
import MemoryGame from "@/components/kids/memory-game"

export default function KidsHomePage() {
  const { setMode } = useUserMode()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("learn")

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-pink-800 dark:text-pink-300 mb-2">Islamic Companion</h1>
            <p className="text-pink-600 dark:text-pink-400">Fun Islamic learning for kids!</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/settings")}
              className="flex items-center bg-white dark:bg-pink-950"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode("adult")}
              className="bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-800"
            >
              Switch to Adult Mode
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 md:grid-cols-5 rounded-full p-1 bg-pink-100 dark:bg-pink-900">
            <TabsTrigger value="learn" className="rounded-full">
              Learn
            </TabsTrigger>
            <TabsTrigger value="pray" className="rounded-full">
              Pray
            </TabsTrigger>
            <TabsTrigger value="games" className="rounded-full">
              Games
            </TabsTrigger>
            <TabsTrigger value="stories" className="rounded-full">
              Stories
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-full">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href="/kids/qaida">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Qaida</h3>
                        <p className="text-pink-100">Learn Arabic alphabet</p>
                      </div>
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-4">
                      <p>Start your journey with the Arabic alphabet and basic sounds.</p>
                      <Button className="mt-4 bg-pink-500 hover:bg-pink-600">Start Learning</Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href="/kids/prayers">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Daily Prayers</h3>
                        <p className="text-blue-100">Learn how to pray</p>
                      </div>
                      <Compass className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-4">
                      <p>Learn the steps of prayer and important duas.</p>
                      <Button className="mt-4 bg-blue-500 hover:bg-blue-600">Start Learning</Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Prayer Times</h3>
                      <p className="text-amber-100">Know when to pray</p>
                    </div>
                    <Clock className="h-12 w-12 text-white" />
                  </div>
                  <div className="p-4">
                    <p>Learn about the five daily prayers and when they occur.</p>
                    <Button className="mt-4 bg-amber-500 hover:bg-amber-600">Explore</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href="/kids/stories">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Prophets' Stories</h3>
                        <p className="text-green-100">Learn from the prophets</p>
                      </div>
                      <BookMarked className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-4">
                      <p>Discover amazing stories of the prophets and their teachings.</p>
                      <Button className="mt-4 bg-green-500 hover:bg-green-600">Read Stories</Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pray" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-800 dark:text-pink-300">Prayer Learning</h2>
                  <p className="text-pink-600 dark:text-pink-400">Learn how to pray step by step</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/kids/prayers">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold mb-2">Prayer Steps</h3>
                      <p>Learn the movements and words of prayer</p>
                      <Button className="mt-4 bg-white text-blue-500 hover:bg-blue-50">Start</Button>
                    </div>
                  </Link>

                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold mb-2">Prayer Times</h3>
                    <p>Learn when each prayer occurs</p>
                    <Button className="mt-4 bg-white text-purple-500 hover:bg-purple-50">Explore</Button>
                  </div>

                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold mb-2">Wudu Steps</h3>
                    <p>Learn how to perform ablution</p>
                    <Button className="mt-4 bg-white text-amber-500 hover:bg-amber-50">Learn</Button>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold mb-2">Important Duas</h3>
                    <p>Learn essential supplications</p>
                    <Button className="mt-4 bg-white text-green-500 hover:bg-green-50">Memorize</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href="/kids/games">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Memory Game</h3>
                        <p className="text-violet-100">Test your memory skills</p>
                      </div>
                      <Gamepad2 className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-4">
                      <p>Match Islamic symbols and terms in this fun memory game.</p>
                      <Button className="mt-4 bg-violet-500 hover:bg-violet-600">Play Now</Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href="/kids/games">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Dress Up Game</h3>
                        <p className="text-rose-100">Learn about modest clothing</p>
                      </div>
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-4">
                      <p>Learn about Islamic clothing through this fun dress-up game.</p>
                      <Button className="mt-4 bg-rose-500 hover:bg-rose-600">Play Now</Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>

            <div className="mt-6">
              <MemoryGame />
            </div>
          </TabsContent>

          <TabsContent value="stories" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-800 dark:text-pink-300">Islamic Stories</h2>
                  <p className="text-pink-600 dark:text-pink-400">Learn from the stories of the prophets</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/kids/stories">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold mb-2">Prophet Adam (AS)</h3>
                      <p>The first human and prophet</p>
                      <Button className="mt-4 bg-white text-emerald-500 hover:bg-emerald-50">Read</Button>
                    </div>
                  </Link>

                  <Link href="/kids/stories">
                    <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold mb-2">Prophet Nuh (AS)</h3>
                      <p>The story of the great flood</p>
                      <Button className="mt-4 bg-white text-blue-500 hover:bg-blue-50">Read</Button>
                    </div>
                  </Link>

                  <Link href="/kids/stories">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold mb-2">Prophet Ibrahim (AS)</h3>
                      <p>The friend of Allah</p>
                      <Button className="mt-4 bg-white text-amber-500 hover:bg-amber-50">Read</Button>
                    </div>
                  </Link>

                  <Link href="/kids/stories">
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 rounded-lg text-white hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold mb-2">Prophet Muhammad (PBUH)</h3>
                      <p>The final messenger</p>
                      <Button className="mt-4 bg-white text-red-500 hover:bg-red-50">Read</Button>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center mx-auto mb-4">
                    <User className="h-16 w-16 text-pink-600 dark:text-pink-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-pink-800 dark:text-pink-300">Kid's Profile</h2>
                  <p className="text-pink-600 dark:text-pink-400">Track your learning progress</p>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Learning Progress</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Arabic Alphabet</span>
                          <span>60%</span>
                        </div>
                        <div className="w-full bg-pink-200 rounded-full h-2.5 dark:bg-pink-700">
                          <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Prayer Steps</span>
                          <span>40%</span>
                        </div>
                        <div className="w-full bg-pink-200 rounded-full h-2.5 dark:bg-pink-700">
                          <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Stories Read</span>
                          <span>25%</span>
                        </div>
                        <div className="w-full bg-pink-200 rounded-full h-2.5 dark:bg-pink-700">
                          <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Achievements</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-pink-50 dark:bg-pink-900 p-4 rounded-lg text-center">
                        <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center mx-auto mb-2">
                          <BookOpen className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                        </div>
                        <p className="text-sm">First Lesson</p>
                      </div>
                      <div className="bg-pink-50 dark:bg-pink-900 p-4 rounded-lg text-center">
                        <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center mx-auto mb-2">
                          <Gamepad2 className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                        </div>
                        <p className="text-sm">Game Master</p>
                      </div>
                      <div className="bg-pink-50 dark:bg-pink-900 p-4 rounded-lg text-center">
                        <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center mx-auto mb-2">
                          <BookMarked className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                        </div>
                        <p className="text-sm">Story Time</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-pink-500 hover:bg-pink-600">Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AppFooter />
    </main>
  )
}
