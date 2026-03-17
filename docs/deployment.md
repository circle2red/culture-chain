# 部署指南

## 环境说明

| 环境 | 区块链 | 域名 | 说明 |
|------|--------|------|------|
| 本地开发 | Hardhat 本地网络 | localhost:3000 | 开发调试 |
| 测试网 | Polygon Mumbai | staging.culturechain.io | 集成测试 |
| 生产 | Polygon Mainnet | culturechain.io | 正式上线 |

---

## 本地开发环境

```bash
# 1. 启动本地区块链 + 部署合约
cd apps/contracts
pnpm hardhat node          # 在 localhost:8545 启动
pnpm hardhat run scripts/deploy.ts --network localhost

# 2. 启动数据库
docker-compose up -d postgres meilisearch

# 3. 数据库迁移
pnpm db:migrate

# 4. 启动前端
cd apps/web
pnpm dev
```

---

## 合约部署（测试网 / 主网）

```bash
cd apps/contracts

# 测试网
pnpm hardhat run scripts/deploy.ts --network mumbai

# 主网（需多签确认）
pnpm hardhat run scripts/deploy.ts --network polygon
```

部署后将合约地址更新到 `packages/sdk/src/constants/addresses.ts`

**主网部署检查清单：**
- [ ] 合约安全审计通过
- [ ] 使用多签钱包（Gnosis Safe）作为 Owner
- [ ] 设置紧急暂停权限到安全多签地址
- [ ] 验证合约源码（Polygonscan）
- [ ] 设置正确的平台手续费地址

---

## 前端部署（Vercel）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署（首次会引导配置项目）
vercel --prod
```

**Vercel 环境变量配置：**
在 Vercel Dashboard → Settings → Environment Variables 中添加所有 `.env.example` 中的变量。

---

## 基础设施（Docker Compose 生产配置）

```yaml
# docker-compose.prod.yml
services:
  postgres:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: culturechain
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  meilisearch:
    image: getmeili/meilisearch:v1.6
    volumes:
      - meilidata:/meili_data
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}

  event-indexer:
    build: ./apps/indexer
    environment:
      RPC_URL: ${POLYGON_RPC_URL}
      DATABASE_URL: ${DATABASE_URL}
    restart: unless-stopped
```

---

## 监控与告警

- **合约监控**：Tenderly Alerts — 监听异常大额交易、合约暂停事件
- **应用监控**：Vercel Analytics + Sentry（错误追踪）
- **数据库监控**：PgBouncer 连接池 + 慢查询日志
- **IPFS 监控**：定期检查关键 CID 是否仍可访问

---

## 备份策略

| 数据 | 备份方式 | 频率 |
|------|----------|------|
| PostgreSQL | pg_dump → S3 | 每日 |
| IPFS 文件 | Pinata + Arweave 双备份 | 上传时实时 |
| 合约 ABI | 提交到 GitHub | 每次部署 |
