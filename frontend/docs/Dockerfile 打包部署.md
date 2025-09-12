# Dockerfile 打包部署技术分享

## 📋 目录

- [概述](#概述)
- [Dockerfile 构建](#dockerfile-构建)
- [镜像打包与传输](#镜像打包与传输)
- [服务器部署](#服务器部署)
- [自动化脚本](#自动化脚本)
- [最佳实践](#最佳实践)

## 概述

Dockerfile 是 Docker 镜像构建的核心，通过多阶段构建可以创建轻量级、安全的生产镜像。本分享将重点介绍从本地开发到服务器部署的完整流程。

### 核心优势

- **环境一致性**：开发、测试、生产环境完全一致
- **快速部署**：一次构建，到处运行
- **资源优化**：多阶段构建减少镜像大小
- **安全可靠**：非 root 用户运行，最小化攻击面
- **跨平台支持**：支持 ARM64 和 AMD64 架构

### ⚠️ 重要提示

**跨平台构建**：macOS M4 芯片（ARM64）构建的镜像无法直接在 Ubuntu AMD64 服务器上运行。需要使用 `docker buildx` 进行跨平台构建。

**网络问题**：如果遇到 TLS handshake timeout 错误，请检查网络连接或使用国内镜像源。

## Dockerfile 构建

### 当前项目 Dockerfile 解析

```dockerfile
# syntax=docker/dockerfile:1

FROM node:24-alpine AS base

# 依赖安装阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件并安装
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 生产运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### 构建命令

```bash
# 构建镜像（当前平台）
docker build -t hd-zen-web:latest .

# 跨平台构建（推荐）
docker buildx build --platform linux/amd64 -t hd-zen-web:latest .

# 多平台构建
docker buildx build --platform linux/amd64,linux/arm64 -t hd-zen-web:latest .

# 查看镜像大小
docker images hd-zen-web:latest

# 运行容器
docker run -p 3000:3000 hd-zen-web:latest
```

### 跨平台构建解决方案

```bash
# 1. 启用 buildx（如果未启用）
docker buildx create --name multiarch --use

# 2. 构建 AMD64 平台镜像（适用于 Ubuntu 服务器）
docker buildx build --platform linux/amd64 -t hd-zen-web:amd64 .

# 3. 导出 AMD64 镜像
docker buildx build --platform linux/amd64 -t hd-zen-web:amd64 --load .

# 4. 保存镜像
docker save hd-zen-web:amd64 -o hd-zen-web-latest.tar
gzip hd-zen-web-latest.tar
```

### 网络问题一键解决

```bash
# 一键设置国内镜像源
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null << EOF
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
EOF
sudo systemctl restart docker

# 构建镜像
docker buildx build --platform linux/amd64 -t hd-zen-web:amd64 --load .
```

### 构建优化技巧

```dockerfile
# 1. 使用 .dockerignore 减少构建上下文
# .dockerignore
node_modules
.next
.git
*.log
.env.local

# 2. 使用 Alpine 基础镜像减少大小
FROM node:24-alpine  # 而不是 node:24

# 3. 合并 RUN 指令减少层数
RUN apk add --no-cache libc6-compat && \
    corepack enable pnpm
```

## 镜像打包与传输

### 打包镜像

```bash
# 构建 AMD64 平台镜像（适用于 Ubuntu 服务器）
docker buildx build --platform linux/amd64 -t hd-zen-web:amd64 --load .

# 导出镜像为 tar 文件
docker save hd-zen-web:amd64 -o hd-zen-web-latest.tar

# 压缩镜像文件
gzip hd-zen-web-latest.tar

# 查看文件大小
ls -lh hd-zen-web-latest.tar.gz
```

### 镜像传输

```bash
# 使用 scp 传输到服务器
scp hd-zen-web-latest.tar.gz user@server:/opt/docker-images/

# 使用 rsync 传输（支持断点续传）
rsync -avz --progress hd-zen-web-latest.tar.gz user@server:/opt/docker-images/
```

## 服务器部署

### 服务器环境准备

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 创建应用目录
sudo mkdir -p /opt/hdzen
sudo chown $USER:$USER /opt/hdzen
```

### 镜像加载与运行

```bash
# 加载镜像
docker load -i hd-zen-web-latest.tar.gz

# 运行容器
docker run -d \
  --name hd-zen-web \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  hd-zen-web:amd64

# 查看运行状态
docker ps | grep hd-zen-web
docker logs hd-zen-web
```

### Docker Compose 部署（可选）

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    image: hd-zen-web:amd64
    container_name: hd-zen-web
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 1Panel 部署

#### 1. 上传镜像文件

```bash
# 通过 1Panel 文件管理上传镜像文件
# 路径：/opt/1panel/apps/docker/images/
# 文件：hd-zen-web-latest.tar.gz
```

#### 2. 加载镜像

```bash
# 在 1Panel 终端中执行
cd /opt/1panel/apps/docker/images/
docker load -i hd-zen-web-latest.tar.gz

# 验证镜像加载成功
docker images | grep hd-zen-web
```

#### 3. 创建容器

在 1Panel 容器管理中：

1. 点击 **创建容器**
2. 选择 **自定义镜像**
3. 镜像选择：`hd-zen-web:latest`
4. 容器名称：`hd-zen-web`
5. 端口映射：`3000:3000`
6. 环境变量：
   - `NODE_ENV=production`
7. 重启策略：`unless-stopped`
8. 点击 **确认** 创建容器

#### 4. 启动容器

1. 在容器列表中找到 `hd-zen-web`
2. 点击 **启动** 按钮
3. 查看容器状态和日志

#### 5. 访问应用

- 应用地址：`http://服务器IP:3000`
- 通过 1Panel 的 **网站** 功能可以配置域名和 SSL

## 自动化脚本

### 本地构建脚本

```bash
#!/bin/bash
# build.sh

echo "🚀 开始构建 HD-Zen 应用..."

# 设置国内镜像源
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null << EOF
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
EOF
sudo systemctl restart docker

# 构建镜像
docker buildx build --platform linux/amd64 -t hd-zen-web:amd64 --load .

# 导出镜像
docker save hd-zen-web:amd64 -o hd-zen-web-latest.tar
gzip hd-zen-web-latest.tar

echo "✅ 构建完成！"
```

### 服务器部署脚本

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 开始部署 HD-Zen 应用..."

# 检查镜像文件
if [ ! -f hd-zen-web-latest.tar.gz ]; then
    echo "❌ 镜像文件不存在：hd-zen-web-latest.tar.gz"
    exit 1
fi

# 停止旧容器
echo "⏹️ 停止旧容器..."
docker stop hd-zen-web 2>/dev/null || true
docker rm hd-zen-web 2>/dev/null || true

# 加载新镜像并启动
echo "📥 加载镜像..."
docker load -i hd-zen-web-latest.tar.gz

echo "▶️ 启动容器..."
docker run -d \
  --name hd-zen-web \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  hd-zen-web:amd64

echo "🎉 部署完成！"
echo "🌐 应用地址：http://localhost:3000"
```

### 一键部署脚本

```bash
#!/bin/bash
# one-click-deploy.sh

SERVER_USER="root"
SERVER_HOST="your-server.com"
SERVER_PATH="/opt/hdzen"

echo "🚀 一键部署 HD-Zen 应用..."

# 本地构建
./build.sh

# 传输到服务器
scp hd-zen-web-latest.tar.gz $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# 服务器部署
ssh $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && ./deploy.sh"

echo "🎉 部署完成！"
echo "🌐 应用地址：http://$SERVER_HOST:3000"
```

### 1Panel 部署脚本

```bash
#!/bin/bash
# 1panel-deploy.sh

echo "🚀 1Panel 部署 HD-Zen 应用..."

# 1Panel 镜像目录
PANEL_IMAGE_PATH="/opt/1panel/apps/docker/images"

# 停止并删除旧容器
echo "⏹️ 停止旧容器..."
docker stop hd-zen-web 2>/dev/null || true
docker rm hd-zen-web 2>/dev/null || true

# 加载镜像
echo "📥 加载镜像..."
cd $PANEL_IMAGE_PATH
docker load -i hd-zen-web-latest.tar.gz

# 创建并启动容器
echo "▶️ 创建并启动容器..."
docker run -d \
  --name hd-zen-web \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  hd-zen-web:amd64

echo "🎉 1Panel 部署完成！"
echo "🌐 应用地址：http://服务器IP:3000"
echo "📋 可在 1Panel 容器管理中查看容器状态"
```

## 最佳实践

### 镜像优化

```dockerfile
# 使用多阶段构建减少镜像大小
FROM node:24-alpine AS base
FROM base AS deps
FROM base AS builder
FROM base AS runner

# 使用 Alpine 基础镜像
FROM node:24-alpine  # 而不是 node:24

# 合并 RUN 指令减少层数
RUN apk add --no-cache libc6-compat && \
    corepack enable pnpm
```

### 安全配置

```dockerfile
# 使用非 root 用户运行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# 只复制必要的文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
```

### 资源限制

```bash
# 运行容器时限制资源
docker run -d \
  --name hd-zen-web \
  --memory="512m" \
  --cpus="0.5" \
  -p 3000:3000 \
  hd-zen-web:latest
```

## 总结

Dockerfile 部署流程的核心要点：

1. **多阶段构建**：减少镜像大小，提高安全性
2. **镜像打包**：使用 tar 文件传输，支持离线部署
3. **自动化脚本**：简化部署流程，减少人为错误
4. **资源管理**：合理配置内存和 CPU 限制

通过这套完整的部署方案，可以实现从开发到生产的无缝部署，确保应用的高可用性和稳定性。
