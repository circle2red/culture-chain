# CultureChain — Static SSU Demo

> 一个可直接部署到 GitHub Pages 的纯静态文化作品交易 Demo

## 特性

- 作品价格统一使用 `SSU`
- 购买、铸造、库存变化都由浏览器本地 mock 状态驱动
- 不依赖钱包、合约、数据库或后端 API
- 可直接静态导出到 GitHub Pages

SSU 参数：

- `SSU_ADDRESS`: `0x4b451e0dafedaa119f9cb55eac19d7011051e1b7`
- `SSU_DECIMALS`: `18`
- Network: `Base`

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## 构建静态站

```bash
pnpm build
```

构建产物位于 `apps/web/out`。

## GitHub Pages

仓库已包含自动部署工作流：

- `.github/workflows/deploy-pages.yml`

行为：

- push 到 `main` 自动构建并发布
- 自动根据仓库名设置 `basePath`
- 发布目录为 `apps/web/out`

## 目录

- `apps/web`: Next.js 静态 demo
- `packages/ui`: 共用 UI 组件和全局样式
- `packages/config`: TS / ESLint 基础配置
