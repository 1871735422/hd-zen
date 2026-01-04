# 前端部署到 Vercel（基于 GitHub 仓库）

本文一步一步说明，如何把本项目的前端（`frontend` 目录下的 Next.js 应用）部署到 Vercel，并通过关联的 GitHub 仓库实现自动化部署。

> 适用前提：
> - 你已有 GitHub 账号，并且已经创建了一个远程仓库
> - 本地已有完整的项目代码

---

## 一、准备 GitHub 仓库并推送代码

### 1. 整个项目仓库受 Git 管理

Vercel 关联的是「整个 Git 仓库」，`frontend` 只是仓库里的一个子目录。把整个项目仓库推送到 GitHub。

### 2. 关联 GitHub 仓库

在 GitHub 上用你的账号新建一个仓库，例如：

- 仓库地址：`https://github.com/your-username/your-repo.git`

然后在本地添加远程：

```bash
cd <你的项目根目录>

# 添加远程（以 origin2 为例）
git remote add origin2 https://github.com/your-username/your-repo.git
```

如果已经存在远程，但地址需要修改，可以使用：

```bash
git remote set-url origin2 https://github.com/your-username/your-repo.git
```

### 3. 推送代码到 GitHub

```bash
cd <你的项目根目录>
git push -u origin2 main
```

> 本文默认主分支为 `main`。如果你使用了其他分支名，请在命令中自行替换。

确认在 GitHub 网页上可以看到代码，特别是 `frontend` 目录。

---

## 二、Vercel 账号准备与基础设置

### 1. 注册 / 登录 Vercel

1. 打开 <https://vercel.com>
2. 使用 GitHub 账号登录（推荐直接「Continue with GitHub」）

### 2. 授权 Vercel 访问 GitHub 仓库

首次使用时，Vercel 会请求 GitHub 授权：

1. 在授权页面选择「Only select repositories」或「All repositories」
2. 至少勾选你要部署的仓库，例如：`your-username/your-repo`
3. 确认授权

授权完成后，Vercel 就可以拉取你的 GitHub 仓库代码。

---

## 三、在 Vercel 上导入项目

### 1. 新建项目

1. 登录 Vercel Dashboard：<https://vercel.com/dashboard>
2. 点击右上角 **New Project**
3. 选择 **Import Git Repository**
4. 在仓库列表中找到你的仓库，例如 `your-username/your-repo`
5. 点击 **Import**

### 2. 设置项目根目录（Root Directory）

本项目的前端在 `frontend` 子目录下，不在仓库根目录，所以需要指定 Root Directory：

1. 在导入向导中找到 **Root Directory** 选项
2. 选择 `frontend` 目录
   - 如果 Vercel 没有自动识别，手动选择 / 输入 `frontend`

设置完成后，Vercel 会以 `frontend` 作为 Next.js 项目的根目录来构建和部署。

---

## 四、构建与运行配置

在 Root Directory 选择为 `frontend` 后，Vercel 通常可以自动识别 Next.js 和 pnpm 配置。下面是项目相关的关键点，方便你核对或手动设置。

### 1. 包管理器与 Node 版本

当前前端项目：

- 使用 `pnpm` 作为包管理器（见 `frontend/.npmrc`）
- 使用 Next.js（见 `frontend/package.json` 和 `frontend/next.config.ts`）

Vercel 通常会自动选择合适的 Node 版本和 pnpm。如果需要，你也可以在 Vercel 中手动指定：

- 在项目设置中找到 **Settings → Build & Development Settings**
- 设置：
  - Node Version：建议与本地开发环境保持一致（例如 18 或 20）

### 2. 安装命令（Install Command）

默认情况下，Vercel 会自动执行：

```bash
pnpm install
```

一般情况下保持默认即可。如果你有特殊需求，可以在项目设置中手动填写：

```bash
pnpm install --frozen-lockfile
```

### 3. 构建命令（Build Command）

`frontend/package.json` 中定义了构建脚本：

```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev --turbopack",
    "start": "next start"
  }
}
```

在 Vercel 的 **Build Command** 中通常无需修改，默认使用：

```bash
pnpm build
```

即可触发 `next build`。

### 4. 输出目录（Output Directory）

对于 Next.js 项目，Vercel 不需要你手动填写 Output Directory，它会自动使用 `.next` 目录并根据 Next.js 配置完成部署。

> 注意：仓库里的 `next.config.ts` 中有 `output: 'standalone'`，这是为自托管准备的。部署到 Vercel 时，Vercel 会根据自身运行时处理，无需额外修改。

---

## 五、环境变量配置（可选）

如果前端项目依赖环境变量（例如 API 地址、监控服务配置等），需要在 Vercel 中配置对应的环境变量。

1. 打开 Vercel Dashboard
2. 进入你的项目 → **Settings**
3. 左侧选择 **Environment Variables**
4. 添加需要的变量：
   - `KEY`：变量名，例如 `NEXT_PUBLIC_API_BASE_URL`
   - `VALUE`：变量值，例如 `https://api.example.com`
   - `Environment`：通常勾选 `Production` 和 `Preview`
