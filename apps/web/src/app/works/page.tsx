import { Suspense } from "react"
import { CategoryTabs } from "@/components/works/CategoryTabs"
import { getDemoWorks } from "@/lib/demo-chain"
import { WorksCatalogClient } from "./WorksCatalogClient"

export function generateMetadata() {
  return { title: "Marketplace" }
}

export default async function WorksPage() {
  const works = await getDemoWorks()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Marketplace</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950 sm:text-5xl">Static SSU catalog</h1>
        <p className="mt-3 text-base text-slate-600">
          Explore browser-backed releases, mock checkout flows, and pre-generated detail pages ready for GitHub Pages.
        </p>
      </div>

      <div className="mt-6">
        <Suspense>
          <CategoryTabs />
        </Suspense>
      </div>

      <Suspense fallback={null}><WorksCatalogClient initialWorks={works} /></Suspense>
    </main>
  )
}
