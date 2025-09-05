// Base interfaces
export interface BaseModel {
  id: string;
  created: string;
  updated: string;
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
  tags?: string;
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
