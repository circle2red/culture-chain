"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { BuyModal } from "@/components/works/BuyModal"
import type { Work } from "@/components/works/WorkCard"

export function WorkDetailActions({ work, soldOut }: { work: Work; soldOut: boolean }) {
  const [showBuy, setShowBuy] = useState(false)

  if (soldOut) {
    return (
      <div className="mt-5 rounded-xl bg-slate-100 py-3 text-center text-sm font-semibold text-slate-500">
        Sold out
      </div>
    )
  }

  return (
    <>
      <div className="mt-5 space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => setShowBuy(true)}
        >
          Collect with SSU
        </Button>
        <p className="text-center text-xs text-slate-400">
          Static demo checkout. No wallet or live contract call required.
        </p>
      </div>

      {showBuy && (
        <BuyModal work={work} onClose={() => setShowBuy(false)} />
      )}
    </>
  )
}