5. 保存后，重新部署（Redeploy）使环境变量生效。

> 注意：
> - 以 `NEXT_PUBLIC_` 开头的变量会暴露给浏览器端
> - 其他变量只在服务端 / 构建时可见

### 5.1 在 Vercel 中切换后端 API 地址

本项目前端通过环境变量来决定后端 API 地址。例如 PocketBase 的客户端初始化代码类似：

```ts
const pbUrl = process.env.NEXT_PUBLIC_PB_URL || process.env.NEXT_PB_URL;
```

你可以在 Vercel 的环境变量中为不同环境配置不同的后端地址，从而在不修改代码的情况下切换后端 API：

1. 打开 Vercel 项目 → **Settings → Environment Variables**
2. 添加或修改变量（例如）：
   - 生产环境（Production）：
     - `NEXT_PUBLIC_PB_URL = https://api.example.com`
     - `NEXT_PB_URL = https://api.example.com`
   - 预览环境（Preview）：
     - `NEXT_PUBLIC_PB_URL = https://staging-api.example.com`
     - `NEXT_PB_URL = https://staging-api.example.com`
3. 保存后，点击 **Redeploy** 或触发一次新的 Git 推送，让新的环境变量生效。

此后：

- 访问 Production 环境会调用 `https://api.example.com`
- 访问 Preview 环境会调用 `https://staging-api.example.com`

如果你在代码中使用了其他形如 `NEXT_PUBLIC_API_BASE_URL` 的变量，也可以用同样方式在 Vercel 中按环境分别配置，从而实现后端 API 的灵活切换。

---

## 六、首次部署流程

完成上面的配置后，在导入项目页面点击 **Deploy**：

1. Vercel 拉取 GitHub 仓库代码
2. 在 `frontend` 目录下执行 `pnpm install`
3. 执行 `pnpm build`（即 `next build`）
4. 构建成功后自动部署，生成一个预览 URL 和生产环境 URL

部署完成后，你可以：

- 在 Vercel Dashboard 中查看：
  - 构建日志（Build Logs）
  - 运行日志（Logs）
- 打开 Preview 或 Production 链接访问前端页面

---

## 七、后续自动部署（CI/CD）

当项目已经通过 GitHub 关联到了 Vercel 之后，后续流程非常简单：

1. 在本地修改代码并提交：

   ```bash
   git add .
   git commit -m "feat: update home page"
   ```

2. 推送到远程仓库：

   ```bash
   git push origin2 main
   ```

3. Vercel 监听到 GitHub 上的推送，会自动：
   - 拉取最新代码
   - 重新构建
   - 部署新版本

在 Vercel Dashboard 中，你可以看到每一次部署记录，并且可以：

- 查看对应的构建日志
- 回滚到某一次成功的部署版本

---

## 八、自定义域名（可选）

如果你希望使用自己的域名访问 Vercel 上的前端站点，可以在 Vercel 中绑定自定义域名。

1. 在项目页面点击 **Settings → Domains**
2. 点击 **Add**，输入你的域名，例如 `zen.huidengzg.com`
3. 按提示在你的域名服务商处配置 DNS 记录（通常为 CNAME 或 A 记录）
4. 等待 DNS 生效后，Vercel 会自动为该域名签发 HTTPS 证书

完成后，你就可以通过自定义域名访问 Vercel 上的前端应用。

---

## 九、常见问题与排查

### 1. 构建失败（Build Failed）

排查步骤：

1. 打开 Vercel 的构建日志，查看报错信息
2. 在本地执行：

   ```bash
   cd d:\Codes\hd-zen\frontend
   pnpm install
   pnpm build
   ```

   确认本地是否也会失败

3. 根据报错信息修复代码或依赖问题后，再次推送到 GitHub 触发新一轮部署

### 2. 环境变量在 Vercel 中未生效

1. 确认变量是否配置在正确的 Environment（Production / Preview）
2. 修改环境变量后需要重新部署（Redeploy）
3. 确认代码中使用的变量名是否和 Vercel 配置一致

### 3. 推送代码后 Vercel 没有触发部署

1. 检查是否推送到了 Vercel 关联的分支（通常是 `main` 或 `master`）
2. 在 Vercel 的项目设置中确认「Git Repository」是否指向正确的仓库与分支
3. 如有需要，可以手动点击 **Deploy** 触发一次构建

---

## 十、小结

使用 Vercel 部署本项目前端的大致步骤：

1. 在 GitHub 上准备好仓库，并推送代码
2. 在 Vercel 中使用 GitHub 账号登录并授权仓库访问
3. 导入项目时将 Root Directory 设置为 `frontend`
4. 确认构建命令为 `pnpm build`，必要时配置环境变量（包括后端 API 地址）
5. 点击部署，首次构建通过后即可访问 Vercel 提供的访问地址
6. 以后只需 `git push` 到关联分支（默认为 `main`），即可自动触发构建与部署

按照本文档一步一步操作，即可将前端成功部署到 Vercel，并通过 Vercel 环境变量灵活切换后端 API 地址。
