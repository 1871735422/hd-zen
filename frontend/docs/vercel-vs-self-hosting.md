## Next.js 自托管部署 vs Vercel 部署对比

### 1. 构建与发布流程

- 自托管（当前使用）
  - 使用 Gitea Actions 运行 `pnpm install` 和 `pnpm build`
  - 构建产物：`.next/standalone`、`.next/static`、`public`
  - 通过 `scp` 将构建产物同步到服务器 `/opt/hd-zen-web/`
  - 通过 `pm2` 启动或重启 `server.js`（端口 3011）
  - 所有 CI、发布流程由仓库内的 `.gitea/workflows/deploy-staging.yaml` 控制

- Vercel
  - 推送代码到远程仓库后，Vercel 自动拉取并构建
  - 无需手写 CI、scp、ssh，只需配置构建命令和环境变量
  - 提供 Preview/Production 环境、回滚、构建日志等完整托管能力

### 2. 运行时模型

- 自托管（当前使用）
  - 使用 Next.js `output: 'standalone'` 生成独立 Node 服务
  - 服务器上通过 `pm2` 长时间运行单一 `server.js` 进程
  - Nginx（或其他反向代理）将请求转发到 `localhost:3011`
  - 所有 SSR 页面和 API 都在这个常驻进程里处理

- Vercel
  - 将路由拆分为静态资源、Serverless Functions 或 Edge Functions
  - 没有常驻的 `server.js`，请求按路由触发对应函数
  - 自动在边缘节点分发与执行，内置高可用和弹性扩缩容

### 3. 缓存与 SSG/ISR 行为

- 自托管（当前使用）
  - 静态资源：`/_next/static/*` 使用带 hash 的文件名，Next 自动设置长缓存
  - HTML：默认由 Next 返回，一般不会强缓存，是否缓存取决于 Nginx/CDN 配置
  - App Router 中在 `app/layout.tsx` 使用 `export const dynamic = 'force-dynamic'`
    - 全局关闭 SSG/ISR，所有页面按请求动态渲染
    - 旧版本 SSG 生成的静态 HTML 会在重新构建后被新产物覆盖
  - 如需缓存 HTML，需要在 Nginx/CDN 中单独配置缓存策略

- Vercel
  - 根据 `revalidate`、`dynamic`、`generateStaticParams` 等配置自动管理缓存
  - 对 ISR 页面自动设置 `s-maxage`、`stale-while-revalidate` 等响应头
  - 使用 Vercel 自身的边缘缓存，在全球节点间共享缓存结果
  - 对静态和动态内容的缓存策略更加“开箱即用”，适合内容型站点

### 4. 运维与可观测性

- 自托管（当前使用）
  - 自己维护服务器：系统升级、CPU/内存/磁盘监控
  - 自己维护进程：`pm2` 配置、日志轮转、重启策略
  - 自行配置 HTTPS、Nginx、压缩、缓存头等
  - 灵活度高，但需要更多运维投入

- Vercel
  - 平台托管：自动扩容、函数实例管理、SSL 证书、域名绑定
  - 内置日志、监控、预览环境、回滚与分析工具
  - 使用简单，但部分底层细节不可完全自定义

### 5. 费用与适用场景

- 自托管（当前使用）
  - 适合有固定服务器资源、希望精细控制部署环境的场景
  - 高并发场景需要自行设计扩容方案与负载均衡

- Vercel
  - 按量计费，适合流量不稳定或增长中的项目
  - 对 Next.js 友好，适合快速迭代、频繁部署、需要全球加速的项目

### 小结

- 当前项目使用的是 **Next.js Standalone + Nginx/PM2 的自托管模式**
  - 构建、部署、缓存策略都由仓库和服务器配置控制
- Vercel 部署提供的是 **平台托管模式**
  - 更强的自动化构建、边缘缓存和运维能力，但可定制度相对较低

