# E2E 测试说明

本目录包含使用 Playwright 编写的端到端测试，用于测试视频播放、下载功能和资源一致性。

## 测试框架

- **Playwright**: 用于 E2E 测试
- **优势**:
  - 支持真实浏览器环境（Chromium, Firefox, WebKit）
  - 自动等待机制，测试更稳定
  - 支持视频录制、截图、网络拦截等高级功能
  - 对 Next.js 支持良好

## 测试文件

### 1. `video-playback-download.spec.ts`

测试视频播放和下载功能：

- ✅ 检查每个视频是否可以播放
- ✅ 测试视频播放按钮点击
- ✅ 验证下载按钮是否存在
- ✅ 测试下载功能是否正常
- ✅ 遍历所有视频进行批量测试

### 2. `resource-consistency.spec.ts`

测试资源一致性和可访问性：

- ✅ 验证侧边栏标题与内容标题的一致性
- ✅ 检查所有视频资源 URL 是否可访问
- ✅ 验证下载链接是否有效

## 运行测试

### 安装浏览器

首次运行前需要安装 Playwright 浏览器：

```bash
pnpm exec playwright install
```

或者只安装 Chromium：

```bash
pnpm exec playwright install chromium
```

### 运行所有 E2E 测试

```bash
pnpm test:e2e
```

### 运行特定测试文件

```bash
# 只测试视频播放和下载
pnpm test:e2e:video

# 只测试资源一致性
pnpm test:e2e:consistency
```

### 交互式运行（UI 模式）

```bash
pnpm test:e2e:ui
```

### 有头模式（可以看到浏览器）

```bash
pnpm test:e2e:headed
```

### 调试模式

```bash
pnpm test:e2e:debug
```

## 配置测试 URL

测试默认使用以下 URL，可以通过环境变量自定义：

```bash
# Windows PowerShell
$env:TEST_QA_URL="/qa/1/lesson1"; pnpm test:e2e

# Linux/Mac
TEST_QA_URL="/qa/1/lesson1" pnpm test:e2e
```

或者在 `playwright.config.ts` 中修改 `baseURL`。

## 测试环境要求

1. **开发服务器**: 测试会自动启动开发服务器（如果未运行）
2. **网络连接**: 需要能够访问视频资源 URL
3. **时间**: 完整测试可能需要几分钟时间

## 测试策略

### 视频播放测试

1. 等待视频播放器加载（ArtPlayer 或原生 video 元素）
2. 点击播放按钮
3. 检查视频是否可以播放（`readyState >= 2`）
4. 验证播放事件是否触发

### 下载测试

1. 查找下载按钮
2. 监听下载事件
3. 点击下载按钮
4. 验证下载是否开始
5. 检查下载文件名是否合理

### 标题一致性测试

1. 从侧边栏提取所有标题
2. 逐个点击侧边栏项
3. 获取当前内容的标题
4. 比较标题是否匹配（允许格式差异）

### 资源可访问性测试

1. 提取页面中的所有视频 URL（播放和下载）
2. 使用 HEAD 请求检查每个 URL 是否可访问
3. 记录无法访问的资源

## 注意事项

1. **测试数量限制**: 为了控制测试时间，默认只测试前 3-5 个视频
2. **网络延迟**: 测试中包含了适当的等待时间来处理网络延迟
3. **环境差异**: 不同环境的资源 URL 可能不同，需要相应调整
4. **CI/CD**: 在 CI 环境中，建议设置 `retries: 2` 来处理偶发的网络问题

## 故障排查

### 测试失败：找不到播放器

- 检查页面是否正确加载
- 确认视频播放器组件的选择器是否正确
- 增加等待时间

### 测试失败：下载不工作

- 检查下载按钮是否可见
- 确认下载 URL 是否正确
- 检查浏览器下载设置

### 测试失败：标题不一致

- 检查侧边栏和内容的 DOM 结构是否变化
- 确认标题提取逻辑是否正确
- 查看控制台输出的详细信息

## 扩展测试

可以根据需要添加更多测试：

1. **移动端测试**: 使用移动设备视口测试
2. **性能测试**: 测量视频加载时间
3. **错误处理测试**: 测试无效视频 URL 的处理
4. **多浏览器测试**: 在 Firefox、WebKit 中运行测试

## 参考文档

- [Playwright 官方文档](https://playwright.dev)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Next.js 测试指南](https://nextjs.org/docs/app/building-your-application/testing)
