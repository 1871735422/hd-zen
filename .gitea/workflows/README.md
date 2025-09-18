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

### 3. 网络配置（国内服务器）

如果您的服务器在国内，可能无法直接访问 GitHub Actions，需要配置镜像源：

#### 方案 1：使用本地 Gitea 镜像（推荐）
```yaml
# 在 deploy.yaml 中使用以下配置
- name: 检出代码
  uses: http://localhost:60093/hd/checkout@v4

- name: 设置 Node.js
  uses: http://localhost:60093/hd/setup-node@v4
```

#### 方案 2：使用 Gitea 官方镜像源
```yaml
# 在 deploy.yaml 中使用以下配置
- name: 检出代码
  uses: https://gitea.com/actions/checkout@v4

- name: 设置 Node.js
  uses: https://gitea.com/actions/setup-node@v4
```

#### 方案 3：配置代理（如果有）
```bash
# 在服务器上配置代理环境变量
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
export NO_PROXY=localhost,127.0.0.1
```

### 4. 服务器环境准备
在服务器上安装必要的环境：

```bash
# 安装 Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

- 或使用 nvm 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash


# 安装 PM2
sudo npm install -g pm2

# 创建部署目录
sudo mkdir -p /opt/hd-zen-web/frontend
sudo chown $USER:$USER /opt/hd-zen-web

# 首次启动服务（可选）
cd /opt/hd-zen-web/frontend
# 上传文件后运行：PORT=3011 pm2 start .next/standalone/server.js --name hd-zen-web
```

### 5. PM2 服务管理

#### 基本 PM2 命令
```bash
# 启动服务
PORT=3011 pm2 start .next/standalone/server.js --name hd-zen-web

# 查看所有进程
pm2 list

# 查看进程详情
pm2 show hd-zen-web

# 查看日志
pm2 logs hd-zen-web

# 查看实时日志
pm2 logs hd-zen-web --lines 100 -f

# 重启服务
pm2 restart hd-zen-web

# 停止服务
pm2 stop hd-zen-web

# 删除服务
pm2 delete hd-zen-web

# 重新加载服务（零停机时间）
pm2 reload hd-zen-web

# 监控面板
pm2 monit
```

#### 开机自启动配置
```bash
# 保存当前 PM2 进程列表
pm2 save

# 生成开机启动脚本
pm2 startup

# 按照提示执行生成的命令（通常类似以下命令）
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# 再次保存进程列表
pm2 save
```

#### PM2 配置文件（推荐）
创建 `ecosystem.config.js` 文件进行更精细的管理：

```javascript
module.exports = {
  apps: [{
    name: 'hd-zen-web',
    script: '.next/standalone/server.js',
    cwd: '/opt/hd-zen-web',
    instances: 1, // 或者 'max' 使用所有 CPU 核心
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3011
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3011
    },
    log_file: '/var/log/pm2/hd-zen-web.log',
    out_file: '/var/log/pm2/hd-zen-web-out.log',
    error_file: '/var/log/pm2/hd-zen-web-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false, // 生产环境建议关闭
    ignore_watch: ['node_modules', '.next'],
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
```

使用配置文件启动：
```bash
# 使用配置文件启动
pm2 start ecosystem.config.js --env production

# 使用配置文件重启
pm2 restart ecosystem.config.js --env production
```

#### 日志管理
```bash
# 清理日志
pm2 flush

# 设置日志轮转
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
```

#### 健康检查和监控
```bash
# 检查服务状态
pm2 status

# 查看资源使用情况
pm2 monit

# 设置健康检查（在 ecosystem.config.js 中）
health_check_grace_period: 3000,
health_check_interval: 30000
```

### 6. 修改配置
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
6. **GitHub Actions 访问问题**（国内服务器常见）：
   ```bash
   # 错误信息：Get "https://github.com/actions/checkout/info/refs?service=git-upload-pack": read tcp ... connection reset by peer
   
   # 解决方案 1：使用本地 Gitea 镜像（推荐）
   # 将 actions/checkout@v4 改为 http://localhost:60093/hd/checkout@v4
   # 将 actions/setup-node@v4 改为 http://localhost:60093/hd/setup-node@v4
   
   # 解决方案 2：使用 Gitea 官方镜像源
   # 将 actions/checkout@v4 改为 https://gitea.com/actions/checkout@v4
   # 将 actions/setup-node@v4 改为 https://gitea.com/actions/setup-node@v4
   ```
7. **PM2 开机自启失败**：
   ```bash
   # 检查 PM2 启动脚本
   pm2 startup
   
   # 重新生成启动脚本
   pm2 unstartup
   pm2 startup
   
   # 检查 systemd 服务状态
   sudo systemctl status pm2-$USER
   ```
8. **PM2 进程异常退出**：
   ```bash
   # 查看错误日志
   pm2 logs hd-zen-web --err
   
   # 检查内存使用
   pm2 monit
   
   # 重启服务
   pm2 restart hd-zen-web
   ```
9. **端口占用问题**：
   ```bash
   # 检查端口占用
   sudo netstat -tlnp | grep 3011
   
   # 杀死占用进程
   sudo kill -9 <PID>
   ```

## 🎯 最佳实践

1. **分支策略**：使用 `main` 作为生产分支，`develop` 作为开发分支
2. **版本管理**：使用语义化版本标签（如 `v1.0.0`）
3. **环境隔离**：为不同环境使用不同的配置
4. **安全考虑**：敏感信息使用 Secrets 管理
5. **监控告警**：设置部署失败通知
6. **PM2 管理**：
   - 使用 `ecosystem.config.js` 配置文件管理进程
   - 设置内存限制防止内存泄漏
   - 配置日志轮转避免磁盘空间不足
   - 启用开机自启动确保服务可用性
   - 定期检查服务状态和资源使用情况

## 🚀 下一步

1. 根据您的实际环境修改配置
2. 配置必要的 Secrets
3. 测试工作流执行
4. 根据需要添加更多自动化步骤
5. **PM2 配置优化**：
   - 创建 `ecosystem.config.js` 配置文件
   - 配置开机自启动：`pm2 startup && pm2 save`
   - 设置日志轮转：`pm2 install pm2-logrotate`
   - 配置监控告警（可选）
6. **生产环境优化**：
   - 配置 Nginx 反向代理
   - 设置 SSL 证书
   - 配置防火墙规则
   - 设置备份策略

通过 Gitea Actions，您可以实现完全自动化的开发流程，从代码提交到生产部署，大大提高开发效率和代码质量！

