"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getUserMode, setUserMode } from "@/lib/quran-data"
import UserModeSelector from "@/components/user-mode-selector"

type UserModeContextType = {
  mode: "adult" | "kid" | null
  setMode: (mode: "adult" | "kid") => void
}

const UserModeContext = createContext<UserModeContextType>({
  mode: null,
  setMode: () => {},
})

export const useUserMode = () => useContext(UserModeContext)

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<"adult" | "kid" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user mode from localStorage
    const savedMode = getUserMode()
    setModeState(savedMode)
    setLoading(false)
  }, [])

  const setMode = (newMode: "adult" | "kid") => {
    setModeState(newMode)
    setUserMode(newMode)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 dark:bg-emerald-950">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // If mode is not set, show the selector
  if (mode === null) {
    return <UserModeSelector onSelect={setMode} />
  }

  return <UserModeContext.Provider value={{ mode, setMode }}>{children}</UserModeContext.Provider>
}
