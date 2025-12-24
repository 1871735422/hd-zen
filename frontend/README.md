# Lumizen Web

## 项目概述

慧灯禅修网站 - 基于 Next.js 和 @mui/material 构建

## 🎯 项目架构：ISR + SSG 模式

本项目采用 **Next.js 15 ISR (Incremental Static Regeneration) + SSG (Static Site Generation)** 混合模式，相比传统的 SSR 和 CSR 具有显著优势：

### 📊 **性能对比**

| 特性             | ISR + SSG          | SSR                | CSR                 |
| ---------------- | ------------------ | ------------------ | ------------------- |
| **首次加载速度** | ⚡ 极快 (静态HTML) | 🐌 慢 (服务器渲染) | 🐌 慢 (JS下载+执行) |
| **SEO 友好性**   | ✅ 完美            | ✅ 完美            | ❌ 差               |
| **服务器压力**   | ✅ 极低            | ❌ 高              | ✅ 低               |
| **数据新鲜度**   | ✅ 15分钟自动更新  | ✅ 实时            | ✅ 实时             |
| **CDN 缓存**     | ✅ 完全支持        | ⚠️ 部分支持        | ✅ 支持             |
| **用户体验**     | ✅ 极佳            | ⚠️ 一般            | ⚠️ 一般             |

### 🚀 **ISR + SSG 核心优势**

#### 1. **极致性能**

- **构建时预生成**：所有页面在构建时生成静态 HTML
- **首次访问极快**：用户访问时直接返回静态文件，无需服务器渲染
- **CDN 友好**：静态文件可以完全缓存到 CDN，全球加速

#### 2. **智能数据更新**

- **15分钟 ISR**：数据自动在后台更新，无需重新部署
- **零停机更新**：用户访问时立即返回新数据
- **增量更新**：只更新变化的数据，不影响其他页面

#### 3. **SEO 完美支持**

- **静态 HTML**：搜索引擎可以直接抓取完整内容
- **元数据完整**：每个页面都有完整的 meta 标签
- **结构化数据**：支持所有 SEO 优化技术

#### 4. **服务器资源优化**

- **极低 CPU 使用**：大部分请求直接返回静态文件
- **内存友好**：不需要为每个请求分配内存
- **可扩展性强**：可以轻松处理高并发

#### 5. **开发体验优秀**

- **热重载**：开发时保持快速刷新
- **类型安全**：完整的 TypeScript 支持
- **组件化**：React 组件开发体验

### 🔄 **数据更新机制**

```
用户访问 → 静态HTML(立即返回) → 后台检查缓存是否过期 →
如果过期 → 重新获取API数据 → 更新静态文件 → 下次访问返回新数据
```

### 📈 **实际效果**

- **首页加载**：< 100ms（静态 HTML）
- **动态页面**：< 200ms（ISR 缓存）
- **数据更新**：15分钟内自动同步
- **服务器负载**：降低 90% 以上

## 技术栈

- **框架**: Next.js 15 (ISR + SSG)
- **UI 库**: @mui/material 7
- **语言**: TypeScript 5
- **构建工具**: Turbopack
- **包管理器**: pnpm
- **代码规范**: ESLint + Prettier
- **Git 钩子**: Husky + lint-staged + commitlint
- **数据源**: PocketBase API

## 主要功能

- 🎬 PC 端视频播放器支持键盘快捷键，便于快速控制播放进度与音量
- 📱 手机端提供独立的自适应 UI 组件
- 📚 阅读模式支持分页与全文切换、字号调节
- 🧭 课程、问答、资料等多业务入口统一管理

### 🎮 播放器键盘快捷键（仅视频播放器）

| 快捷键 | 功能说明        |
| ------ | --------------- |
| 空格键 | 播放 / 暂停     |
| ←      | 快退 10 秒      |
| →      | 快进 10 秒      |
| ↑      | 增加音量        |
| ↓      | 降低音量        |
| M      | 静音 / 取消静音 |
| F      | 进入 / 退出全屏 |

## 环境要求

