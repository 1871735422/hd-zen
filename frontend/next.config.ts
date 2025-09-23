import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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
