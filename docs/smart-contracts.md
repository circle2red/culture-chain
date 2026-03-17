# 智能合约设计文档

## 合约清单

| 合约 | 功能 | 标准 |
|------|------|------|
| `CultureNFT` | 文化作品 NFT 发行 | ERC-1155, ERC-2981 |
| `Marketplace` | 交易市场（上架/购买/报价） | — |
| `ShopRegistry` | 创作者店铺注册 | — |

---

## CultureNFT.sol

### 设计要点

- 使用 **ERC-1155** 而非 ERC-721：支持同一作品发行多份（如限量 100 本书），降低 Gas 成本
- 实现 **ERC-2981** 版税标准：每个 tokenId 可设独立版税率
- `content_hash` 字段存储作品原文件的 SHA-256 哈希，用于链上版权核查

### 接口定义

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICultureNFT {
    struct WorkInfo {
        address creator;       // 创作者地址
        uint96  royaltyBps;    // 版税率 (basis points, 1% = 100)
        uint256 maxSupply;     // 最大发行量 (0 = 无限)
        string  contentHash;   // 作品原文件哈希 (sha256:...)
        WorkCategory category; // 作品分类
    }

    enum WorkCategory {
        Painting,  // 0
        Book,      // 1
        Film,      // 2
        Music,     // 3
        Other      // 4
    }

    event WorkMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 supply,
        string  metadataURI
    );

    // 铸造单个作品
    function mint(
        string memory metadataURI,
        uint96  royaltyBps,    // 最大 1000 (10%)
        uint256 supply,        // 发行数量，0 表示无限
        string memory contentHash,
        WorkCategory category
    ) external returns (uint256 tokenId);

    // 批量铸造
    function mintBatch(
        string[] memory metadataURIs,
        uint96[] memory royaltyBps,
        uint256[] memory supplies,
        string[] memory contentHashes,
        WorkCategory[] memory categories
    ) external returns (uint256[] memory tokenIds);

    // 销毁（创作者可撤回未售出的作品）
    function burn(uint256 tokenId, uint256 amount) external;

    // 查询作品信息
    function getWorkInfo(uint256 tokenId) external view returns (WorkInfo memory);

    // 版权核查：传入文件哈希，返回对应 tokenId（0 表示未注册）
    function verifyContent(string memory contentHash) external view returns (uint256 tokenId);
}
```

### 版税计算

```
版税金额 = 成交价 × royaltyBps / 10000

示例：
  成交价 100 MATIC，royaltyBps = 500 (5%)
  版税 = 100 × 500 / 10000 = 5 MATIC → 打入创作者钱包
```

---

## Marketplace.sol

### 设计要点

- 支持**固定价格**和**报价**两种交易模式
- 每笔成交自动分配：平台手续费 + 版税 + 卖家收款
- 使用 Pull Payment 模式：版税和手续费先记账，用户主动提取，避免 Gas 炸弹

### 费用分配

```
成交价 P
  └── 平台手续费 = P × platformFeeBps / 10000   (默认 2.5%)
  └── 版税       = P × royaltyBps / 10000       (创作者设定)
  └── 卖家收入   = P - 平台手续费 - 版税
