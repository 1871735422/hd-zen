import { describe, it, expect } from 'vitest';
import { CourseSchema } from '../validators';

/**
 * 性能测试：验证 Zod 验证的实际性能开销
 */
describe('Zod Performance Test', () => {
  const validCourse = {
    id: '1',
    title: 'Test Course',
    categoryId: 'cat1',
    displayOrder: 1,
    isActive: true,
    created: '2024-01-01T00:00:00.000Z',
    updated: '2024-01-01T00:00:00.000Z',
  };

  it('should validate quickly (performance test)', () => {
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      CourseSchema.parse(validCourse);
    }

    const duration = performance.now() - start;
    const avgTime = duration / iterations;

    console.log(`\n性能测试结果：
  - 验证次数: ${iterations}
  - 总耗时: ${duration.toFixed(2)}ms
  - 平均每次: ${avgTime.toFixed(3)}ms`);

    // Zod 验证应该很快（< 1ms per validation）
    expect(avgTime).toBeLessThan(1); // 平均每次验证应该 < 1ms

    // 对比：网络请求通常是 50-500ms
    // Zod 验证（0.1-0.5ms）只占网络请求的 0.1-1%
  });

  it('should handle validation errors quickly', () => {
    const invalidCourse = {
      id: '1',
      // 缺少 title
    };

    const start = performance.now();
    try {
      CourseSchema.parse(invalidCourse);
    } catch {
      // 预期会抛出错误
    }
    const duration = performance.now() - start;

    console.log(`\n错误验证耗时: ${duration.toFixed(3)}ms`);

    // 即使是错误情况，也应该很快
    expect(duration).toBeLessThan(5);
  });
});
