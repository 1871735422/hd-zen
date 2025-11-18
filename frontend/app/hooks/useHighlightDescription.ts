import { highlightAllKeywords } from '@/app/utils/highlight';
import { useMemo } from 'react';

/**
 * 从 URL hash 中提取 highlight 参数，对文本应用高亮
 * @param description - 原始描述文本
 * @returns 高亮后的 HTML 字符串
 */
export function useHighlightDescription(description?: string): string {
  return useMemo(() => {
    if (!description) return '';
    if (typeof window === 'undefined') return description;

    try {
      const m = window.location.hash.match(/highlight=([^&]+)/);

      if (m && m[1]) {
        const decoded = decodeURIComponent(m[1]);
        const kw = decoded ? [decoded] : [];
        return kw.length ? highlightAllKeywords(description, kw) : description;
      }
    } catch (e) {
      console.error(e);
    }

    return description;
  }, [description]);
}
