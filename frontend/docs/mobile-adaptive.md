# 移动端自适应方案

## 配置说明

已配置 PostCSS 自动将 px 转换为 vw，**仅在移动端生效**。

### 设计稿基准

- 宽度：375px
- 直接写设计稿的 px 值即可

### 转换公式

```
vw = (设计稿px / 375) × 100
```

例如：20px → 5.33vw

## 使用方法

### ✅ 在移动端组件中使用

```tsx
// app/components/mobile/YourComponent.tsx
import Box from '@mui/material/Box';

export default function YourComponent() {
  return (
    <Box
      sx={{
        // 直接写 px，会自动转换为 vw
        width: '340px', // → 90.67vw
        padding: '20px', // → 5.33vw
        fontSize: '24px', // → 6.4vw
        borderRadius: '12px', // → 3.2vw
      }}
    >
      内容
    </Box>
  );
}
```

### ❌ 在 PC 端组件中使用

PC 端组件不会自动转换，继续使用原来的方式：

```tsx
// app/components/pc/YourComponent.tsx
<Box sx={{ width: { lg: 1240, xl: 1400 } }} />
```

## 如何排除转换

如果需要某个值不转换（保持 px），可以：

1. 使用 `ignore-vw` 类名：

```tsx
<Box className='ignore-vw' sx={{ width: '20px' }} />
```

2. 在样式对象中使用数学表达式：

```tsx
<Box sx={{ width: 'calc(20px + 10vw)' }} />
// calc() 中的 px 不会转换
```

## 配置详情

查看 `postcss.config.js`：

```javascript
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375, // 设计稿宽度
      unitPrecision: 3, // 保留3位小数
      viewportUnit: 'vw', // 转换为 vw
      selectorBlackList: ['.pc'], // PC 端排除
      minPixelValue: 1, // 最小转换值
      exclude: [/node_modules/, /\.pc\./],
    },
  },
};
```

## 常用尺寸对照表

| 设计稿 (px) | 转换后 (vw) | 示例     |
| ----------- | ----------- | -------- |
| 10          | 2.667       | 小间距   |
| 12          | 3.2         | 圆角     |
| 14          | 3.733       | 小字体   |
| 16          | 4.267       | 小字体   |
| 18          | 4.8         | 中等字体 |
| 20          | 5.333       | 标准间距 |
| 24          | 6.4         | 中等字体 |
| 28          | 7.467       | 大字体   |
| 32          | 8.533       | 大间距   |
| 40          | 10.667      | 更大间距 |

## 注意事项

1. **仅在移动端生效**：PC 端组件（`components/pc/`）不会被转换
2. **单位必须是字符串**：`'20px'` 而不是数字 `20`
3. **某些属性不转换**：如 `line-height: 1.5` 不会被转换
4. **媒体查询不转换**：`@media` 中的 px 保持原样

## 验证方法

在浏览器开发者工具中：

1. 打开移动端模式（如 iPhone 12 Pro）
2. 检查元素的 computed styles
3. 应该看到 `vw` 单位而不是 `px`

例如：

```css
/* 源代码 */
width: '340px'

/* 编译后 */
width: 90.667vw
```
