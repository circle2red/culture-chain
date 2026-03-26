import type { Metadata } from "next"
import { Suspense } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Providers } from "./providers"
import "@culture-chain/ui/globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | CultureChain",
    default: "CultureChain | Static Culture Marketplace",
  },
  description: "A fully static demo marketplace for cultural releases priced in SSU on Base.",
  keywords: ["SSU", "Base", "static demo", "digital culture", "marketplace"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CultureChain",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-slate-950">
        <Providers>
          <Suspense fallback={null}><Navbar /></Suspense>
          <div className="relative animate-fade-in">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
