// Base interfaces
export interface BaseModel {
  id: string;
  created: string;
  updated: string;
}

// PocketBase record type with flexible fields
export interface PocketRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expand?: Record<string, any>;
}

// Questions
export interface Questions extends BaseModel {
  topicId: string;
  title: string;
  description?: string;
  assetId?: string;
  contentId: string;
  isActive: boolean;
}

// Answers
export interface Answers extends BaseModel {
  topicId: string;
  title: string;
  assetId?: string;
  questionId: string;
  isActive: boolean;
}

// answerMedia
export interface AnswerMedia extends BaseModel {
  topicId: string;
  title: string;
  assetId?: string;
  answerId: string;
  displayOrder: number;
  isActive: boolean;
  media?: Media;
}

// Category
export interface Category extends BaseModel {
  name: string;
  title: string;
  description?: string;
  displayOrder: number;
  slug: string;
  isActive: boolean;
}

// Course
export interface Course extends BaseModel {
  title: string;
  description?: string;
  cover?: string;
  categoryId: string;
  category?: Category;
  displayOrder: number;
  isActive: boolean;
}

// Media
export type ContentType = 'TEXT' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export interface Media extends BaseModel {
  title: string;
  url_hd?: string;
  url_sd?: string;
  url_image?: string;
  mp4_duration?: string;
  url_mp3?: string;
  mp3_duration?: string;
  url_downmp4?: string;
  mp4_size?: string;
  url_downmp3?: string;
  mp3_size?: string;
  summary?: string;
  tags?: string[];
  assetId?: string;

  // Legacy fields for backward compatibility
  resourceId?: string;
  intro_text?: string;
  full_text?: string;
  summary_text?: string;
  contentType?: ContentType;
  duration?: string;
  fileSize?: number;
  high_quality_url?: string;
  low_quality_url?: string;
  image1_url?: string;
  image2_url?: string;
  fohuifayu_url?: string;
  file_hash?: string;
}

// CourseTopics models
export interface CourseTopic extends BaseModel {
  courseId: string;
  course?: Course;

  // New schema fields
  article_title: string;
  article_alias: string;
  ordering: number;
  article_introtext?: string;
  article_fulltext?: string;
  article_summary?: string;
  tags?: string;
  url?: string;
  url_mp3?: string;
  url_duration?: string;
  url_downmp3?: string;
  url_mp3size?: string;
  url_downpdf?: string;
  url_pdfsize?: string;
  content_id?: string;
  asset_id?: string;

  // Legacy fields for backward compatibility
  title: string;
  description?: string;
  topicOrder: number;
  hasVideo: boolean;
  hasAudio: boolean;
  hasText: boolean;
  hasQA: boolean;
  isActive: boolean;
}

// TopicMedia models
export interface TopicMedia extends BaseModel {
  topicId: string;
  mediaId: string;
  isActive: boolean;
  topic?: CourseTopic;
  media?: Media;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  perPage: number;
}
export interface TagRelation extends BaseModel {
  courseTitle: string;
  courseOrder: string;
  courseActive: boolean;
  topicTitle: string;
  topicOrder: string;
  topicActive: boolean;
  tags: string[];
}
export interface Article extends BaseModel {
  title: string;
  fulltext: string;
  introtext: string;
  summary: string;
  courseOrder: string;
  isActive: boolean;
  topicOrder: string;
  courseTitle: string;
}

// CourseMedia - 课程媒体
export interface CourseMedia extends BaseModel {
  title: string;
  courseId: string;
  mediaId: string;
  displayOrder: number;
  isActive: boolean;
  course?: Course;
  media?: Media;
}

// QuestionMedia - 问答媒体
export interface QuestionMedia extends BaseModel {
  title: string;
  questionId: string;
  mediaId: string;
  displayOrder: number;
  isActive: boolean;
  question?: Questions;
  media?: Media;
}

// 搜索结果联合类型
export type SearchResultItem = Article | CourseMedia | QuestionMedia;
