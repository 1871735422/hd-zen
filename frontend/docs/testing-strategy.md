# 测试策略与运行时验证

## 测试原则

### ✅ 保留的测试（真正有用）

1. **工具函数测试** (`utils.test.ts`)
   - 测试纯函数逻辑（`getKeywords`, `buildFilter` 等）
   - 不依赖外部数据
   - **真正有用** ✅

2. **API 错误处理测试** (`api.test.ts`)
   - 测试错误处理逻辑
   - 测试边界情况（如空参数）
   - **有一定价值** ⚠️

3. **Zod 验证器测试** (`validators.test.ts`)
   - 测试数据验证逻辑
   - 确保 schema 定义正确
   - **有价值** ✅

### ❌ 已删除的测试（价值有限）

1. ~~`type-validation.test.ts`~~ - **已删除**
   - 使用 mock 数据，无法检测真实数据问题
   - TypeScript 编译时已检查类型

2. ~~`api-extended.test.ts`~~ - **已删除**
   - 使用 mock 数据，无法检测真实数据问题
   - 无法验证真实 API 返回的数据结构

## 运行时验证：Zod

### 为什么需要 Zod？

虽然 TypeScript 在编译时检查类型，但**无法检测运行时数据问题**：

```typescript
// ❌ 如果 PocketBase 返回的数据缺少字段
{ title: "Course" }  // 缺少 id，但 TypeScript 不会报错

// ❌ 如果字段类型不对
{ id: "1", displayOrder: "1" }  // 应该是 number

// ❌ 如果字段名变了
{ id: "1", title_new: "Course" }  // 字段名变化

// 这些问题只有在运行时才会发现！
```

### Zod 如何保护生产环境？

**运行时验证**：每次 API 调用时验证数据结构

```typescript
import { validateWithZod, CourseSchema } from './validators';

const mapRecordToCourse = (record: PocketRecord): Course => {
  // 如果数据不符合 schema，立即抛出错误
  return validateWithZod(
    CourseSchema,
    record,
    `Invalid course data (id: ${record.id})`
  );
};
```

**保护机制**：

1. ✅ 数据结构变化时，立即抛出错误
2. ✅ 详细错误日志（哪个字段有问题）
3. ✅ 可以触发告警（通知开发者）
4. ✅ 可选择优雅降级（返回默认值）

### 实际案例

假设 PocketBase 管理员把 `title` 字段重命名为 `course_title`：

**没有 Zod**：

```typescript
// 代码继续运行，但返回的数据是错的
{
  id: "1",
  title: undefined,  // ❌ 字段不存在
  displayOrder: 1
}
// 用户看到：课程标题显示为空
// 问题可能几天后才被发现
```

**有 Zod**：

```typescript
// 立即报错
Error: Invalid course data (id: 1): title: Required
// 错误日志立即记录
// 开发者立即知道问题
// 可以立即修复或回滚数据库变更
```

### Zod 成本分析

| 方面         | Zod                       | 集成测试             |
| ------------ | ------------------------- | -------------------- |
| **开发时间** | 1-2 小时                  | 几天                 |
| **包大小**   | ~50KB                     | 不需要额外包         |
| **性能开销** | ~0.1ms/次                 | ~200-2000ms/次       |
| **维护成本** | 数据结构变化时更新 schema | 需要维护测试数据     |
| **运行成本** | 几乎为 0（内存验证）      | 需要测试数据库服务器 |

**结论**：Zod 成本极低，但效果显著 ✅

## 当前测试覆盖

- ✅ 工具函数逻辑（13 个测试）
- ✅ API 错误处理（5 个测试）
- ✅ Zod 验证器测试（验证 schema 定义）

**总计：18+ 个真正有用的测试**

## 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试（单次）
pnpm test --run

# 查看覆盖率
pnpm test:coverage

# UI 界面
pnpm test:ui
```

## 文件结构

```
app/api/
├── index.ts              # API 函数（使用 Zod 验证）
├── validators.ts         # Zod schema 定义
└── __tests__/
    ├── api.test.ts       # API 错误处理测试
    ├── utils.test.ts     # 工具函数测试
    └── validators.test.ts # Zod 验证器测试
```

## 总结

**三层保护**：

1. **TypeScript** - 编译时类型检查
2. **Zod** - 运行时数据验证（生产环境保护）
3. **单元测试** - 测试业务逻辑和错误处理

**保持简单**：只测试真正能检测到问题的代码（纯函数、错误处理、验证器），而不是用 mock 数据测试无法检测真实问题的地方。

## 生产环境性能影响

### 性能开销实测

在我们的项目中，Zod 验证的性能开销：

- **单次验证**：~0.1-0.5ms
- **对比网络请求**：50-500ms
- **占比**：< 1%（几乎可忽略）

### 业界使用情况

- ✅ **广泛使用**：GitHub 28k+ stars，大量生产项目使用
- ✅ **Next.js 官方推荐**：用于 API 路由验证
- ✅ **性能优化**：Zod v4 性能提升 6-14 倍

### 结论

**好处远大于坏处** ✅

- **性能影响**：< 1%（几乎可忽略）
- **收益**：防止生产环境数据错误、快速定位问题
- **成本**：极低（一次性开发 + 少量维护）

详见：`docs/zod-production-analysis.md`
