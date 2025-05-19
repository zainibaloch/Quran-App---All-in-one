"use client"

import { useUserMode } from "@/components/user-mode-provider"
import AdultHomePage from "@/components/adult-home-page"
import KidsHomePage from "@/components/kids-home-page"

export default function Home() {
  const { mode } = useUserMode()

  if (mode === "adult") {
    return <AdultHomePage />
  } else if (mode === "kid") {
    return <KidsHomePage />
  }

  // This should not happen as the UserModeProvider handles the null case
  return null
}
