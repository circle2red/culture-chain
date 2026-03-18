/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@culture-chain/ui", "@culture-chain/sdk"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
      },
      // 开发阶段 mock 数据图片（生产时可移除）
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
}

export default nextConfig
