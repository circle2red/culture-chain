import "server-only"

import { MOCK_WORKS, type MockWorkDetail, getWorkByTokenId } from "@/lib/mockData"

export type DemoWork = MockWorkDetail

export async function getDemoWorks() {
  return MOCK_WORKS
}

export async function getDemoWork(tokenId: string) {
  return getWorkByTokenId(tokenId)
}