```

### 接口定义

```solidity
interface IMarketplace {
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 pricePerUnit;  // wei
        uint256 amount;        // 剩余可购数量
        bool    active;
    }

    struct Offer {
        uint256 tokenId;
        address buyer;
        uint256 pricePerUnit;
        uint256 amount;
        uint256 expiresAt;     // Unix timestamp
        bool    active;
    }

    event ItemListed(uint256 indexed listingId, uint256 indexed tokenId, address seller, uint256 price);
    event ItemSold(uint256 indexed listingId, address buyer, uint256 amount, uint256 totalPrice);
    event OfferMade(uint256 indexed offerId, uint256 indexed tokenId, address buyer, uint256 price);
    event OfferAccepted(uint256 indexed offerId);

    // 上架（需先 setApprovalForAll）
    function listItem(
        uint256 tokenId,
        uint256 pricePerUnit,
        uint256 amount
    ) external returns (uint256 listingId);

    // 下架
    function delistItem(uint256 listingId) external;

    // 修改价格
    function updatePrice(uint256 listingId, uint256 newPrice) external;

    // 购买（附带 MATIC）
    function buyItem(uint256 listingId, uint256 amount) external payable;

    // 发出报价（附带 MATIC 锁定）
    function makeOffer(
        uint256 tokenId,
        uint256 amount,
        uint256 expiresAt
    ) external payable returns (uint256 offerId);

    // 接受报价（卖家调用）
    function acceptOffer(uint256 offerId) external;

    // 取消报价（买家调用，退款）
    function cancelOffer(uint256 offerId) external;

    // 提取收益（Pull Payment）
    function withdraw() external;

    // 查询待提取金额
    function pendingWithdrawal(address account) external view returns (uint256);
}
```

---

## ShopRegistry.sol

### 接口定义

```solidity
interface IShopRegistry {
    struct Shop {
        address owner;
        string  name;         // 店铺名（唯一）
        string  metadataURI;  // IPFS URI，包含头像、简介、Banner
        uint256 createdAt;
        bool    verified;     // 官方认证创作者
    }

    event ShopRegistered(address indexed owner, string name);
    event ShopUpdated(address indexed owner, string metadataURI);

    // 注册店铺（每个地址只能注册一次）
    function registerShop(string memory name, string memory metadataURI) external;

    // 更新店铺元数据
    function updateShopMeta(string memory metadataURI) external;

    // 查询店铺
    function getShop(address owner) external view returns (Shop memory);
    function getShopByName(string memory name) external view returns (Shop memory);
    function isRegistered(address owner) external view returns (bool);

    // 官方认证（Admin Only）
    function verifyShop(address owner) external;
}
```

---

## NFT Metadata 格式

遵循 OpenSea Metadata Standard，扩展文化作品字段：

```json
{
  "name": "山水之间 No.3",
  "description": "水墨山水系列第三幅，宣纸水墨，60×90cm",
  "image": "ipfs://QmXxx.../cover.jpg",
  "animation_url": "ipfs://QmXxx.../preview.mp4",
  "external_url": "https://culturechain.io/works/123",

  "attributes": [
    { "trait_type": "category",    "value": "Painting" },
    { "trait_type": "medium",      "value": "水墨" },
    { "trait_type": "dimensions",  "value": "60×90cm" },
    { "trait_type": "year",        "value": "2024" },
    { "trait_type": "edition",     "value": "1/10" }
  ],

  "content_hash": "sha256:a1b2c3...",
  "license": "CC BY-NC 4.0",
  "encrypted_content": {
    "ipfs_cid": "QmYyy...",
    "encryption": "AES-256-GCM",
    "access_condition": "holds tokenId 42"
  }
}
```

---

## 测试策略

### 单元测试覆盖场景

```
CultureNFT
  ✓ 成功铸造，返回正确 tokenId
  ✓ 版税率超过 10% 时 revert
  ✓ 铸造超过 maxSupply 时 revert
  ✓ 非创作者无法销毁
  ✓ contentHash 可正确查询

Marketplace
  ✓ 未授权时上架 revert
  ✓ 购买价格不足时 revert
  ✓ 费用分配金额正确（手续费 + 版税 + 卖家）
  ✓ 下架后无法购买
  ✓ 报价过期后无法接受
  ✓ 取消报价正确退款
  ✓ withdraw 正确提取收益

ShopRegistry
  ✓ 重复注册 revert
  ✓ 重名 revert
  ✓ 非 Owner 无法 verify
```

---

## 部署配置

```typescript
// hardhat.config.ts 关键配置
networks: {
  polygon: {
    url: process.env.POLYGON_RPC_URL,
    accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    gasPrice: 'auto',
  },
  mumbai: {
    url: 'https://rpc-mumbai.maticvigil.com',
    accounts: [process.env.DEPLOYER_PRIVATE_KEY],
  },
}
```

**部署顺序**：
1. `ShopRegistry`
2. `CultureNFT`
3. `Marketplace`（构造函数传入 `CultureNFT` 地址）
4. 调用 `CultureNFT.setMarketplaceApproval(Marketplace.address)`
