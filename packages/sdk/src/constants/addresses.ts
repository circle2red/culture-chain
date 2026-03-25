const envAddresses = {
  CultureNFT: process.env["NEXT_PUBLIC_CONTRACT_CULTURE_NFT"] as `0x${string}` | undefined,
  Marketplace: process.env["NEXT_PUBLIC_CONTRACT_MARKETPLACE"] as `0x${string}` | undefined,
  ShopRegistry: process.env["NEXT_PUBLIC_CONTRACT_SHOP_REGISTRY"] as `0x${string}` | undefined,
}

/**
 * 合约地址常量
 * 本地开发优先使用 .env.local，其次使用 deploy 脚本写回的静态值。
 */
export const CONTRACT_ADDRESSES = {
  /** Polygon Mainnet (chainId: 137) */
  137: {
    CultureNFT: "" as `0x${string}`,
    Marketplace: "" as `0x${string}`,
    ShopRegistry: "" as `0x${string}`,
  },
  /** Polygon Mumbai Testnet (chainId: 80001) */
  80001: {
    CultureNFT: "" as `0x${string}`,
    Marketplace: "" as `0x${string}`,
    ShopRegistry: "" as `0x${string}`,
  },
  /** Hardhat Local (chainId: 31337) */
  31337: {
    CultureNFT: envAddresses.CultureNFT ?? "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1" as `0x${string}`,
    Marketplace: envAddresses.Marketplace ?? "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44" as `0x${string}`,
    ShopRegistry: envAddresses.ShopRegistry ?? "0x59b670e9fA9D0A427751Af201D676719a970857b" as `0x${string}`,
  },
} as const

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES
