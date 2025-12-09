import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  CategorySchema,
  CourseSchema,
  QuestionResultSchema,
  TagRelationSchema,
  validateWithZod,
} from '../validators';

describe('Zod Validators', () => {
  describe('CategorySchema', () => {
    it('should validate correct category data', () => {
      const validData = {
        id: '1',
        name: 'course',
        title: 'Course',
        displayOrder: 1,
        slug: '/course',
        isActive: true,
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      const result = CategorySchema.parse(validData);
      expect(result.id).toBe('1');
      expect(result.name).toBe('course');
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        id: '1',
        // 缺少 name
        title: 'Course',
      };

      expect(() => CategorySchema.parse(invalidData)).toThrow();
    });

    it('should reject wrong type', () => {
      const invalidData = {
        id: '1',
        name: 'course',
        title: 'Course',
        displayOrder: '1', // 应该是 number
        slug: '/course',
        isActive: true,
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      expect(() => CategorySchema.parse(invalidData)).toThrow();
    });
  });

  describe('CourseSchema', () => {
    it('should validate correct course data', () => {
      const validData = {
        id: '1',
        title: 'Test Course',
        categoryId: 'cat1',
        displayOrder: 1,
        isActive: true,
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      const result = CourseSchema.parse(validData);
      expect(result.title).toBe('Test Course');
    });

    it('should handle optional fields', () => {
      const validData = {
        id: '1',
        title: 'Test Course',
        categoryId: 'cat1',
        displayOrder: 1,
        isActive: true,
        description: 'Description',
        cover: 'cover.jpg',
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      const result = CourseSchema.parse(validData);
      expect(result.description).toBe('Description');
      expect(result.cover).toBe('cover.jpg');
    });
  });

  describe('validateWithZod', () => {
    const TestSchema = z.object({
      id: z.string(),
      name: z.string(),
    });

    it('should return validated data when valid', () => {
      const data = { id: '1', name: 'test' };
      const result = validateWithZod(TestSchema, data, 'Test error');
      expect(result.id).toBe('1');
      expect(result.name).toBe('test');
    });

    it('should throw error with message when invalid', () => {
      const data = { id: '1' }; // 缺少 name
      expect(() => {
        validateWithZod(TestSchema, data, 'Test error');
      }).toThrow(/Test error/);
    });
  });

  describe('QuestionResultSchema', () => {
    it('should validate correct question result data', () => {
      const validData = {
        id: '1',
        courseTitle: 'Course 1',
        topicTitle: 'Topic 1',
        topicOrder: 1,
        questionTitle: 'Question 1',
        questionOrder: 1,
        questionCreated: '2024-01-01',
        title: 'Media Title',
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      const result = QuestionResultSchema.parse(validData);
      expect(result.courseTitle).toBe('Course 1');
      expect(result.questionTitle).toBe('Question 1');
    });
  });

  describe('TagRelationSchema', () => {
    it('should validate correct tag relation data', () => {
      const validData = {
        id: '1',
        courseTitle: 'Course 1',
        courseOrder: '1',
        courseActive: true,
        topicTitle: 'Topic 1',
        topicOrder: '1',
        topicActive: true,
        tags: ['tag1', 'tag2'],
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      const result = TagRelationSchema.parse(validData);
      expect(result.tags).toEqual(['tag1', 'tag2']);
    });

    it('should reject non-array tags', () => {
      const invalidData = {
        id: '1',
        courseTitle: 'Course 1',
        courseOrder: '1',
        courseActive: true,
        topicTitle: 'Topic 1',
        topicOrder: '1',
        topicActive: true,
        tags: 'tag1', // 应该是数组
        created: '2024-01-01',
        updated: '2024-01-01',
      };

      expect(() => TagRelationSchema.parse(invalidData)).toThrow();
    });
  });
});
