# CLAUDE.md — CultureChain 开发指南

## 项目概述

**CultureChain** 是一个 Web3 文化作品交易平台，对标淘宝/咸鱼的易用性，通过区块链技术实现版权确权与交易。支持画作、书籍、影视、音乐等数字文化作品的铸造、发行与二级市场交易。

## 核心架构

```
web3_app/
├── apps/
│   ├── web/              # Next.js 前端
│   └── contracts/        # Solidity 智能合约 (Hardhat)
├── packages/
│   ├── ui/               # 共享 UI 组件库
│   ├── config/           # 共享配置 (eslint, tsconfig)
│   └── sdk/              # 合约交互 SDK (ethers.js 封装)
├── docs/                 # 项目文档
├── CLAUDE.md             # 本文件
└── package.json          # Turborepo monorepo 根
```

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 14 (App Router) | SSR + RSC 支持 |
| 样式 | Tailwind CSS + shadcn/ui | 快速 UI 开发 |
| 状态管理 | Zustand | 轻量，适合 Web3 状态 |
| Web3 连接 | wagmi v2 + viem | 类型安全的 EVM 交互 |
| 钱包支持 | WalletConnect + RainbowKit | 多钱包兼容 |
| 区块链网络 | Polygon PoS (主网) / Mumbai (测试网) | 低 Gas 费用 |
| 智能合约 | Solidity 0.8.x + Hardhat | 合约开发与测试 |
| NFT 标准 | ERC-1155 (多类型) + ERC-2981 (版税) | 文化作品适配 |
| 去中心化存储 | IPFS (Pinata) + Arweave | 作品文件永久存储 |
| 后端 API | Next.js API Routes | 链下元数据服务 |
| 数据库 | PostgreSQL + Prisma ORM | 用户/商店数据 |
| 搜索 | Meilisearch | 作品全文检索 |
| 认证 | SIWE (Sign-In with Ethereum) | 钱包登录 |

## 编码规范

### 通用原则
- TypeScript 严格模式，禁止 `any`
- 函数式组件 + React Hooks，禁止 class 组件
- 文件命名：组件用 PascalCase，工具函数用 camelCase，常量用 SCREAMING_SNAKE_CASE
- 目录命名：kebab-case

### 智能合约规范
- 每个合约必须有 NatSpec 注释
- 所有外部函数写单元测试，覆盖率 > 90%
- 遵循 Checks-Effects-Interactions 模式防止重入攻击
- 使用 OpenZeppelin 标准库，禁止自造加密轮子
- 部署前必须通过 Slither 静态分析

### 前端规范
- 组件粒度：单一职责，不超过 200 行
- Web3 交互必须处理 pending / success / error 三态
- 敏感操作（铸造、购买）需要二次确认 Modal
- 移动端优先设计

### API 规范
- RESTful 路由，`/api/v1/` 前缀
- 所有接口返回 `{ data, error, meta }` 结构
- 链上数据以链上为准，数据库仅缓存索引数据

## 智能合约地址管理

合约地址统一在 `packages/sdk/src/constants/addresses.ts` 管理：

```typescript
export const CONTRACT_ADDRESSES = {
  polygon: {
    CultureNFT: '0x...',
    Marketplace: '0x...',
    RoyaltyRegistry: '0x...',
  },
  mumbai: {
    CultureNFT: '0x...',
    Marketplace: '0x...',
    RoyaltyRegistry: '0x...',
  },
} as const
```

## 环境变量

必须在 `.env.local` 配置（参考 `.env.example`）：

```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_POLYGON_RPC_URL=
NEXT_PUBLIC_IPFS_GATEWAY=
PINATA_API_KEY=
PINATA_SECRET_KEY=
DATABASE_URL=
NEXT_PUBLIC_CHAIN_ID=137
```

## 关键业务流程

### 创作者铸造作品 NFT
1. 上传文件至 IPFS → 获得 CID
2. 构建 metadata JSON，上传至 IPFS
3. 调用 `CultureNFT.mint(metadataURI, royaltyBps)`
4. 在数据库记录作品索引信息

### 购买作品
1. 买家调用 `Marketplace.buyItem(tokenId)` 并附带 ETH/MATIC
2. 合约自动分配版税给创作者
3. NFT 所有权转移给买家
4. 前端监听 `ItemSold` 事件更新 UI

## 常用命令

```bash
# 启动开发环境
pnpm dev

# 编译合约
pnpm contracts:compile

# 运行合约测试
pnpm contracts:test

# 部署合约到测试网
pnpm contracts:deploy:mumbai

# 数据库迁移
pnpm db:migrate

# 构建生产版本
pnpm build
```

## 注意事项

- **Gas 优化**：批量铸造使用 ERC-1155，避免逐一铸造
- **版权保护**：链上存储作品哈希指纹，可用于侵权核查
- **内容审核**：铸造前需通过链下内容审核 API（NSFW 检测）
- **大文件处理**：视频等大文件仅存 IPFS CID，加密原文件仅授权用户可解密
- **Gas 代付**：考虑使用 ERC-4337 Account Abstraction 或 Biconomy 改善新用户体验
