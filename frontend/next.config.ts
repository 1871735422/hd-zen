import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 禁用图像优化，以避免与某些部署环境的兼容性问题
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'standalone', // For server deployment
  // 确保热加载正常工作
  experimental: {
    // Turbopack 默认启用热重载
  },
  // 开发环境配置
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      // 页面在开发中保持活动状态的时间
      maxInactiveAge: 25 * 1000,
      // 同时保持活动状态的页面数
      pagesBufferLength: 2,
    },
  }),
};

export default nextConfig;
