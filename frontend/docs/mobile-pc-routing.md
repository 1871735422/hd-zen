# 移动端/PC端路由实现方案

## 实现概述

采用**服务器端设备检测 + 条件渲染**的方式，实现 PC 和移动端使用不同的 UI 组件。

## 核心文件

### 1. 设备检测工具

- `app/utils/serverDeviceUtils.ts` - 服务器端设备检测
- `app/utils/deviceUtils.ts` - 客户端设备检测（React Hook）

### 2. 布局层

- `app/layout.tsx` - 根据设备类型渲染不同的 Header/Footer

### 3. 页面层

- `app/page.tsx` - 根据设备类型渲染不同的 Home 组件

### 4. 组件目录

```
app/components/
├── pc/              # PC 端专用组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Home.tsx
│
├── mobile/          # 移动端专用组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Home.tsx
│   ├── MobileNavigationDrawer.tsx
│   └── MobileSearchButton.tsx
│
└── shared/          # 共享组件（PC 和移动端共用）
```

## 工作原理

1. **服务器端检测**：在 Server Component 中通过 `headers()` 获取 User-Agent
2. **条件渲染**：根据设备类型返回不同的组件
3. **代码分割**：Next.js 自动为不同的组件生成独立的 chunk

## 优势

✅ **不加载多余代码**：移动端不会加载 PC 端的组件和样式
✅ **SEO 友好**：服务器端渲染，搜索引擎可以正常索引
✅ **性能优秀**：自动代码分割，按需加载
✅ **维护简单**：PC 和移动端代码完全分离

## 使用方法

### 在 Layout 中：

```tsx
const deviceType = await getDeviceTypeFromHeaders();
const isMobile = deviceType === 'mobile';

return (
  <>
    {isMobile ? <MobileHeader /> : <DesktopHeader />}
    <main>{children}</main>
    {isMobile ? <MobileFooter /> : <DesktopFooter />}
  </>
);
```

### 在页面中：

```tsx
const deviceType = await getDeviceTypeFromHeaders();
const isMobile = deviceType === 'mobile';

return isMobile ? <MobilePage /> : <DesktopPage />;
```

## 后续扩展

1. **创建更多页面**：为每个页面创建 PC 和移动端版本
2. **优化加载**：使用 `next/dynamic` 实现按需导入
3. **添加更多组件**：根据需要扩展移动端组件库

## 注意事项

- 所有使用 `headers()` 的组件必须是 Server Component
- 设备检测基于 User-Agent，不能 100% 准确
- 需要为每个页面都实现设备检测逻辑（或提取为 HOC）
