# Zod 使用指南：开发与生产环境

## 📚 目录

1. [Zod 如何使用](#zod-如何使用)
2. [开发环境的好处](#开发环境的好处)
3. [生产环境的告警机制](#生产环境的告警机制)
4. [实际使用示例](#实际使用示例)
5. [监控与告警配置](#监控与告警配置)

---

## Zod 如何使用

### 1. 定义 Schema（数据模型）

在 `app/api/validators.ts` 中定义数据结构：

```typescript
import { z } from 'zod';

// 基础模型（所有数据都有的字段）
const BaseModelSchema = z.object({
  id: z.string(),
  created: z.string(),
  updated: z.string(),
});

// 课程 Schema
export const CourseSchema = BaseModelSchema.extend({
  title: z.string(), // 必填字段
  description: z.string().optional(), // 可选字段
  categoryId: z.string(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});
```

### 2. 使用验证函数

在 API 函数中使用 `validateWithZod` 验证数据：

```typescript
import { validateWithZod, CourseSchema } from './validators';

const mapRecordToCourse = (record: PocketRecord): Course => {
  // 验证数据，如果不符合 schema 会立即抛出错误
  return validateWithZod(
    CourseSchema,
    record,
    `Invalid course data (id: ${record.id})`
  );
};
```

### 3. 验证流程

```
PocketBase 返回数据
    ↓
validateWithZod() 验证
    ↓
如果数据正确 → 返回验证后的数据 ✅
    ↓
如果数据错误 → 抛出错误 + 记录日志 + 触发告警 ❌
```

---

## 开发环境的好处

### ✅ 1. 立即发现问题

**场景**：PocketBase 管理员修改了字段名

```typescript
// PocketBase 返回的数据
{
  id: "1",
  course_title: "新课程",  // ❌ 字段名改了（原来是 title）
  displayOrder: 1
}

// Zod 立即报错
Error: Invalid course data (id: 1): title: Required
```

**开发环境表现**：

- ✅ 浏览器控制台显示详细错误（红色）
- ✅ 页面立即报错（不会显示空白或错误数据）
- ✅ 你知道哪个字段有问题，立即修复

**控制台输出示例**：

```
❌ Zod 验证失败: Invalid course data (id: 1)
错误详情: title: Required
原始数据: { id: '1', course_title: '新课程', displayOrder: 1 }
Zod 错误: [{ path: 'title', message: 'Required' }]
```

### ✅ 2. 类型提示

```typescript
// TypeScript 自动推断类型
const course = validateWithZod(CourseSchema, record, '...');

// course.title 有类型提示 ✅
// course.nonExistent 会报错 ✅
```

### ✅ 3. 清晰的错误信息

```typescript
// Zod 错误信息示例
Error: Invalid course data (id: abc123):
  - title: Required (缺少必填字段)
  - displayOrder: Expected number, received string (类型错误)
  - categoryId: String must contain at least 1 character (验证失败)
```

### ✅ 4. 开发工作流

**步骤**：

1. 修改 PocketBase 数据结构
2. 运行 `pnpm dev`
3. 访问页面，Zod 立即报错
4. 查看控制台，知道哪里有问题
5. 修复 schema 或数据
6. 刷新页面，验证通过 ✅

---

## 生产环境的告警机制

### 方案 1：错误日志 + 监控服务（推荐）

#### 1.1 自动错误日志

Zod 验证失败时，错误会自动记录到：

- ✅ **服务器日志**：`console.error()` 输出（Vercel/Netlify 会自动收集）
- ✅ **错误追踪服务**：Sentry 等（需要配置，见下方）

**生产环境日志格式**：

```json
{
  "message": "Invalid course data (id: abc123)",
  "details": "title: Required",
  "zodErrors": [{ "path": "title", "message": "Required" }],
  "dataId": "abc123",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 1.2 集成 Sentry（推荐）

**步骤 1：安装 Sentry**

```bash
pnpm add @sentry/nextjs
```

**步骤 2：初始化 Sentry**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**步骤 3：配置监控服务**

```typescript
// app/layout.tsx 或应用入口文件
import { setupMonitoring } from '@/app/api/validators';
import * as Sentry from '@sentry/nextjs';

// 在生产环境初始化监控
if (process.env.NODE_ENV === 'production') {
  setupMonitoring({
    captureException: (error, context) => {
      Sentry.captureException(error, {
        tags: {
          source: 'zod_validation',
        },
        extra: context,
      });
    },
  });
}
```

**步骤 4：Sentry 告警配置**

1. 登录 [Sentry 后台](https://sentry.io)
2. 进入项目设置 → Alerts
3. 创建告警规则：
   - 条件：`tags.source = zod_validation`
   - 触发：当错误数量 > 1
   - 通知：邮件/钉钉/企业微信/Slack
4. 保存配置

**效果**：

- ✅ Zod 验证失败时，自动发送到 Sentry
- ✅ Sentry 立即发送通知（邮件/钉钉等）
- ✅ 可以在 Sentry 后台查看详细错误和上下文

#### 1.3 集成日志服务（Vercel/Netlify）

如果部署在 Vercel 或 Netlify：

```typescript
// 错误会自动记录到平台日志
// Vercel: Dashboard -> Logs
// Netlify: Site settings -> Logs
```

**查看日志**：

- Vercel：`vercel logs --follow`
- Netlify：Web UI 或 CLI

---

### 方案 2：错误边界 + 用户提示

在 React 组件中捕获错误：

```typescript
// app/error.tsx (Next.js 13+)
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // 检查是否是 Zod 验证错误
  const isValidationError = error.message.includes('Invalid');

  return (
    <div>
      <h2>数据验证错误</h2>
      {isValidationError && (
        <p>数据格式不正确，请联系管理员</p>
      )}
      <button onClick={reset}>重试</button>
    </div>
  );
}
```

---

### 方案 3：自定义监控端点

创建 API 端点收集错误：

```typescript
// app/api/monitoring/route.ts
export async function POST(request: Request) {
  const { error, context } = await request.json();

  // 发送到监控服务（如自建服务、第三方）
  await sendToMonitoring({
    type: 'zod_validation_error',
    error,
    context,
    timestamp: new Date().toISOString(),
  });

  return Response.json({ success: true });
}
```

---

## 实际使用示例

### 示例 1：API 函数中使用

```typescript
// app/api/index.ts
import { validateWithZod, CourseSchema, CategorySchema } from './validators';

export async function getCourses(): Promise<Course[]> {
  const records = await pb.collection('courses').getFullList();

  return records.map(record => {
    // 验证每个课程数据
    return validateWithZod(
      CourseSchema,
      record,
      `Invalid course data (id: ${record.id})`
    );
  });
}
```

### 示例 2：处理可选字段

```typescript
// 某些字段可能缺失，提供默认值
const mapRecordToCourseTopic = (record: PocketRecord): CourseTopic => {
  const processedRecord = {
    ...record,
    courseId: record.courseId || '',
    ordering: record.ordering || 0,
    isActive: record.isActive !== false, // 默认 true
  };

  return validateWithZod(
    CourseTopicSchema,
    processedRecord,
    `Invalid course topic data (id: ${record.id})`
  );
};
```

### 示例 3：处理嵌套数据

```typescript
const mapRecordToCourse = (record: PocketRecord): Course => {
  // 先验证主数据
  const course = validateWithZod(
    CourseSchema,
    record,
    `Invalid course data (id: ${record.id})`
  );

  // 再验证关联数据
  if (record.expand?.categoryId) {
    course.category = validateWithZod(
      CategorySchema,
      record.expand.categoryId,
      `Invalid category data in course ${record.id}`
    );
  }

  return course;
};
```

---

## 监控与告警配置

### 1. 本地开发：查看控制台

```bash
# 运行开发服务器
pnpm dev

# 查看浏览器控制台或终端日志
# 错误会直接显示，格式如下：
```

**浏览器控制台示例**：

```
❌ Zod 验证失败: Invalid course data (id: 1)
错误详情: title: Required
原始数据: { id: '1', course_title: '新课程' }
Zod 错误: [{ path: 'title', message: 'Required' }]
```

**效果**：

- ✅ 立即看到错误，无需等待
- ✅ 知道哪个字段有问题
- ✅ 可以直接复制错误信息

### 2. 生产环境：配置监控

#### 选项 A：使用 Sentry（推荐）

1. **安装 Sentry**：

```bash
pnpm add @sentry/nextjs
```

2. **初始化 Sentry**：

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

3. **配置告警规则**：

- 登录 Sentry 后台
- Alerts → Create Alert
- 条件：`tags.validation = zod`
- 通知：邮件/钉钉/企业微信

#### 选项 B：使用 Vercel 日志

1. **查看日志**：

```bash
vercel logs --follow
```

2. **过滤 Zod 错误**：

```bash
vercel logs --follow | grep "Invalid.*data"
```

#### 选项 C：钉钉/企业微信通知（适合小团队）

**步骤 1：配置监控服务**

```typescript
// app/layout.tsx
import { setupMonitoring } from '@/app/api/validators';

if (process.env.NODE_ENV === 'production') {
  setupMonitoring({
    captureException: async (error, context) => {
      const dingtalkWebhook = process.env.DINGTALK_WEBHOOK_URL;
      if (!dingtalkWebhook) return;

      await fetch(dingtalkWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msgtype: 'text',
          text: {
            content: `🔴 Zod 验证失败\n\n错误: ${error.message}\n\n详情: ${JSON.stringify(context, null, 2)}`,
          },
        }),
      });
    },
  });
}
```

**步骤 2：设置环境变量**

```bash
# .env.local
DINGTALK_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=xxx
```

**效果**：

- ✅ Zod 验证失败时，立即发送钉钉通知
- ✅ 团队成员立即知道问题
- ✅ 适合小团队，无需额外服务

---

## 总结

### 开发环境 ✅

- **立即发现问题**：字段名变化、类型错误
- **清晰的错误信息**：知道哪个字段有问题
- **类型安全**：TypeScript 自动推断类型

### 生产环境 ✅

- **自动记录错误**：`console.error()` + 日志服务
- **触发告警**：集成 Sentry/监控服务
- **快速定位问题**：详细错误信息 + 上下文数据

### 最佳实践

1. ✅ **所有 API 数据都验证**：使用 `validateWithZod`
2. ✅ **集成监控服务**：Sentry 或其他
3. ✅ **设置告警规则**：Zod 错误立即通知
4. ✅ **定期检查日志**：了解数据质量问题

---

## 相关文件

- `app/api/validators.ts` - Zod Schema 定义
- `app/api/index.ts` - API 函数（使用 Zod 验证）
- `docs/testing-strategy.md` - 测试策略说明
