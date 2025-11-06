# 移动端 QA 课时页面实现

## 概述

实现了移动端的 QA 课时详情页面（`/qa/[slug]/[lesson]`），使其能够像 PC 端一样通过点击侧边栏切换问题，并自动更新 URL 参数。同时实现了侧边栏的折叠/展开功能，提供更好的移动端体验。

## 改动文件

### 1. `app/components/mobile/MobileQaSidebar.tsx`

**改动内容**：

- 添加了 `onSelect?: (index: number) => void` 可选回调 prop
- 支持两种工作模式：
  - **回调模式**：当传入 `onSelect` 时，点击项目调用回调函数（用于课时内问题切换）
  - **链接模式**：当未传入 `onSelect` 时，使用 Next.js `Link` 进行导航（用于课程级别导航）
- 保持向后兼容性，现有的 `MobileQaPage` 组件无需修改
- **注意**：组件本身不包含折叠/展开逻辑，由外部容器控制，保持组件的纯净和可复用性

### 2. `app/components/mobile/MobileQaLessonPage.tsx`（新建）

**功能**：

- 移动端的 QA 课时页面客户端包装器
- 参考 PC 端的 `QaClientWrapper.tsx` 实现
- 使用 `useRouter`、`usePathname`、`useSearchParams` 管理路由和 URL 参数
- 点击侧边栏时通过 `setCurrentIndex` 更新状态
- 通过 `useEffect` 监听状态变化，自动更新 URL 参数（格式：`?tab=question1`）
- 集成 `VideoPlayer` 组件显示视频内容
- 提供上一个/下一个导航按钮

**侧边栏折叠/展开功能**：

- 默认折叠状态，只显示"本课其他问题"按钮（宽度 56px）
- 点击按钮展开，显示完整侧边栏（宽度 128px）
- 使用平滑的过渡动画（0.3s ease-in-out）
- 按钮设计（根据设计稿 1:1 实现）：
  - 白色背景（`rgba(255, 255, 255, 0.9)`），圆角 10px
  - 高度 97px，带阴影效果
  - 竖排文字"本课其他问题"（`writing-mode: vertical-rl`）
  - 箭头图标随展开/折叠状态旋转 180 度
  - 点击反馈：轻微缩放动画（`scale(0.98)`）
- 折叠/展开逻辑在父组件实现，不影响 `MobileQaSidebar` 的复用

**核心特性**：

```typescript
// 折叠状态管理
const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

// URL 参数自动同步
useEffect(() => {
  const params = new URLSearchParams(searchParams?.toString());
  params.set('tab', `question${currentIndex + 1}`);
  router.replace(search ? `${pathname}?${search}` : pathname, {
    scroll: false,
  });
}, [currentIndex, pathname, router, searchParams]);
```

### 3. `app/qa/[slug]/[lesson]/page.tsx`

**改动内容**：

- 添加设备类型检测：`const deviceType = await getDeviceTypeFromHeaders()`
- 根据设备类型渲染不同组件：
  - 移动端：渲染 `MobileQaLessonPage`
  - PC 端：渲染 `QaClientWrapper`
- 保持数据获取逻辑统一

## URL 参数格式

- **课时页面**：`/qa/{courseOrder}/lesson{lessonOrder}?tab=question{questionOrder}`
- 示例：`/qa/1/lesson1?tab=question1`

## 用户体验

1. 用户访问 `/qa/1/lesson1` 时：
   - 默认显示第一个问题
   - 侧边栏默认折叠，只显示"本课其他问题"按钮
2. 点击折叠按钮：
   - 侧边栏展开，显示所有问题列表
   - 按钮内的箭头图标旋转 180 度
3. 点击侧边栏的问题项时：
   - 立即切换到对应问题的视频
   - URL 自动更新为 `?tab=question{N}`
   - 不刷新页面，保持流畅的用户体验
4. 可以通过上一个/下一个按钮导航
5. 直接访问带参数的 URL（如 `?tab=question3`）会显示对应的问题

## 技术要点

- **服务端设备检测**：使用 Next.js App Router 的服务端设备检测
- **客户端状态管理**：URL 参数与组件状态自动同步
- **交互一致性**：保持移动端和 PC 端交互逻辑一致
- **组件复用**：`VideoPlayer`、`MobileQaSidebar` 等组件在不同场景下复用
- **外部控制状态**：折叠/展开逻辑在父组件实现，不影响 `MobileQaSidebar` 的复用性
- **CSS 过渡动画**：使用 `transition` 实现平滑的宽度、透明度、可见性变化
- **响应式设计**：使用 `pxToVw` 进行移动端适配，确保在不同屏幕尺寸下的一致性

## 动画效果

1. **宽度动画**：侧边栏容器从 56px 到 128px 的平滑过渡
2. **透明度动画**：侧边栏内容的淡入/淡出效果
3. **高度动画**：使用 `max-height` 实现内容的展开/折叠
4. **旋转动画**：箭头图标的 180 度旋转
5. **按压反馈**：按钮点击时的缩放效果
