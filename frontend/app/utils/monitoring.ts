/**
 * 监控服务工具
 *
 * 用于集成外部监控服务（如 Sentry）
 *
 * @example
 * ```typescript
 * // app/layout.tsx 或应用入口
 * import { setupMonitoring } from '@/app/api/validators';
 *
 * // 如果使用 Sentry
 * import * as Sentry from '@sentry/nextjs';
 * setupMonitoring({
 *   captureException: (error, context) => {
 *     Sentry.captureException(error, { extra: context });
 *   },
 * });
 * ```
 */

/**
 * 监控服务配置示例
 *
 * 选项 1: Sentry（推荐）
 * ```typescript
 * import * as Sentry from '@sentry/nextjs';
 * import { setupMonitoring } from '@/app/api/validators';
 *
 * setupMonitoring({
 *   captureException: (error, context) => {
 *     Sentry.captureException(error, {
 *       tags: { source: 'zod_validation' },
 *       extra: context,
 *     });
 *   },
 * });
 * ```
 *
 * 选项 2: 自定义监控端点
 * ```typescript
 * import { setupMonitoring } from '@/app/api/validators';
 *
 * setupMonitoring({
 *   captureException: async (error, context) => {
 *     await fetch('/api/monitoring', {
 *       method: 'POST',
 *       body: JSON.stringify({ error, context }),
 *     });
 *   },
 * });
 * ```
 *
 * 选项 3: 钉钉/企业微信通知
 * ```typescript
 * import { setupMonitoring } from '@/app/api/validators';
 *
 * setupMonitoring({
 *   captureException: async (error, context) => {
 *     await fetch('https://oapi.dingtalk.com/robot/send?access_token=xxx', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({
 *         msgtype: 'text',
 *         text: {
 *           content: `🔴 Zod 验证失败\n${error.message}\n\n详情: ${JSON.stringify(context, null, 2)}`,
 *         },
 *       }),
 *     });
 *   },
 * });
 * ```
 */

// 导出空对象，仅用于文档说明
export {};
