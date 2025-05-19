"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, UserCircle, BookOpen, Calendar, Star } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [name, setName] = useState("Muhammad Abdullah")
  const [email, setEmail] = useState("user@example.com")

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center mb-4">
            <UserCircle className="h-16 w-16 text-emerald-600 dark:text-emerald-300" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{name}</h1>
          <p className="text-emerald-600 dark:text-emerald-400">{email}</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memorization Progress</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42%</div>
                  <p className="text-xs text-muted-foreground">Overall Quran memorization</p>
                  <Progress value={42} className="h-2 mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7 Days</div>
                  <p className="text-xs text-muted-foreground">Consecutive days of practice</p>
                  <div className="flex justify-between mt-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center"
                      >
                        <Star className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recently Studied</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { surah: "Al-Fatiha", lastStudied: "Today", progress: 100 },
                      { surah: "Al-Ikhlas", lastStudied: "Yesterday", progress: 75 },
                      { surah: "Al-Falaq", lastStudied: "3 days ago", progress: 50 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.surah}</p>
                          <p className="text-sm text-muted-foreground">Last studied: {item.lastStudied}</p>
                        </div>
                        <div className="w-24">
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Memorization Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Juz Progress</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-lg text-center ${
                            i < 3 ? "bg-emerald-100 dark:bg-emerald-800" : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <p className="font-bold">{i + 1}</p>
                          <p className="text-xs text-muted-foreground">{i < 3 ? "Complete" : "Not Started"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Surah Progress</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Al-Fatiha", verses: 7, memorized: 7, progress: 100 },
                        { name: "Al-Baqarah", verses: 286, memorized: 25, progress: 9 },
                        { name: "Al-Ikhlas", verses: 4, memorized: 4, progress: 100 },
                        { name: "Al-Falaq", verses: 5, memorized: 3, progress: 60 },
                        { name: "An-Nas", verses: 6, memorized: 6, progress: 100 },
                      ].map((surah, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{surah.name}</span>
                            <span>
                              {surah.memorized}/{surah.verses} verses ({surah.progress}%)
                            </span>
                          </div>
                          <Progress value={surah.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    {
                      date: "Today",
                      activities: [
                        { type: "memorization", surah: "Al-Fatiha", time: "10:30 AM", duration: "15 minutes" },
                        { type: "reading", surah: "Al-Baqarah", time: "2:45 PM", duration: "20 minutes" },
                      ],
                    },
                    {
                      date: "Yesterday",
                      activities: [
                        { type: "memorization", surah: "Al-Ikhlas", time: "9:15 AM", duration: "10 minutes" },
                        { type: "review", surah: "Al-Fatiha", time: "8:00 PM", duration: "5 minutes" },
                      ],
                    },
                    {
                      date: "April 30, 2025",
                      activities: [{ type: "reading", surah: "Al-Falaq", time: "11:20 AM", duration: "8 minutes" }],
                    },
                  ].map((day, dayIndex) => (
                    <div key={dayIndex}>
                      <h3 className="font-medium text-lg mb-4">{day.date}</h3>
                      <div className="space-y-4">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center mr-4">
                              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {activity.type === "memorization"
                                  ? "Memorized"
                                  : activity.type === "reading"
                                    ? "Read"
                                    : "Reviewed"}{" "}
                                Surah {activity.surah}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {activity.time} • {activity.duration}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value="••••••••" disabled />
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
