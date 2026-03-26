"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDemoMarketStore } from "@/store/demo-market.store"

const CATEGORIES = [
  { label: "Painting", href: "/works?category=painting" },
  { label: "Books", href: "/works?category=book" },
  { label: "Film", href: "/works?category=film" },
  { label: "Music", href: "/works?category=music" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const params = useSearchParams()
  const reset = useDemoMarketStore((state) => state.reset)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState(params.get("q") ?? "")

  useEffect(() => {
    setQuery(params.get("q") ?? "")
  }, [params])

  function submitSearch() {
    const next = new URLSearchParams(params.toString())
    if (query.trim()) next.set("q", query.trim())
    else next.delete("q")
    router.push(`/works${next.toString() ? `?${next.toString()}` : ""}`)
    setSearchOpen(false)
    setMenuOpen(false)
  }

  function handleReset() {
    reset()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#fffcf7]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="mr-1 flex-shrink-0 font-serif text-xl font-bold tracking-tight text-slate-950">
          CultureChain
        </Link>

        <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 lg:inline-flex">
          Static SSU demo
        </span>

        <nav className="hidden items-center gap-1 md:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${pathname === "/works" && params.get("category") && c.href.endsWith(params.get("category") ?? "")
                ? "bg-slate-950 text-white"
                : "text-slate-600 hover:bg-white hover:text-slate-950"}`}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <form
          className="hidden md:block"
          onSubmit={(e) => {
            e.preventDefault()
            submitSearch()
          }}
        >
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search works or creators"
              className="h-10 w-56 rounded-full border border-slate-200 bg-white/80 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all duration-200 lg:w-72"
            />
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </form>

        <button
          className="rounded-full p-2 text-slate-500 hover:bg-white md:hidden"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </button>

        <Link
          href="/mint"
          className="hidden rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-amber-50 sm:block"
        >
          Mint
        </Link>

        <button
          type="button"
          onClick={handleReset}
          className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-amber-200 hover:text-slate-950 lg:block"
        >
          Reset demo
        </button>

        <button
          className="rounded-full p-2 text-slate-500 hover:bg-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {searchOpen && (
        <form
          className="border-t border-white/60 px-4 py-3 md:hidden"
          onSubmit={(e) => {
            e.preventDefault()
            submitSearch()
          }}
        >
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search works or creators"
              className="h-10 w-full rounded-full border border-slate-200 bg-white/80 pl-10 pr-4 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
              autoFocus
            />
            <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>
        </form>
      )}

      {menuOpen && (
        <div className="border-t border-white/60 bg-[#fffcf7] px-4 pb-4 md:hidden">
          <nav className="mt-3 grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 hover:border-amber-200 hover:bg-amber-50 hover:text-slate-950"
              >
                {c.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/mint"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block w-full rounded-full bg-slate-950 py-2.5 text-center text-sm font-semibold text-white"
          >
            Mint New Work
          </Link>
          <button
            type="button"
            onClick={() => {
              handleReset()
              setMenuOpen(false)
            }}
            className="mt-3 block w-full rounded-full border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-700"
          >
            Reset demo state
          </button>
        </div>
      )}
    </header>
  )
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
    </svg>
  )
}

function MenuIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function XIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
