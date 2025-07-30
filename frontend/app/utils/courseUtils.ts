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
export const generateCourseBreadcrumbs = (course: any, topic?: CourseTopic) => {
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
