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
- **Git 钩子**: Husky + lint-staged
- **数据源**: PocketBase API

## 主要功能

-

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

### VS Code 配置

项目已包含 `.vscode` 配置，包含推荐的插件和编辑器设置。首次打开项目时，VS Code 会提示安装推荐的插件：

- ESLint - 代码检查
- Prettier - 代码格式化
- GitLens - Git 增强功能

## 贡献指南

### Git 提交规范

遵循 [常规提交规范](http://localhost:60093/public/hd-Gitea/src/branch/main/常规提交.md)，示例：

```bash
git commit -m "feat(dashboard): 新增数据统计面板"
git commit -m "fix(login): 修复用户登录时密码验证问题"
git commit -m "style(ui): 优化按钮样式和布局"
```

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

## 常见问题解决

1. husky 脚本无法执行：

   - 使用管理员权限运行终端
   - 检查 `.husky` 目录下的文件执行权限

2. 换行符问题：

   - 确保已执行 `git config --global core.autocrlf false`
   - 重新克隆仓库
   - 或执行 `git add . --renormalize`

3. Windows 下 pnpm build 可能会报错，需到设置 打开 开发人员选项
   > `pnpm and output standalone return EPERM: operation not permitted, symlink` > [https://github.com/vercel/next.js/discussions/52244](https://github.com/vercel/next.js/discussions/52244)
