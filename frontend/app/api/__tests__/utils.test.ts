import { describe, expect, it } from 'vitest';
import {
  buildArticleFilter,
  buildFilter,
  buildMediaFilter,
  getKeywords,
} from '../index';

describe('Search Utility Functions', () => {
  describe('getKeywords', () => {
    it('should split text by comma and whitespace', () => {
      expect(getKeywords('hello world')).toEqual(['hello', 'world']);
      expect(getKeywords('hello,world,test')).toEqual([
        'hello',
        'world',
        'test',
      ]);
      expect(getKeywords('hello  world   test')).toEqual([
        'hello',
        'world',
        'test',
      ]);
    });

    it('should filter empty keywords', () => {
      expect(getKeywords('hello  ,  world')).toEqual(['hello', 'world']);
      expect(getKeywords('  hello   world  ')).toEqual(['hello', 'world']);
    });

    it('should handle empty string', () => {
      expect(getKeywords('')).toEqual([]);
      expect(getKeywords('   ')).toEqual([]);
    });
  });

  describe('buildFilter', () => {
    it('should build title filter correctly', () => {
      const keywords = ['hello', 'world'];
      const result = buildFilter(keywords, true);
      expect(result).toBe('title ~ "hello" && title ~ "world"');
    });

    it('should build content filter correctly', () => {
      const keywords = ['hello', 'world'];
      const result = buildFilter(keywords, false);
      expect(result).toBe(
        '(fulltext ~ "hello" || introtext ~ "hello" || summary ~ "hello") && (fulltext ~ "world" || introtext ~ "world" || summary ~ "world")'
      );
    });

    it('should handle empty keywords', () => {
      expect(buildFilter([], true)).toBe('');
      expect(buildFilter([], false)).toBe('');
    });
  });

  describe('buildMediaFilter', () => {
    it('should build media filter from search text', () => {
      const result = buildMediaFilter('hello world');
      expect(result).toBe('title ~ "hello" && title ~ "world"');
    });

    it('should return empty string for empty input', () => {
      expect(buildMediaFilter('')).toBe('');
      expect(buildMediaFilter('   ')).toBe('');
    });
  });

  describe('buildArticleFilter', () => {
    it('should build filter with title and content', () => {
      const result = buildArticleFilter('hello', 'world');
      expect(result).toBe(
        '(title ~ "hello" || fulltext ~ "world" || introtext ~ "world" || summary ~ "world")'
      );
    });

    it('should build filter with title only', () => {
      const result = buildArticleFilter('hello', undefined);
      expect(result).toBe('title ~ "hello"');
    });

    it('should build filter with content only', () => {
      const result = buildArticleFilter(undefined, 'world');
      expect(result).toBe(
        '(fulltext ~ "world" || introtext ~ "world" || summary ~ "world")'
      );
    });

    it('should return empty string when both are empty', () => {
      expect(buildArticleFilter()).toBe('');
      expect(buildArticleFilter('', '')).toBe('');
    });

    it('should handle multiple keywords in title', () => {
      const result = buildArticleFilter('hello world', undefined);
      expect(result).toBe('title ~ "hello" && title ~ "world"');
    });
  });
});
