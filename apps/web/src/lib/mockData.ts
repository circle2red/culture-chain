import type { Work } from "@/components/works/WorkCard"
import type { BadgeVariant } from "@/components/ui/Badge"

export const SSU_ADDRESS = "0x4b451e0dafedaa119f9cb55eac19d7011051e1b7" as const
export const SSU_DECIMALS = 18 as const
export const SSU_SYMBOL = "SSU" as const
export const MAX_STATIC_WORK_TOKEN_ID = 128

export const DEMO_CREATOR: Work["creator"] = {
  address: "0x9B7e5fD4A3cB8d1E2f60718a4d6C93F0a3B5D718",
  shopName: "Static Editions",
}

export interface MockMetadataPayload {
  title: string
  description: string
  category: BadgeVariant
  tags: string[]
  creatorName: string
  coverImage: string
  files: {
    cover: string | null
    content: string | null
  }
}

export interface MockWorkDetail extends Work {
  description: string
  metadataURI: string
  royaltyBps: number
}

interface MockWorkSeed {
  tokenId: string
  title: string
  category: BadgeVariant
  coverImage: string
  priceWei: string
  creator: Work["creator"]
  supply: number
  sold: number
  royaltyBps: number
  description: string
}

const CREATORS: Work["creator"][] = [
  { address: "0x1111111111111111111111111111111111111111", shopName: "Ink Atelier" },
  { address: "0x2222222222222222222222222222222222222222", shopName: "Paper Planet" },
  { address: "0x3333333333333333333333333333333333333333", shopName: "Indie Frames" },
  { address: "0x4444444444444444444444444444444444444444", shopName: "String Theory" },
  { address: "0x5555555555555555555555555555555555555555", shopName: "Urban Light" },
  { address: "0x6666666666666666666666666666666666666666", shopName: "After Hours Press" },
  { address: "0x7777777777777777777777777777777777777777", shopName: "Sound Weave" },
  { address: "0x8888888888888888888888888888888888888888", shopName: "Courtyard Films" },
]

const WORK_SEEDS: MockWorkSeed[] = [
  {
    tokenId: "1",
    title: "Between Mountains No. 3",
    category: "painting",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=1600&fit=crop",
    priceWei: "1000000000000000000",
    creator: CREATORS[0]!,
    supply: 10,
    sold: 3,
    royaltyBps: 500,
    description: "A limited digital print release built for a static storefront demo. Purchases update locally in the browser and settle in SSU for presentation purposes.",
  },
  {
    tokenId: "2",
    title: "Lonely Planet: Traveller's Ledger",
    category: "book",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=1600&fit=crop",
    priceWei: "500000000000000000",
    creator: CREATORS[1]!,
    supply: 100,
    sold: 47,
    royaltyBps: 700,
    description: "A collectible publishing release with open discovery and browser-only checkout. The piece is intentionally mock-backed so the whole site can ship as static assets.",
  },
  {
    tokenId: "3",
    title: "City Soliloquy",
    category: "film",
    coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=1600&fit=crop",
    priceWei: "2000000000000000000",
    creator: CREATORS[2]!,
    supply: 50,
    sold: 12,
    royaltyBps: 600,
    description: "An editorial film drop with static metadata, fixed artwork, and simulated collection flow stored in local browser state.",
  },
  {
    tokenId: "4",
    title: "Moonlit Improvisations EP",
    category: "music",
    coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=1600&fit=crop",
    priceWei: "800000000000000000",
    creator: CREATORS[3]!,
    supply: 200,
    sold: 200,
    royaltyBps: 500,
    description: "A sold-out audio release retained here to demonstrate supply exhaustion, sold-out UI states, and static detail rendering.",
  },
  {
    tokenId: "5",
    title: "Neon City No. 7",
    category: "painting",
    coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&h=1600&fit=crop",
    priceWei: "1500000000000000000",
    creator: CREATORS[4]!,
    supply: 5,
    sold: 2,
    royaltyBps: 800,
    description: "A scarce visual edition used to stress the buy modal, remaining inventory UI, and token-denominated pricing display.",
  },
  {
    tokenId: "6",
    title: "Midnight Reading Room",
    category: "book",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=1200&h=1600&fit=crop",
    priceWei: "600000000000000000",
    creator: CREATORS[5]!,
    supply: 300,
    sold: 88,
    royaltyBps: 450,
    description: "A larger-edition literary drop. It helps validate filtering, profile pages, and browser-local transaction simulation at higher supply counts.",
  },
  {
    tokenId: "7",
    title: "Above the Clouds OST",
    category: "music",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=1600&fit=crop",
    priceWei: "1200000000000000000",
    creator: CREATORS[6]!,
    supply: 0,
    sold: 0,
    royaltyBps: 650,
    description: "An open-edition music release. Supply zero is treated as open inventory and remains compatible with the static demo checkout flow.",
  },
  {
    tokenId: "8",
    title: "Garden of the Speechless",
    category: "film",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=1600&fit=crop",
    priceWei: "3000000000000000000",
    creator: CREATORS[7]!,
    supply: 20,
    sold: 5,
    royaltyBps: 900,
    description: "A premium release that anchors the high end of the catalog and keeps the static marketplace visually varied.",
  },
]

