"use client"

import Image from "next/image"
import { Badge, CATEGORY_LABELS } from "@/components/ui/Badge"
import { WorkDetailActions } from "./WorkDetailActions"
import { SSU_ADDRESS, SSU_DECIMALS, type MockWorkDetail } from "@/lib/mockData"
import { useDemoMarketStore } from "@/store/demo-market.store"

interface WorkDetailClientProps {
  tokenId: string
  initialWork: MockWorkDetail | null
}

export function WorkDetailClient({ tokenId, initialWork }: WorkDetailClientProps) {
  const works = useDemoMarketStore((state) => state.works)
  const work = works.find((item) => item.tokenId === tokenId) ?? initialWork

  if (!work) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Static demo</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-950">This release is not stored in this browser.</h1>
          <p className="mt-3 text-slate-500">
            Minted works are saved locally. Open the same browser profile that created token #{tokenId}.
          </p>
        </div>
      </main>
    )
  }

  const soldOut = work.supply > 0 && work.sold >= work.supply
  const remaining = work.supply > 0 ? work.supply - work.sold : null
  const soldPct = work.supply > 0 ? Math.round((work.sold / work.supply) * 100) : 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="relative aspect-[4/5] max-h-[600px] w-full overflow-hidden rounded-[2rem] border border-white/50 bg-slate-100 shadow-[0_24px_90px_rgba(15,23,42,0.14)] sm:aspect-[3/4]">
            <Image
              src={work.coverImage}
              alt={work.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h3 className="text-xl font-semibold text-slate-900">Release notes</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{work.description}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Badge variant={work.category}>
              {CATEGORY_LABELS[work.category] ?? work.category}
            </Badge>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">
              {work.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/60 bg-white/75 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-stone-200">
              {work.creator.avatar && (
                <Image
                  src={work.creator.avatar}
                  alt={work.creator.shopName}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Creator</p>
              <p className="truncate font-semibold text-slate-800">{work.creator.shopName}</p>
            </div>
            <span className="ml-auto font-address text-xs text-slate-400">
              {work.creator.address.slice(0, 6)}…{work.creator.address.slice(-4)}
            </span>
          </div>

          <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Current price</p>
            <p className="mt-2 text-4xl font-bold text-slate-950">{work.priceDisplay}</p>

            {work.supply > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Sold {work.sold}/{work.supply}</span>
                  <span>{soldPct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${soldPct}%` }}
                  />
                </div>
                {remaining !== null && !soldOut && (
                  <p className="mt-1 text-xs text-slate-400">{remaining} editions left</p>
                )}
              </div>
            )}

            <WorkDetailActions work={work} soldOut={soldOut || !work.listingId} />
          </div>

          <div className="space-y-3 rounded-[1.75rem] border border-white/60 bg-white/75 p-5 text-sm shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h3 className="text-xl font-semibold text-slate-900">Token details</h3>
            <InfoRow label="Token ID" value={`#${work.tokenId}`} mono />
            <InfoRow label="Payment token" value="SSU (ERC-20 on Base)" />
            <InfoRow label="Token address" value={SSU_ADDRESS} mono />
            <InfoRow label="Decimals" value={String(SSU_DECIMALS)} />
            <InfoRow label="Royalty" value={`${work.royaltyBps / 100}%`} />
          </div>
        </div>
      </div>
    </main>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`break-all text-right text-slate-800 ${mono ? "font-address" : ""}`}>{value}</span>
    </div>
  )
}
