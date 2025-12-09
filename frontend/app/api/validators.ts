import { z } from 'zod';

// Base schema
const BaseModelSchema = z.object({
  id: z.string(),
  created: z.string(),
  updated: z.string(),
});

// Category schema
export const CategorySchema = BaseModelSchema.extend({
  name: z.string(),
  title: z.string(),
  description: z.string().optional(),
  displayOrder: z.number(),
  slug: z.string(),
  isActive: z.boolean(),
});

// Course schema
export const CourseSchema = BaseModelSchema.extend({
  title: z.string(),
  description: z.string().optional(),
  cover: z.string().optional(),
  categoryId: z.string(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

// CourseTopic schema
export const CourseTopicSchema = BaseModelSchema.extend({
  courseId: z.string(),
  article_title: z.string(),
  article_alias: z.string(),
  ordering: z.number(),
  article_introtext: z.string().optional(),
  article_fulltext: z.string().optional(),
  article_summary: z.string().optional(),
  tags: z.string().optional(),
  url: z.string().optional(),
  url_cover: z.string().optional(),
  url_mp3: z.string().optional(),
  url_duration: z.string().optional(),
  url_downmp3: z.string().optional(),
  url_mp3size: z.string().optional(),
  url_downpdf: z.string().optional(),
  url_pdfsize: z.string().optional(),
  content_id: z.string().optional(),
  asset_id: z.string().optional(),
  // Legacy fields
  title: z.string(),
  description: z.string().optional(),
  topicOrder: z.number(),
  hasVideo: z.boolean(),
  hasAudio: z.boolean(),
  hasText: z.boolean(),
  hasQA: z.boolean(),
  isActive: z.boolean(),
});

// TagRelation schema
export const TagRelationSchema = BaseModelSchema.extend({
  courseTitle: z.string(),
  courseOrder: z.string(),
  courseActive: z.boolean(),
  topicTitle: z.string(),
  topicOrder: z.string(),
  topicActive: z.boolean(),
  tags: z.array(z.string()),
});

// QuestionResult schema (extends Media)
export const QuestionResultSchema = BaseModelSchema.extend({
  courseTitle: z.string(),
  topicTitle: z.string(),
  topicOrder: z.number(),
  questionTitle: z.string(),
  questionContent: z.string().optional(),
  questionOrder: z.number(),
  questionCreated: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  // Media fields
  title: z.string(),
  url_hd: z.string().optional(),
  url_sd: z.string().optional(),
  url_image: z.string().optional(),
  mp4_duration: z.string().optional(),
  url_mp3: z.string().optional(),
  mp3_duration: z.string().optional(),
  url_downmp4: z.string().optional(),
  mp4_size: z.string().optional(),
  url_downmp3: z.string().optional(),
  mp3_size: z.string().optional(),
  summary: z.string().optional(),
});

/**
 * 监控服务接口（可选）
 * 如果需要集成 Sentry 或其他监控服务，请实现此接口
 */
export interface MonitoringService {
  captureException(error: Error, context?: Record<string, unknown>): void;
}

// 全局监控服务（可在初始化时设置）
let monitoringService: MonitoringService | null = null;

/**
 * 设置监控服务（可选）
 * 在应用启动时调用，例如：setupMonitoring({ captureException: Sentry.captureException })
 */
export function setupMonitoring(service: MonitoringService): void {
  monitoringService = service;
}

/**
 * 验证辅助函数
 *
 * @param schema - Zod schema
 * @param data - 待验证的数据
 * @param errorMessage - 错误消息前缀
 * @returns 验证后的数据
 *
 * @example
 * ```typescript
 * const course = validateWithZod(
 *   CourseSchema,
 *   record,
 *   `Invalid course data (id: ${record.id})`
 * );
 * ```
 *
 * 开发环境：错误会在控制台显示，页面会立即报错
 * 生产环境：错误会记录到日志，如果配置了监控服务，会触发告警
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    // 提取详细错误信息
    let errorDetails = String(error);
    const zodErrors: Array<{ path: string; message: string }> = [];

    if (error instanceof z.ZodError && error.errors) {
      errorDetails = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      zodErrors.push(
        ...error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        }))
      );
    }

    // 构建错误对象
    const validationError = new Error(`${errorMessage}: ${errorDetails}`);

    // 开发环境：详细日志
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Zod 验证失败:', errorMessage);
      console.error('错误详情:', errorDetails);
      console.error('原始数据:', data);
      console.error('Zod 错误:', zodErrors);
    }

    // 生产环境：记录日志（会被日志服务收集）
    console.error('[Zod Validation Error]', {
      message: errorMessage,
      details: errorDetails,
      zodErrors,
      dataId:
        typeof data === 'object' && data !== null && 'id' in data
          ? data.id
          : 'unknown',
      timestamp: new Date().toISOString(),
    });

    // 如果配置了监控服务，发送错误
    if (monitoringService) {
      monitoringService.captureException(validationError, {
        validation: true,
        schema: schema.constructor.name || 'Unknown',
        errorMessage,
        errorDetails,
        zodErrors,
        receivedData: data,
      });
    }

    // 抛出错误（会触发 Next.js 错误边界）
    throw validationError;
  }
}
