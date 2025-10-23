import { ONE_TO_TEN_CHAR } from '../constants';
import { CourseTopic } from '../types/models';

// Transform course topics to lesson items format for backward compatibility
export const transformTopicsToLessonItems = (topics: CourseTopic[]) => {
  return topics.map((topic, index) => ({
    id: index + 1, // For display purposes
    title: topic.article_title || topic.title,
    topicId: topic.id,
    courseId: topic.courseId,
    hasVideo: topic.hasVideo || !!topic.url,
    hasAudio: topic.hasAudio || !!topic.url_mp3,
    hasText: topic.hasText || !!topic.article_fulltext,
    hasQA: topic.hasQA,
  }));
};

// Get available content types for a topic
export const getTopicContentTypes = (topic: CourseTopic) => {
  const contentTypes = [];

  if (topic.url || topic.hasVideo) {
    contentTypes.push({ key: '', label: '视频', available: true });
  }

  if (topic.url_mp3 || topic.hasAudio) {
    contentTypes.push({ key: 'audio', label: '音频', available: true });
  }

  if (topic.article_fulltext || topic.hasText) {
    contentTypes.push({ key: 'reading', label: '文字', available: true });
  }

  if (topic.hasQA) {
    contentTypes.push({ key: 'qa', label: '问答', available: true });
  }

  return contentTypes;
};

// Generate course navigation breadcrumbs
export const generateCourseBreadcrumbs = (
  course: {
    id: string;
    title?: string;
  },
  topic?: CourseTopic
) => {
  const breadcrumbs = [
    { label: '慧灯禅修课', href: '/course' },
    { label: course?.title || '课程', href: `/course/${course?.id}` },
  ];

  if (topic) {
    breadcrumbs.push({
      label: topic.article_title || topic.title,
      href: `/course/${course?.id}/${topic.id}`,
    });
  }

  return breadcrumbs;
};

export function formatDate(input: string): string {
  if (!input) return '';

  let year: string, month: string, day: string;

  // 检查是否为 ISO 8601 格式 (YYYY-MM-DD 或 YYYY-MM-DDTHH:mm:ss.sssZ)
  if (input.includes('-') && (input.includes('T') || input.includes(' '))) {
    // ISO 8601 格式: 2025-09-15 03:18:42.959Z 或 2025-09-15T03:18:42.959Z
    const datePart = input.split(/[T ]/)[0]; // 提取日期部分
    [year, month, day] = datePart.split('-');
  } else if (input.includes('/')) {
    // 原有格式: YYYY/MM/DD
    [year, month, day] = input.split('/');
  } else {
    // 尝试解析为 Date 对象
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return ''; // 无效日期
    }
    year = date.getFullYear().toString();
    month = (date.getMonth() + 1).toString();
    day = date.getDate().toString();
  }

  // 月份处理：直接转换为数字去除前导零
  const monthFormatted = parseInt(month).toString();

  // 日期处理：保证两位数显示
  const dayFormatted = day?.padStart(2, '0');

  // 拼接中文格式
  return `${year}年${monthFormatted}月${dayFormatted}日`;
}

export function buildLessonsTitle(size: number) {
  const lessons = [];
  for (let i = 0; i < size; i++) {
    if (i < 10) lessons.push(`第${ONE_TO_TEN_CHAR[i]}课`);
    if (i >= 10 && i < 20) lessons.push(`第十${ONE_TO_TEN_CHAR[i % 10]}课`);
    if (i >= 20) break;
  }

  return lessons;
}

export const clearCourseTitle = (title: string) =>
  title?.replace(/(慧灯禅修课\d+ )|(｜慧灯禅修课问答)/, '');
