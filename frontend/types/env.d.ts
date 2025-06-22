declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 应用配置
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_APP_VERSION: string;
      NEXT_PUBLIC_ENVIRONMENT: 'development' | 'production' | 'test';

      // API 配置
      NEXT_PUBLIC_API_KEY: string;
      API_SECRET_KEY: string;
      NEXT_PUBLIC_API_BASE_URL: string;

      // 数据库配置
      DATABASE_URL: string;

      // 第三方服务
      NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
      STRIPE_SECRET_KEY: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;

      // 环境配置
      NODE_ENV: 'development' | 'production' | 'test';

      // 其他配置
      [key: string]: string | undefined;
    }
  }
}

export { };