export const MOCK_WORKS: MockWorkDetail[] = WORK_SEEDS.map((seed) => ({
  tokenId: seed.tokenId,
  title: seed.title,
  category: seed.category,
  coverImage: seed.coverImage,
  description: seed.description,
  metadataURI: buildMockMetadataURI({
    title: seed.title,
    description: seed.description,
    category: seed.category,
    tags: [seed.category, SSU_SYMBOL.toLowerCase(), "static-demo"],
    creatorName: seed.creator.shopName,
    coverImage: seed.coverImage,
    files: {
      cover: `${seed.tokenId}-cover.jpg`,
      content: `${seed.tokenId}-asset.bin`,
    },
  }),
  priceWei: seed.priceWei,
  priceDisplay: formatTokenAmountFromWei(seed.priceWei),
  creator: seed.creator,
  supply: seed.supply,
  sold: seed.sold,
  royaltyBps: seed.royaltyBps,
  listingId: seed.tokenId,
  availableAmount: seed.supply > 0 ? Math.max(seed.supply - seed.sold, 0) : undefined,
}))

export const MOCK_CATEGORIES_STATS = [
  { key: "painting", label: "Painting", count: 1240, icon: "🎨" },
  { key: "book", label: "Books", count: 867, icon: "📚" },
  { key: "film", label: "Film", count: 432, icon: "🎬" },
  { key: "music", label: "Music", count: 958, icon: "🎵" },
]

export function cloneWork(work: MockWorkDetail): MockWorkDetail {
  return {
    ...work,
    creator: { ...work.creator },
  }
}

export function getWorkByTokenId(tokenId: string) {
  const work = MOCK_WORKS.find((item) => item.tokenId === tokenId)
  return work ? cloneWork(work) : null
}

export function getProfileAddresses() {
  return Array.from(new Set(MOCK_WORKS.map((work) => work.creator.address)))
}

export function getStaticWorkTokenIds() {
  return Array.from({ length: MAX_STATIC_WORK_TOKEN_ID }, (_, index) => String(index + 1))
}

export function getNextTokenId(works: Array<{ tokenId: string }>) {
  return works.reduce((max, work) => Math.max(max, Number(work.tokenId) || 0), 0) + 1
}

export function formatTokenAmountFromWei(value: string | bigint, precision = 3) {
  const amount = typeof value === "string" ? BigInt(value) : value
  const base = 10n ** 18n
  const whole = amount / base
  const fraction = amount % base
  const scaled = (fraction * 10n ** BigInt(precision)) / base
  return `${whole.toString()}.${scaled.toString().padStart(precision, "0")} ${SSU_SYMBOL}`
}

export function buildMockMetadataURI(payload: MockMetadataPayload) {
  return `data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`
}

export function buildMockCoverImage(title: string, category: string) {
  const label = title.trim() || "Static Editions"
  const accent =
    category === "painting" ? "#fb7185" :
    category === "book" ? "#f59e0b" :
    category === "film" ? "#38bdf8" :
    category === "music" ? "#22c55e" :
    "#78716c"

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="#111827" />
      <circle cx="640" cy="220" r="170" fill="${accent}" opacity="0.86" />
      <circle cx="140" cy="820" r="220" fill="#ffffff" opacity="0.08" />
      <rect x="64" y="88" width="672" height="824" rx="42" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <text x="96" y="168" fill="white" font-size="36" font-family="Georgia, serif">CultureChain Static Demo</text>
      <text x="96" y="716" fill="white" font-size="72" font-family="Georgia, serif">${escapeSvg(label.slice(0, 28))}</text>
      <text x="96" y="790" fill="rgba(255,255,255,0.72)" font-size="28" font-family="Arial, sans-serif">${escapeSvg(category || "other")} · ${SSU_SYMBOL}</text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function escapeSvg(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