- Node.js 版本需 >= v20，前往 [Node.js 官网](https://nodejs.org) 安装
- 使用 pnpm 作为包管理工具

```bash
npm install -g pnpm
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

#### 构建说明

- output: 'standalone'：
  独立部署（包含所有依赖），不会限制页面的渲染方式。

可以在同一个 Next.js 项目中：

- 某些页面用 SSG（静态生成，默认或 force-cache）
- 某些页面用 SSR（cache: 'no-store' 或 dynamic = 'force-dynamic'）
- 某些页面用 ISR（next: { revalidate: 秒数 }）
- 某些页面用 CSR（客户端渲染，直接用 useEffect 获取数据）

* output: 'export'：
  只能生成纯静态文件（SSG），不支持 SSR、ISR、API 路由等动态特性，只能静态托管。

### 启动生产服务器

```bash
pnpm start
```

### 代码检查

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# TypeScript 类型检查
pnpm type-check

# Prettier 格式化
pnpm format
```

### E2E 测试

项目使用 **Playwright** 进行端到端测试。

#### 快速开始

```bash
# 1. 安装浏览器（首次运行需要）
pnpm exec playwright install chromium

# 2. 运行所有 E2E 测试
pnpm test:e2e

# 3. 运行特定测试
pnpm test:e2e:video          # 视频播放和下载测试
pnpm test:e2e:consistency     # 资源一致性测试
pnpm test:e2e:home           # 首页、Ask、下载测试
pnpm test:e2e:qa             # QA 测试
pnpm test:e2e:search         # 搜索测试
```

#### 测试脚本说明

**本地开发环境测试：**

| 脚本                        | 说明                                     |
| --------------------------- | ---------------------------------------- |
| `pnpm test:e2e`             | 运行所有 E2E 测试（默认 localhost:3000） |
| `pnpm test:e2e:ui`          | 交互式 UI 模式运行测试                   |
| `pnpm test:e2e:debug`       | 调试模式                                 |
| `pnpm test:e2e:video`       | 只运行视频播放和下载测试                 |
| `pnpm test:e2e:consistency` | 只运行资源一致性测试                     |

**线上生产环境测试：**

| 脚本                       | 说明                                         |
| -------------------------- | -------------------------------------------- |
| `pnpm test:e2e:prod`       | 测试线上环境（https://zenweb.huidengzg.com） |
| `pnpm test:e2e:prod:ui`    | 线上环境 UI 模式                             |
| `pnpm test:e2e:prod:video` | 线上环境只测试视频功能                       |

**自定义环境测试：**

```bash
# Windows PowerShell
$env:PLAYWRIGHT_TEST_BASE_URL="https://your-custom-url.com"; pnpm test:e2e

# Linux/Mac
PLAYWRIGHT_TEST_BASE_URL="https://your-custom-url.com" pnpm test:e2e
```

### VS Code 配置

项目已包含 `.vscode` 配置，包含推荐的插件和编辑器设置。首次打开项目时，VS Code 会提示安装推荐的插件：

- ESLint - 代码检查
- Prettier - 代码格式化
- GitLens - Git 增强功能

## 贡献指南

### Git 提交规范

项目已配置 **Husky + commitlint** 自动检查提交信息格式，遵循 [常规提交规范](http://localhost:60093/public/hd-Gitea/src/branch/main/常规提交.md)。

#### 支持的提交类型

- `feat`: 新功能
- `fix`: 修复 Bug
- `build`: 构建或依赖改动
- `chore`: 杂项（如工具链调整）
- `ci`: CI/CD 配置
- `docs`: 文档更新
- `style`: 代码样式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关

#### 提交示例

```bash
git commit -m "feat(dashboard): 新增数据统计面板"
git commit -m "fix(login): 修复用户登录时密码验证问题"
git commit -m "style(ui): 优化按钮样式和布局"
git commit -m "docs(readme): 更新项目文档"
```

#### Git Hooks 配置

项目已配置以下 Git hooks：

- **pre-commit**: 自动运行 `lint-staged`，在提交前格式化代码
- **commit-msg**: 自动检查提交信息格式，确保符合规范

如果提交信息不符合规范，提交会被阻止并显示错误信息。

### Windows 环境特别说明

#### Git 配置

1. 确保 Git 配置了正确的换行符处理：

```bash
git config --global core.autocrlf false
```

### 贡献流程

1. 日常开发：在功能分支上进行频繁提交
2. 功能完成：更新 CHANGELOG.md 和 README.md
3. 提交 PR：将完整功能（包括代码和文档更新）作为一个 PR 提交
4. 代码审查：进行代码审查并合并到主分支

### 文档更新

- 提交 PR 前，请更新 CHANGELOG.md（参考[如何维护更新日志](http://localhost:60093/public/hd-Gitea/src/branch/main/如何维护更新日志.md)）
- 提交 PR 前，请更新 README.md

## 设备检测逻辑

### 检测策略

项目使用**统一的设备检测逻辑**，尽量保证服务端（SSR）和客户端渲染的一致性：

#### 0. 整体流程概览

- 服务端在 `layout.tsx` 中调用 `getDeviceTypeFromHeaders()`，得到 `serverDeviceType`。
- `serverDeviceType` 会传入：
  - `DeviceProvider` 的 `serverDeviceType`（客户端上下文初始值）。
  - `ResponsiveLayout` 的 `initialDeviceType`（首屏布局依据）。
- 客户端水合完成前：
  - `ResponsiveLayout` 强制使用 `initialDeviceType`，保证 SSR 与首帧 HTML 完全一致。
- 客户端水合完成后：
  - `DeviceProvider` 使用 UA、视口宽高和触摸能力再次检测设备类型。
  - 只在“SSR 判为 desktop，但客户端检测为 mobile”时纠正为 mobile，防止桌面窗口缩小时仍用 PC 布局。
  - 不会把 SSR 判为 mobile 的页面改回 desktop，避免出现“PC Header + 移动主体”的不一致。
  - Header 使用 `next/dynamic` 且 `ssr: false` 渲染，只在客户端根据最终设备类型选择 PC/移动版。

#### 1. **检测方式**

- **服务端**：
  - 优先使用 Client Hints：`sec-ch-viewport-width` / `sec-ch-viewport-height`
  - 使用 `Sec-CH-UA-Mobile` + User-Agent 判断是否为“移动/类移动设备”
- **客户端**：
  - 使用 `window.innerWidth` 和 `window.innerHeight`
  - 使用 `navigator.userAgent` + 触摸能力（`navigator.maxTouchPoints` / `ontouchstart`）

#### 2. **有效宽度计算**

```
如果 (移动/类移动设备 && 横屏 && 横屏宽度 <= 960px):
  有效宽度 = Math.min(宽度, 高度)  // 手机横屏，使用较短边
否则:
  有效宽度 = 宽度  // 平板横屏或竖屏，直接使用宽度
```

**说明**：

- **手机横屏**（如 iPhone）：横屏宽度通常 <= 960px，使用较短边（高度）作为有效宽度
- **平板横屏**（如 iPad Pro）：横屏宽度通常 > 960px，直接使用宽度，判断为 desktop

#### 3. **设备类型判断**

```
如果 有效宽度 > 960px:
  返回 'desktop'  // 大屏设备（平板横屏、桌面）
否则:
  如果 为移动/类移动设备(UA / Client Hints / 触摸):
    返回 'mobile'  // 手机或小屏触屏设备
  否则:
    返回 'desktop'  // 桌面浏览器缩小窗口或非触屏小窗口
```

#### 4. **关键断点**

- **960px**：判断 mobile 和 desktop 的分界点
- 大于 960px 的设备视为 desktop（包括 iPad Pro、平板横屏等）
- 小于等于 960px 且为移动/类移动设备（含触屏）视为 mobile

#### 5. **一致性保证**

- 服务端和客户端使用**同一套“有效宽度 + 移动特征”规则**
- 客户端在首次渲染时立即检测，如果与服务端不一致会更新（只影响 header，不影响页面内容）
- 支持窗口大小变化时的动态更新

### 示例场景

| 设备          | 视口尺寸  | UA   | 有效宽度          | 判断结果 |
| ------------- | --------- | ---- | ----------------- | -------- |
| iPhone 竖屏   | 393x852   | 移动 | 393px             | mobile   |
| iPhone 横屏   | 852x393   | 移动 | 393px (较短边)    | mobile   |
| iPad Pro 竖屏 | 1024x1366 | 移动 | 1024px            | desktop  |
| iPad Pro 横屏 | 1366x1024 | 移动 | 1366px (直接使用) | desktop  |
| 桌面浏览器    | 1920x1080 | 桌面 | 1920px            | desktop  |
| 桌面缩小窗口  | 800x600   | 桌面 | 800px             | desktop  |

## 监控与错误追踪

### 已集成功能

1. **Vercel Analytics** - 性能监控（已添加到 layout.tsx）
2. **Vercel Logs** - 错误日志自动收集（console.error 会自动记录）

### 如何查看 ZOD 验证错误

#### 方法 1：Vercel Dashboard（推荐）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Logs** 页面
4. 搜索：`[Zod Validation Error]`
5. 查看错误详情

#### 方法 2：Vercel CLI

```bash
# 安装 Vercel CLI（如果还没安装）
pnpm add -g vercel

# 查看实时日志
vercel logs --follow

# 过滤 ZOD 错误
vercel logs --follow | grep "Zod Validation Error"
```

## 常见问题解决

1. **Husky 脚本无法执行**：
   - 使用管理员权限运行终端
   - 检查 `.husky` 目录下的文件执行权限
   - 确保已运行 `chmod +x .husky/pre-commit .husky/commit-msg`

2. **提交信息格式错误**：
   - 确保提交信息符合规范：`type(scope): description`
   - 支持的 type：feat, fix, build, chore, ci, docs, style, refactor, perf, test
   - 示例：`git commit -m "feat(auth): 添加用户登录功能"`

3. **lint-staged 执行失败**：
   - 确保所有代码符合 ESLint 和 Prettier 规范
   - 运行 `pnpm lint:fix` 和 `pnpm format` 修复代码格式

4. **换行符问题**：
   - 确保已执行 `git config --global core.autocrlf false`
   - 重新克隆仓库
   - 或执行 `git add . --renormalize`

5. **Windows 下 pnpm build 可能会报错**，需到设置 打开 开发人员选项
   > `pnpm and output standalone return EPERM: operation not permitted, symlink` > [https://github.com/vercel/next.js/discussions/52244](https://github.com/vercel/next.js/discussions/52244)
