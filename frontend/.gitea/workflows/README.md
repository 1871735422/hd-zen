# Gitea Actions 配置说明

## 🚀 Gitea Actions 能做什么？

Gitea Actions 是一个强大的 CI/CD 平台，基于 GitHub Actions 兼容语法，可以帮您实现：

### 1. **持续集成 (CI)**
- ✅ **代码质量检查**：ESLint、Prettier、TypeScript 类型检查
- ✅ **自动化测试**：单元测试、集成测试
- ✅ **构建验证**：确保代码能够成功构建
- ✅ **多环境测试**：在不同 Node.js 版本下测试

### 2. **持续部署 (CD)**
- ✅ **构建产物上传**：构建 Next.js 项目并上传产物
- ✅ **文件传输**：通过 SCP 上传到服务器
- ✅ **自动部署**：使用 PM2 管理 Node.js 服务
- ✅ **健康检查**：部署后自动验证服务状态

### 3. **高级功能**
- ✅ **手动触发**：支持手动部署特定版本
- ✅ **环境管理**：支持多环境部署（staging/production）
- ✅ **回滚机制**：快速回滚到之前版本
- ✅ **通知集成**：部署状态通知

## 📁 工作流文件说明

### `deploy.yml` - 统一部署
**触发条件**：
- 推送到 `main` 分支（自动部署）
- 手动触发工作流（可选择环境）

**执行任务**：
- 构建 Next.js 项目
- 上传构建产物到服务器
- 使用 PM2 重启服务

## ⚙️ 配置步骤

### 1. 在 Gitea 中启用 Actions
1. 进入仓库设置页面：`your-gitea.com/owner/repo/settings`
2. 启用 "Enable Repository Actions"

### 2. 配置 Secrets
在仓库设置中添加以下密钥：

```
# 服务器部署认证
DEPLOY_HOST=your-server-ip
DEPLOY_USER=your-ssh-user
DEPLOY_SSH_KEY=your-private-ssh-key
```

### 3. 服务器环境准备
在服务器上安装必要的环境：

```bash
# 安装 Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 创建部署目录
sudo mkdir -p /opt/hd-zen-web
sudo chown $USER:$USER /opt/hd-zen-web

# 首次启动服务（可选）
cd /opt/hd-zen-web
# 上传文件后运行：pm2 start server.js --name hd-zen-web --port 3011
```

### 4. 修改配置
更新工作流文件中的以下配置：
- `DEPLOY_HOST`: 部署服务器地址

## 🔧 自定义配置

### 修改触发条件
```yaml
on:
  push:
    branches: [ main, develop, feature/* ]  # 添加更多分支
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点执行
```

### 添加测试步骤
```yaml
- name: 运行测试
  run: pnpm test
```

### 添加通知
```yaml
- name: 发送通知
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📊 监控和调试

### 查看工作流状态
- 在仓库的 "Actions" 标签页查看执行状态
- 点击具体任务查看详细日志

### 常见问题排查
1. **Runner 连接问题**：检查 act runner 是否正常运行
2. **权限问题**：确认 Secrets 配置正确
3. **构建失败**：检查 Node.js 版本和依赖配置
4. **部署失败**：检查服务器 SSH 连接和 PM2 状态
5. **PM2 服务不存在**：首次部署需要手动启动服务

## 🎯 最佳实践

1. **分支策略**：使用 `main` 作为生产分支，`develop` 作为开发分支
2. **版本管理**：使用语义化版本标签（如 `v1.0.0`）
3. **环境隔离**：为不同环境使用不同的配置
4. **安全考虑**：敏感信息使用 Secrets 管理
5. **监控告警**：设置部署失败通知

## 🚀 下一步

1. 根据您的实际环境修改配置
2. 配置必要的 Secrets
3. 测试工作流执行
4. 根据需要添加更多自动化步骤

通过 Gitea Actions，您可以实现完全自动化的开发流程，从代码提交到生产部署，大大提高开发效率和代码质量！

