"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import {
  DEMO_CREATOR,
  MAX_STATIC_WORK_TOKEN_ID,
  MOCK_WORKS,
  SSU_SYMBOL,
  buildMockCoverImage,
  buildMockMetadataURI,
  cloneWork,
  getNextTokenId,
  type MockWorkDetail,
} from "@/lib/mockData"

interface MintDraft {
  title: string
  description: string
  category: MockWorkDetail["category"]
  tags: string[]
  coverImage?: string
  coverFileName?: string | null
  contentFileName?: string | null
  priceWei: string
  supply: number
  royaltyBps: number
}

interface BuyResult {
  ok: boolean
  error?: string
}

interface DemoMarketState {
  works: MockWorkDetail[]
  buyWork: (tokenId: string, amount?: number) => BuyResult
  mintWork: (draft: MintDraft) => MockWorkDetail
  reset: () => void
}

function createInitialWorks() {
  return MOCK_WORKS.map(cloneWork)
}

function buildPriceDisplay(priceWei: string) {
  return `${(Number(priceWei) / 1e18).toFixed(3)} ${SSU_SYMBOL}`
}

export const useDemoMarketStore = create<DemoMarketState>()(
  persist(
    (set, get) => ({
      works: createInitialWorks(),
      buyWork: (tokenId, amount = 1) => {
        let result: BuyResult = { ok: false, error: "Work not found." }

        set((state) => ({
          works: state.works.map((work) => {
            if (work.tokenId !== tokenId) return work

            if (work.supply > 0) {
              const remaining = work.supply - work.sold
              if (remaining <= 0) {
                result = { ok: false, error: "This release is already sold out." }
                return work
              }

              const safeAmount = Math.min(amount, remaining)
              result = { ok: true }
              return {
                ...work,
                sold: work.sold + safeAmount,
                availableAmount: Math.max((work.availableAmount ?? remaining) - safeAmount, 0),
              }
            }

            result = { ok: true }
            return {
              ...work,
              sold: work.sold + amount,
            }
          }),
        }))

        return result
      },
      mintWork: (draft) => {
        const nextTokenId = getNextTokenId(get().works)
        if (nextTokenId > MAX_STATIC_WORK_TOKEN_ID) {
          throw new Error(`Static demo token slots are full. Maximum token id is ${MAX_STATIC_WORK_TOKEN_ID}.`)
        }

        const tokenId = String(nextTokenId)
        const coverImage = draft.coverImage || buildMockCoverImage(draft.title, draft.category)
        const work: MockWorkDetail = {
          tokenId,
          title: draft.title.trim(),
          description: draft.description.trim() || "Browser-minted static demo release.",
          category: draft.category,
          coverImage,
          metadataURI: buildMockMetadataURI({
            title: draft.title.trim(),
            description: draft.description.trim() || "Browser-minted static demo release.",
            category: draft.category,
            tags: draft.tags,
            creatorName: DEMO_CREATOR.shopName,
            coverImage,
            files: {
              cover: draft.coverFileName ?? null,
              content: draft.contentFileName ?? null,
            },
          }),
          priceWei: draft.priceWei,
          priceDisplay: buildPriceDisplay(draft.priceWei),
          creator: DEMO_CREATOR,
          supply: draft.supply,
          sold: 0,
          royaltyBps: draft.royaltyBps,
          listingId: tokenId,
          availableAmount: draft.supply > 0 ? draft.supply : undefined,
        }

        set((state) => ({ works: [work, ...state.works] }))
        return work
      },
      reset: () => set({ works: createInitialWorks() }),
    }),
    {
      name: "culture-chain-demo-market",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
