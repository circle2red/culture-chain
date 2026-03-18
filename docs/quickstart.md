# 快速启动指南

本文档帮助你在本地从零启动 CultureChain 开发环境。
**当前阶段：Phase 2 完成**，所有页面使用 mock 数据，无需真实区块链或数据库即可运行。

---

## 环境要求

| 工具 | 最低版本 | 安装方式 |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm install -g pnpm` |
| Git | — | 系统自带或官网下载 |
| Docker Desktop | — | 可选，用于 PostgreSQL/Meilisearch |

---

## 模式一：极速启动（推荐新人，5 分钟）

> 全程使用 mock 数据，**不需要** Docker / 数据库 / 区块链节点 / IPFS。

```bash
# 1. 克隆项目
git clone https://github.com/your-org/culture-chain.git
cd culture-chain

# 2. 安装依赖
pnpm install

# 3. 创建本地环境变量
cp .env.local.example .env.local
```

打开 `.env.local`，只需填写一个值：

```bash
# 免费申请：https://cloud.walletconnect.com → 创建 Project → 复制 Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **不想注册 WalletConnect？** 填任意字符串也能启动，只是钱包连接弹窗可能报错，
> 浏览页面和 mock 数据不受影响。

```bash
# 4. 启动前端
pnpm dev
```

打开 http://localhost:3000 — 完成 🎉

### 当前可访问的页面

| 路由 | 内容 |
|------|------|
| `/` | 首页（Hero + 分类 + 精选作品） |
| `/works` | 作品列表（分类筛选、排序） |
| `/works/1` | 作品详情（作品 tokenId 1-8 可访问） |
| `/mint` | 铸造向导（四步骤表单，mock 提交） |
| `/profile/0x1234` | 创作者店铺页（任意地址可访问） |

---

## 模式二：完整开发环境

> 接入真实数据库 + 搜索，为 Phase 3 API 开发做准备。

### 步骤 1：启动数据库服务

```bash
# 启动 PostgreSQL + Meilisearch（后台运行）
docker compose up -d

# 验证启动成功
docker compose ps
# 应看到 postgres(healthy) 和 meilisearch(running)
```

### 步骤 2：数据库初始化

```bash
# 生成 Prisma Client 并推送 schema
pnpm db:migrate

# 可选：打开可视化管理界面（运行后访问 http://localhost:5555）
pnpm db:studio
```

### 步骤 3：启动本地区块链

```bash
# 终端 A：启动本地 Hardhat 节点
pnpm --filter @culture-chain/contracts hardhat node

# 终端 B：部署合约到本地节点
pnpm contracts:deploy:local
```

部署完成后，将输出的合约地址填入 `.env.local`：

```bash
NEXT_PUBLIC_CONTRACT_CULTURE_NFT=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_MARKETPLACE=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_CONTRACT_SHOP_REGISTRY=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
# （以上为示例地址，实际以终端输出为准）
```

### 步骤 4：连接本地节点的 MetaMask 配置

1. MetaMask → 设置 → 网络 → 添加网络
2. 填入：
   - 网络名称：`Hardhat Local`
   - RPC URL：`http://127.0.0.1:8545`
   - 链 ID：`31337`
   - 货币符号：`ETH`
3. 导入测试账户（Hardhat 默认账户，**仅用于本地测试**）：
   - 私钥：`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - 余额：10,000 ETH

### 步骤 5：启动前端

```bash
pnpm dev
```

---

## 常用开发命令

```bash
# ── 前端 ─────────────────────────────────────────────────────
pnpm dev                     # 启动所有包的开发服务器
pnpm build                   # 构建生产版本
pnpm typecheck               # TypeScript 类型检查

# ── 合约 ─────────────────────────────────────────────────────
pnpm contracts:test          # 运行 76 个合约单元测试
pnpm contracts:compile       # 编译合约，生成 TypeChain 类型
pnpm contracts:deploy:local  # 部署到本地 Hardhat 节点
pnpm contracts:deploy:mumbai # 部署到 Polygon Mumbai 测试网

# ── 数据库 ───────────────────────────────────────────────────
pnpm db:migrate              # 运行数据库迁移
pnpm db:studio               # 打开 Prisma Studio 可视化界面
pnpm db:push                 # 直接推送 schema（开发快速迭代用）

# ── 代码质量 ─────────────────────────────────────────────────
pnpm lint                    # ESLint 检查
pnpm format                  # Prettier 格式化所有文件
```

---

## Mock 数据说明

当前 `apps/web/src/lib/mockData.ts` 提供 8 件示例作品（涵盖画作、书籍、影视、音乐），
覆盖以下场景：

| 场景 | 示例 |
|------|------|
| 正常在售 | tokenId 1, 2, 3, 5, 6, 7, 8 |
| 已售罄 | tokenId 4（supply=200, sold=200） |
| 无限量发行 | tokenId 7（supply=0） |
| 高价作品 | tokenId 8（3.0 MATIC） |

### 替换为真实 API

页面中所有 mock 调用都通过注释标记了待替换位置：

```typescript
// TODO: 替换为真实 API 调用
const works = MOCK_WORKS.filter(...)
```

Phase 3 开始后逐步替换为：

```typescript
const res  = await fetch("/api/v1/works?category=" + category)
const json = await res.json()
const works: Work[] = json.data
```

---

## 常见问题

**Q：启动时报 `invalid project ID`**
> WalletConnect project ID 无效。前往 https://cloud.walletconnect.com 免费申请，或用空字符串（仅影响钱包弹窗）。

**Q：图片不显示，控制台报 `hostname not configured`**
> `next.config.ts` 中 `remotePatterns` 缺少对应域名。开发时已添加 `images.unsplash.com`。

**Q：`pnpm dev` 后访问页面报 500**
> 检查 `.env.local` 是否存在。若没有，执行 `cp .env.local.example .env.local`。

**Q：合约测试在 WSL2 下失败**
> 在 `apps/contracts` 目录内单独运行 `pnpm hardhat test`，而不要用根目录的 `pnpm test`。

**Q：`mcopy` 编译错误**
> `hardhat.config.ts` 中已设置 `evmVersion: "cancun"`，如仍报错请确认 OpenZeppelin 版本为 v5.x。
