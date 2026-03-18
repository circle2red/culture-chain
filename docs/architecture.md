# 系统架构设计

## 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                               │
│         创作者 (卖家)              买家 / 收藏者            │
└───────────────────┬─────────────────────┬───────────────────┘
                    │                     │
┌───────────────────▼─────────────────────▼───────────────────┐
│                    前端应用 (Next.js 14)                    │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌─────────┐  │
│  │  /works  │  │ /works/[id] │  │  /mint   │  │/profile │  │
│  │  列表页  │  │   详情页    │  │ 铸造向导 │  │ 店铺页  │  │
│  └──────────┘  └──────────────┘  └──────────┘  └─────────┘  │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  RSC (Server Components) ── SEO + 数据获取           │   │
│  │  Client Components ─────── 钱包交互 / 表单 / Modal   │   │
│  └───────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            wagmi v2 + viem (Web3 交互层)            │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────┬─────────────────────────┬────────────────────┘
               │ HTTP API                │ RPC / Events
┌──────────────▼──────────┐   ┌──────────▼──────────────────┐
│    后端 API 服务          │   │      Polygon 区块链          │
│  (Next.js API Routes)   │   │                              │
│                         │   │  ┌─────────────────────┐    │
│  ┌───────────────────┐  │   │  │   CultureNFT         │    │
│  │   内容审核服务     │  │   │  │   (ERC-1155)         │    │
│  └───────────────────┘  │   │  ├─────────────────────┤    │
│  ┌───────────────────┐  │   │  │   Marketplace        │    │
│  │  搜索服务          │  │   │  │   (买卖/出价逻辑)    │    │
│  │  (Meilisearch)    │  │   │  ├─────────────────────┤    │
│  └───────────────────┘  │   │  │   RoyaltyRegistry    │    │
│  ┌───────────────────┐  │   │  │   (版税管理)         │    │
│  │  PostgreSQL        │  │   │  ├─────────────────────┤    │
│  │  (链下元数据缓存)  │  │   │  │   ShopRegistry       │    │
│  └───────────────────┘  │   │  │   (店铺注册)         │    │
└─────────────────────────┘   │  └─────────────────────┘    │
                               └─────────────────────────────┘
                                            │
                               ┌────────────▼────────────────┐
                               │     去中心化存储              │
                               │  IPFS (Pinata)  + Arweave   │
                               │  作品文件 / NFT Metadata     │
                               └─────────────────────────────┘
```

## 智能合约架构

### 合约关系图

```
ShopRegistry
    │ 注册/查询店铺
    ▼
CultureNFT (ERC-1155 + ERC-2981)
    │ 铸造/销毁 NFT
    │ 版税信息
    ▼
Marketplace
    │ 上架/下架/购买/出价
    │ 版税分配
    ▼
RoyaltyRegistry
    (可选：跨合约版税规则覆盖)
```

### CultureNFT 合约

```solidity
// 核心功能
- mint(uri, royaltyBps, supply)         // 铸造作品 NFT
- mintBatch(uris, royaltyBps, supplies) // 批量铸造
- burn(tokenId, amount)                 // 销毁（撤回作品）
- setApprovalForAll(marketplace, true)  // 授权市场合约

// 继承
- ERC1155             // 多供应量 NFT 标准
- ERC2981             // 版税标准（支持二级市场分成）
- ERC1155Supply       // 追踪总供应量
- Ownable             // 权限管理
- Pausable            // 紧急暂停
```

### Marketplace 合约

```solidity
// 核心功能
- listItem(tokenId, price, amount)  // 上架作品
- delistItem(listingId)             // 下架作品
- buyItem(listingId, amount)        // 购买（支付 MATIC）
- makeOffer(tokenId, price)         // 发出报价
- acceptOffer(offerId)              // 接受报价
- setFeeRate(bps)                   // 平台手续费（Owner）

// 费用分配（每笔交易）
// 成交价 = 平台手续费(2.5%) + 版税(创作者设定,最高10%) + 卖家收入
```

### ShopRegistry 合约

```solidity
// 核心功能
- registerShop(name, metadataURI)  // 注册店铺（每个地址一个）
- updateShopMeta(metadataURI)      // 更新店铺信息
- getShop(owner)                   // 查询店铺信息
- isRegistered(owner)              // 是否已注册
```

## 数据流

### 创作者发布作品

```
1. 创作者上传文件
   ├── 大文件(视频/高清图) → 加密后存 IPFS + 存 Arweave 备份
   └── 封面图/预览图 → 明文存 IPFS

2. 后端构建 Metadata JSON
   {
     "name": "作品名称",
     "description": "...",
     "image": "ipfs://CID/cover.jpg",
     "animation_url": "ipfs://CID/preview.mp4",  // 加密原文件
     "attributes": [
       { "trait_type": "type", "value": "painting" },
       { "trait_type": "artist", "value": "张三" }
     ],
     "content_hash": "sha256:...",   // 作品原文件哈希，用于侵权核查
     "license": "CC BY-NC 4.0"
   }

3. Metadata JSON 上传至 IPFS → 得到 metadataURI

4. 前端调用 CultureNFT.mint(metadataURI, royaltyBps, supply)
   → 链上记录所有权和版税信息

5. 后端监听 TransferSingle 事件
   → 写入 PostgreSQL 索引（供搜索和展示）
```

### 买家购买作品

```
1. 买家点击「购买」
2. 前端检查钱包余额 / 网络
3. 调用 Marketplace.buyItem(listingId, amount)
   → 转账 MATIC
   → 合约自动：扣手续费、打版税、转 NFT 所有权
4. 监听 ItemSold 事件
5. 如为加密内容：调用后端「授权解密」接口
   → 后端验证 NFT 持有状态
   → 返回解密密钥 / 下载链接（有效期限制）
```

## 数据库模型（链下缓存）

```
User              店铺/用户信息（冗余链上数据，提速）
├── id (address)
├── shopName
├── shopMetaURI
└── createdAt

Work              作品索引
├── tokenId
├── contractAddress
├── creator (address)
├── title, description
├── category (painting/book/film/music/other)
├── coverIPFS
├── metadataURI
├── supply, sold
├── priceWei
└── createdAt

Transaction       成交记录（链上事件镜像）
├── txHash
├── tokenId
├── from, to
├── priceWei
└── timestamp
```

## 安全设计

| 威胁 | 对策 |
|------|------|
| 重入攻击 | Checks-Effects-Interactions + ReentrancyGuard |
| 假冒 NFT | 铸造时记录 content_hash，前端展示核验状态 |
| 恶意内容 | 链下审核 API 在 metadataURI 生成前拦截 |
| 私钥泄露 | 不存储用户私钥，全程 SIWE + 钱包签名 |
| 合约升级风险 | 核心逻辑合约不可升级，仅参数合约可升级 |
| IPFS 内容丢失 | 关键文件同时 pin 到 Pinata + Arweave |
