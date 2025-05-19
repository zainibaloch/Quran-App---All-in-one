import SemanticSearch from "@/components/semantic-search"
import AppFooter from "@/components/app-footer"

export default function SemanticSearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-8">Semantic Quran Search</h1>
        <SemanticSearch />
      </div>
      <AppFooter />
    </main>
  )
}
