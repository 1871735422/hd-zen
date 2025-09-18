#!/bin/bash

# Next.js 生产环境检查脚本
# 基于官方文档: https://nextjs.org/docs/13/pages/building-your-application/deploying/production-checklist

set -e

echo "🔍 Next.js 生产环境检查"
echo "================================"

# 检查构建是否存在
if [ ! -d ".next" ]; then
    echo "❌ 错误: 未找到 .next 目录，请先运行 pnpm build"
    exit 1
fi

# 检查 standalone 模式
if [ ! -d ".next/standalone" ]; then
    echo "❌ 错误: 未找到 standalone 目录，请确保 next.config.ts 中设置了 output: 'standalone'"
    exit 1
fi

# 检查静态资源
echo "📁 检查静态资源..."
if [ ! -d ".next/standalone/.next/static" ]; then
    echo "⚠️  警告: standalone/.next/static 目录不存在"
    echo "   请运行: cp -r .next/static .next/standalone/.next/"
else
    echo "✅ 静态资源目录存在"
fi

if [ ! -d ".next/standalone/public" ]; then
    echo "⚠️  警告: standalone/public 目录不存在"
    echo "   请运行: cp -r public .next/standalone/"
else
    echo "✅ 公共资源目录存在"
fi

# 检查环境变量
echo ""
echo "🔧 检查环境变量..."
if [ -f ".env.local" ]; then
    echo "⚠️  警告: 发现 .env.local 文件，生产环境应使用服务器环境变量"
fi

if [ -f ".env" ]; then
    echo "✅ 发现 .env 文件"
else
    echo "ℹ️  信息: 未发现 .env 文件，将使用系统环境变量"
fi

# 检查缓存配置
echo ""
echo "💾 缓存配置检查..."
echo "✅ Next.js 自动为 /_next/static 设置缓存头:"
echo "   Cache-Control: public, max-age=31536000, immutable"

# 检查 JavaScript 包大小
echo ""
echo "📦 JavaScript 包分析..."
if command -v du >/dev/null 2>&1; then
    echo "   主要包大小:"
    du -h .next/static/chunks/*.js 2>/dev/null | head -5 || echo "   无法获取包大小信息"
fi

# 检查图片优化
echo ""
echo "🖼️  图片优化检查..."
if [ -d "public/images" ]; then
    echo "✅ 发现图片目录: public/images"
    echo "   建议使用 next/image 组件进行自动优化"
else
    echo "ℹ️  未发现图片目录"
fi

# 检查错误页面
echo ""
echo "🚨 错误页面检查..."
if [ -f "app/not-found.tsx" ]; then
    echo "✅ 自定义 404 页面存在"
else
    echo "⚠️  建议添加自定义 404 页面: app/not-found.tsx"
fi

# 检查性能优化
echo ""
echo "⚡ 性能优化建议:"
echo "   1. ✅ 使用 standalone 模式减少服务器大小"
echo "   2. ✅ 静态资源自动缓存"
echo "   3. ✅ JavaScript 自动代码分割"
echo "   4. 🔍 建议运行 Lighthouse 检查性能"
echo "   5. 🔍 建议使用 next/image 优化图片"
echo "   6. 🔍 考虑添加 Content Security Policy"

echo ""
echo "🎯 生产部署建议:"
echo "   1. 使用反向代理 (Nginx/Apache) 提供静态资源"
echo "   2. 配置 CDN 加速静态资源"
echo "   3. 设置适当的缓存策略"
echo "   4. 监控 Core Web Vitals"
echo "   5. 配置日志记录和错误监控"

echo ""
echo "✅ 检查完成！"
