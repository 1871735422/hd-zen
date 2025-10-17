# 字体子集化工具

## 📌 使用 subset-fonts.cjs 脚本

### 前置条件

```bash
# 安装依赖
pnpm add -D fontmin

# 准备字体文件
mkdir -p .temp-fonts
# 放置 TTF 字体到: .temp-fonts/北方行书.ttf
```

### 运行脚本

```bash
node scripts/subset-fonts.cjs
```

---

## 📝 生成的字体使用

### 输出文件

```
public/fonts/subsets/北方行书.woff2  (~5-10KB)
```

### 更新 CSS

```css
@font-face {
  font-family: 'BeiFangXingShu';
  src: url('/fonts/subsets/北方行书.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

---

## 🔍 验证结果

```bash
# 检查文件大小
ls -lh public/fonts/subsets/北方行书.woff2

# 浏览器验证
# 打开 DevTools > Network > 搜索 "北方行书"
# 应该看到 ~5-10KB 的加载大小
```

---

## ⚠️ 常见问题

**脚本报错？**

- 确保 TTF 字体文件在 `.temp-fonts/北方行书.ttf`
- 检查 fontmin 依赖是否安装：`pnpm add -D fontmin`

**字体不显示？**

- 清除浏览器缓存
- 检查 CSS 路径：`/fonts/subsets/北方行书.woff2`
- 验证字体文件存在

**生成文件太大？**

- 检查 CHARS 变量是否包含不必要的字符
- 确保使用 TTF 源文件而非 WOFF2

---

## 📊 效果

| 项目     | 大小    |
| -------- | ------- |
| 原始文件 | 2 MB    |
| 子集文件 | 5-10 KB |
| 缩小比例 | 99.5%   |
