import { NextResponse } from 'next/server';

export async function GET() {
  // 只返回客户端需要的非敏感配置
  return NextResponse.json({
    pbUrl: process.env.NEXT_PUBLIC_PB_URL,
    appName: process.env.NEXT_PUBLIC_APP_NAME || '慧灯之光',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  });
}
