"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { WorkCard } from "@/components/works/WorkCard"
import { type MockWorkDetail } from "@/lib/mockData"
import { useDemoMarketStore } from "@/store/demo-market.store"

interface WorksCatalogClientProps {
  initialWorks: MockWorkDetail[]
}

export function WorksCatalogClient({ initialWorks }: WorksCatalogClientProps) {
  const params = useSearchParams()
  const storedWorks = useDemoMarketStore((state) => state.works)
  const category = params.get("category") ?? ""
  const query = (params.get("q") ?? "").trim().toLowerCase()
  const sort = params.get("sort") ?? "newest"

  const works = useMemo(() => {
    const baseWorks = storedWorks.length > 0 ? storedWorks : initialWorks
    const filtered = baseWorks.filter((work) => {
      if (category && work.category !== category) return false
      if (!query) return true

      const haystack = `${work.title} ${work.creator.shopName}`.toLowerCase()
      return haystack.includes(query)
    })

    return [...filtered].sort((a, b) => {
      if (sort === "popular") return b.sold - a.sold
      if (sort === "price_asc") return Number(a.priceWei) - Number(b.priceWei)
      if (sort === "price_desc") return Number(b.priceWei) - Number(a.priceWei)
      return Number(b.tokenId) - Number(a.tokenId)
    })
  }, [category, initialWorks, query, sort, storedWorks])

  return works.length > 0 ? (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {works.map((work, i) => (
        <WorkCard key={work.tokenId} work={work} priority={i < 4} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center gap-3 rounded-[1.75rem] border border-white/60 bg-white/70 py-16 text-slate-400 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      <span className="text-5xl">🔍</span>
      <p className="font-semibold text-slate-700">No matching works found</p>
      <p className="text-sm">Try a different category or search phrase.</p>
    </div>
  )
}
