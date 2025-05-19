"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getReadingStats } from "@/lib/quran-data"
import { BookOpen, Star, CheckSquare, Calendar } from "lucide-react"

export default function LearningAnalytics() {
  const [stats, setStats] = useState(getReadingStats())
  const [timeframe, setTimeframe] = useState("week")

  // Refresh stats when component mounts
  useEffect(() => {
    setStats(getReadingStats())
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Learning Analytics</CardTitle>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-900 text-white rounded-lg p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-medium mb-2">Reading Streak</h3>
                  <div className="text-4xl font-bold mb-2">{stats.currentStreak} days</div>
                  <p className="text-purple-200">Keep it up!</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
                  <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" fill="white" />
                  </svg>
                </div>
              </div>

              <div className="bg-indigo-900 text-white rounded-lg p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-medium mb-2">Total Verses Read</h3>
                  <div className="text-4xl font-bold mb-2">{stats.totalReads}</div>
                  <p className="text-indigo-200">Daily average: {stats.dailyAverage}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
                  <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,150 C100,50 300,150 400,100 L400,200 L0,200 Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mb-2">
                  <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold">{stats.totalReads}</div>
                <div className="text-sm text-gray-500">Verses Read</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full mb-2">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">{stats.favoriteCount}</div>
                <div className="text-sm text-gray-500">Favorites</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mb-2">
                  <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold">{stats.memorizedCount}</div>
                <div className="text-sm text-gray-500">Memorized</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mb-2">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-sm text-gray-500">Day Streak</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Memorization Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Al-Fatiha</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Al-Ikhlas</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Al-Falaq</span>
                      <span>50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>An-Nas</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Reading Goals</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Daily Goal</span>
                    <span>{stats.readHistory[0]?.count || 0}/5 verses</span>
                  </div>
                  <Progress
                    value={Math.min(100, ((stats.readHistory[0]?.count || 0) / 5) * 100)}
                    className="h-3 mb-4"
                  />

                  <div className="flex justify-between mb-2">
                    <span>Weekly Goal</span>
                    <span>{stats.totalReads}/35 verses</span>
                  </div>
                  <Progress value={Math.min(100, (stats.totalReads / 35) * 100)} className="h-3" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Reading Activity</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="h-40 flex items-end justify-between">
                    {stats.readHistory.slice(0, 7).map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="bg-purple-500 w-8 rounded-t-md"
                          style={{
                            height: `${Math.min(100, day.count * 10)}%`,
                            minHeight: day.count > 0 ? "10%" : "0",
                          }}
                        ></div>
                        <div className="text-xs mt-2">{day.date.split("-")[2]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Time of Day</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">25%</div>
                      <div className="text-sm text-gray-500">Morning</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">15%</div>
                      <div className="text-sm text-gray-500">Afternoon</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">60%</div>
                      <div className="text-sm text-gray-500">Evening</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
