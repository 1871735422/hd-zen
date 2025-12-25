// Utilities for keyword highlighting across the app
// Shared implementation extracted from SearchInfoCard

// 将 keywords 转为安全的 RegExp
export const buildKeywordRegex = (keywords: string[]) => {
  const normalized = (keywords || [])
    .flatMap(k => k.split(/[,\s，、]+/))
    .map(k => k.trim())
    .filter(Boolean);
  const escaped = normalized.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return null;
  return new RegExp(`(${escaped.join('|')})`, 'gi');
};

// 处理内容显示逻辑（为片段展示使用，保持原 SearchInfoCard 行为）
export const processContent = (
  content: string,
  keywords: string[],
  expanded: boolean
) => {
  if (!keywords || keywords.length === 0) {
    return content;
  }

  const paragraphRegex = /<(p|h[1-6])(?:\s[^>]*)?>(.*?)<\/\1>/gi;
  const paragraphs: string[] = [];
  let match;

  while ((match = paragraphRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const tagContent = match[2].trim();
    if (tagContent) {
      paragraphs.push(fullTag);
    }
  }

  if (paragraphs.length === 0) {
    const fallbackParagraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    if (fallbackParagraphs.length > 0) {
      paragraphs.push(...fallbackParagraphs);
    }
  }

  if (paragraphs.length === 0) {
    return content;
  }

  const keywordRegex = buildKeywordRegex(keywords);
  const keywordParagraphIndices: number[] = [];

  paragraphs.forEach((paragraph, index) => {
    if (keywordRegex && keywordRegex.test(paragraph)) {
      keywordParagraphIndices.push(index);
    }
  });

  if (keywordParagraphIndices.length === 0) {
    return content;
  }

  if (expanded) {
    const startIndex = Math.min(...keywordParagraphIndices);
    const endIndex = Math.min(startIndex + 5, paragraphs.length);
    return paragraphs.slice(startIndex, endIndex).join('');
  } else {
    const startIndex = Math.min(...keywordParagraphIndices);
    const endIndex = Math.min(startIndex + 2, paragraphs.length);
    return paragraphs.slice(startIndex, endIndex).join('');
  }
};

// 原 SearchInfoCard 用的高亮（会在片段显示逻辑上做裁剪）
export const highlightKeywords = (
  content: string,
  keywords: string[],
  expanded: boolean
) => {
  const processedContent = processContent(content, keywords || [], expanded);
  if (keywords && keywords.length > 0) {
    return processedContent.replace(
      buildKeywordRegex(keywords) ?? /$^/,
      m =>
        `<mark style="color: rgba(255, 94, 124, 1);background: transparent">${m}</mark>`
    );
  }
  return processedContent;
};

// 全文高亮（用于文章/阅读页 —— 不进行片段裁剪，直接在所有内容中替换）
export const highlightAllKeywords = (content: string, keywords: string[]) => {
  if (!keywords || keywords.length === 0) return content;
  return content.replace(
    buildKeywordRegex(keywords) ?? /$^/,
    m =>
      `<mark style="color: rgba(255, 94, 124, 1);background: transparent">${m}</mark>`
  );
};
