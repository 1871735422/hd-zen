# 模块化 E2E 测试说明

## 测试模块结构

测试已按功能模块拆分，可以单独运行或整体运行：

### 1. 首页、Ask、下载测试 (`home-ask-download.spec.ts`)
- 首页测试：检查首页加载和主要导航链接
- Ask 页面测试：测试问答收集页面
- 下载页面测试：测试所有下载链接

### 2. QA 测试 (`qa.spec.ts`)
- QA 列表页面测试
- QA 详情页面测试
- 所有相关链接测试

### 3. 课程和参考资料测试 (`course-reference.spec.ts`)
- 课程列表页面测试
- 课程详情页面测试
- 参考资料列表页面测试
- 参考资料详情页面测试
- 所有相关链接测试

> **注意**：课程和参考资料测试已合并为一个文件

### 4. 搜索测试 (`search.spec.ts`)
- 搜索页面基本功能
- 搜索功能测试
- 搜索结果链接测试

## 运行测试

### 本地环境测试

```bash
# 测试单个模块（默认使用 headed 模式，可以看到浏览器）
pnpm test:e2e:home                # 首页、Ask、下载
pnpm test:e2e:qa                  # QA 模块
pnpm test:e2e:course-reference    # 课程和参考资料模块（已合并）
pnpm test:e2e:search              # 搜索模块

# 运行所有测试
pnpm test:e2e
```

> **注意**：所有测试默认使用 **headed 模式**（可以看到浏览器运行），方便录屏和观察测试过程。

### 线上环境测试

```bash
# 测试单个模块（线上环境，默认 headed 模式）
pnpm test:e2e:prod:home              # 首页、Ask、下载
pnpm test:e2e:prod:qa                # QA 模块
pnpm test:e2e:prod:course-reference  # 课程和参考资料模块（已合并）
pnpm test:e2e:prod:search            # 搜索模块

# 运行所有测试（线上环境）
pnpm test:e2e:prod
```

### 测试模式说明

**默认模式**：所有测试默认使用 **headed 模式**（可以看到浏览器），方便录屏和观察。

如果需要使用其他模式：

```bash
# UI 模式（交互式界面）
pnpm test:e2e:ui

# 无头模式（不显示浏览器，执行更快）
playwright test --project=chromium

# Debug 模式（调试用）
pnpm test:e2e:debug

# 线上环境 UI 模式
pnpm test:e2e:prod:ui
```

> **录屏提示**：由于默认使用 headed 模式，你可以使用系统自带的录屏工具（如 Windows 的 Xbox Game Bar、Mac 的 QuickTime）来录制测试过程。

## 环境变量配置

### 测试 URL 配置

```bash
# 自定义测试 URL
$env:TEST_QA_URL="/qa/1/lesson1"; pnpm test:e2e:qa
$env:TEST_COURSE_URL="/course/1/lesson1"; pnpm test:e2e:course-reference
$env:TEST_REFERENCE_URL="/reference/1/lesson1"; pnpm test:e2e:course-reference
```

### 限制测试数量

```bash
# 限制 QA 测试的课时数量
$env:MAX_QA_LESSONS="3"; pnpm test:e2e:qa

# 限制课程测试的课时数量
$env:MAX_COURSE_LESSONS="3"; pnpm test:e2e:course-reference

# 限制参考资料测试的课时数量
$env:MAX_REFERENCE_LESSONS="3"; pnpm test:e2e:course-reference
```

# 限制下载测试的下载数量
$env:MAX_DOWNLOADS="5"; pnpm test:e2e:home

# 限制搜索测试的结果数量
$env:MAX_SEARCH_RESULTS="3"; pnpm test:e2e:search
```

## 测试功能特性

### ✅ 链接测试
- 自动发现页面上的所有可点击链接
- 测试链接的可访问性
- 验证页面加载正常

### ✅ 下载测试
- 测试下载链接是否可访问
- 验证下载事件是否触发
- 检查下载文件信息

### ✅ 页面健康检查
- 检查页面是否正常加载
- 检测错误页面（404、Error 等）
- 验证页面内容渲染

### ✅ 导航测试
- 测试页面间的导航
- 验证 URL 路由正确
- 检查页面状态

## 测试策略

### 链接点击策略
1. 获取页面所有链接
2. 过滤可见和有效的链接
3. 排除外部链接（可选）
4. 逐个点击并验证
5. 记录测试结果

### 错误处理
- 使用 try-catch 捕获错误
- 记录详细的错误信息
- 允许部分链接失败（阈值控制）
- 继续执行其他测试

### 性能优化
- 限制测试链接数量
- 设置合理的超时时间
- 串行执行确保稳定性
- 支持环境变量控制

## 注意事项

1. **测试时间**：完整测试可能需要较长时间，建议使用环境变量限制测试数量
2. **网络依赖**：测试需要网络连接访问资源
3. **环境差异**：本地和线上环境的响应时间可能不同
4. **资源消耗**：下载测试会消耗带宽，注意限制下载数量

## 故障排查

### 测试失败：链接无法点击
- 检查链接选择器是否正确
- 确认链接是否可见
- 增加等待时间

### 测试失败：页面加载超时
- 检查网络连接
- 增加超时时间
- 检查服务器状态

### 测试失败：下载不工作
- 检查下载链接是否有效
- 确认浏览器下载设置
- 检查下载事件监听

## 扩展测试

可以根据需要添加更多测试：

1. **性能测试**：测量页面加载时间
2. **响应式测试**：测试不同设备尺寸
3. **无障碍测试**：检查键盘导航、屏幕阅读器支持
4. **多浏览器测试**：在 Firefox、WebKit 中运行
