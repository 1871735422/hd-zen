# 移动端 px to vw 使用指南

## 📦 已安装

- ✅ `postcss-px-to-viewport` (PostCSS 插件，用于 CSS 文件自动转换)
- ✅ 工具函数 `pxToVw()` (用于 MUI sx prop)

## 🎯 使用方法

### 方法1：使用 `pxToVw()` 函数（推荐）

**适用场景**：MUI sx prop 中的内联样式

```tsx
import { pxToVw } from '@/app/utils/mobileUtils';

<Box
  sx={{
    width: pxToVw(340), // 340px → 90.667vw
    padding: pxToVw(20), // 20px → 5.333vw
    fontSize: pxToVw(24), // 24px → 6.4vw
  }}
/>;
```

### 方法2：使用预定义尺寸常量

```tsx
import { mobileSizes } from '@/app/utils/mobileUtils';

<Box
  sx={{
    padding: mobileSizes.spacing.lg, // 20px → 5.333vw
    fontSize: mobileSizes.fontSize.lg, // 18px → 4.8vw
    borderRadius: mobileSizes.borderRadius.lg, // 12px → 3.2vw
  }}
/>;
```

### 方法3：PostCSS 自动转换（CSS 文件）

如果你在 `.css` 或 `.module.css` 文件中写样式：

```css
/* app/components/mobile/home.module.css */
.container {
  width: 340px; /* 自动转换为 90.667vw */
  padding: 20px; /* 自动转换为 5.333vw */
  font-size: 24px; /* 自动转换为 6.4vw */
}
```

## 📝 完整示例

查看 `app/components/mobile/Home.tsx`：

```tsx
import { pxToVw, mobileSizes } from '@/app/utils/mobileUtils';

export default function Home() {
  return (
    <Box
      sx={{
        paddingTop: pxToVw(60),
        paddingBottom: pxToVw(40),
        fontSize: pxToVw(28),
      }}
    >
      <Typography sx={{ fontSize: mobileSizes.fontSize.base }}>内容</Typography>
    </Box>
  );
}
```

## 🔧 配置说明

### PostCSS 配置

文件：`postcss.config.js`

```javascript
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375, // 设计稿宽度
      unitPrecision: 3, // 保留3位小数
      viewportUnit: 'vw',
      exclude: [/node_modules/, /\.pc\./, /\.desktop\./],
    },
  },
};
```

### 工具函数

文件：`app/utils/mobileUtils.ts`

提供 `pxToVw()` 函数和常用尺寸常量。

## ✅ 优势

1. **直接写设计稿尺寸**：不用手动计算
2. **自动适配**：所有手机宽度都能适配
3. **PC端不受影响**：只在移动端生效
4. **类型安全**：TypeScript 支持

## 📊 常用尺寸对照

| px  | vw    | 用途     |
| --- | ----- | -------- |
| 8   | 2.133 | 小间距   |
| 12  | 3.2   | 圆角     |
| 14  | 3.733 | 小字体   |
| 16  | 4.267 | 基础字体 |
| 20  | 5.333 | 标准间距 |
| 24  | 6.4   | 中等字体 |
| 28  | 7.467 | 大字体   |
| 32  | 8.533 | 大间距   |

## 🚀 快速开始

1. 导入工具函数：

```tsx
import { pxToVw, mobileSizes } from '@/app/utils/mobileUtils';
```

2. 在移动端组件中使用：

```tsx
<Box sx={{ width: pxToVw(340) }} />
```

3. 设计稿 375px 宽度的任意值都可以直接用！

## ⚠️ 注意事项

1. **只在移动端组件使用**：PC 端组件不受影响
2. **设计稿基准 375px**：基于 iPhone 标准宽度
3. **MUI sx 需要使用函数**：PostCSS 不会转换 sx 中的 px
