import { getDemoWork } from "@/lib/demo-chain"
import { getStaticWorkTokenIds } from "@/lib/mockData"
import { WorkDetailClient } from "./WorkDetailClient"

interface WorkDetailPageProps {
  params: Promise<{ tokenId: string }>
}

export async function generateStaticParams() {
  return getStaticWorkTokenIds().map((tokenId) => ({ tokenId }))
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { tokenId } = await params
  const work = await getDemoWork(tokenId)
  return { title: work?.title ?? `Work #${tokenId}` }
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { tokenId } = await params
  const work = await getDemoWork(tokenId)

  return <WorkDetailClient tokenId={tokenId} initialWork={work} />
}
