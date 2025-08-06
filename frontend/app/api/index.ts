import PocketBase from 'pocketbase';
import {
  Category,
  Course,
  CourseTopic,
  Media,
  PaginatedResponse,
  TopicMedia
} from '../types/models';

// Initialize PocketBase using environment variable
export const pb = new PocketBase(process.env.NEXT_PB_URL as string);

// Configure PocketBase to prevent auto-cancellation
pb.autoCancellation(false);

// Configuration
export const config = {
  apiUrl: process.env.NEXT_PB_URL as string,
  defaultPageSize: 50,
  requestTimeout: 10000, // 10 seconds
} as const;

// Helper functions for mapping records
const mapRecordToCategory = (record: any): Category => ({
  id: record.id,
  name: record.name,
  title: record.title,
  description: record.description,
  displayOrder: record.displayOrder,
  slug: record.slug,
  isActive: record.isActive,
  created: record.created,
  updated: record.updated,
});

const mapRecordToCourse = (record: any): Course => {
  const course: Course = {
    id: record.id,
    categoryId: record.categoryId,
    title: record.title,
    description: record.description,
    cover: record.cover,
    displayOrder: record.displayOrder,
    isActive: record.isActive,
    created: record.created,
    updated: record.updated,
  };

  if (record.expand?.categoryId) {
    course.category = mapRecordToCategory(record.expand.categoryId);
  }

  return course;
};

const mapRecordToCourseTopic = (record: any): CourseTopic => {
  const courseTopic: CourseTopic = {
    id: record.id,
    courseId: record.courseId || '',
    // New schema fields
    article_title: record.article_title || '',
    article_alias: record.article_alias || '',
    ordering: record.ordering || 0,
    article_introtext: record.article_introtext || '',
    article_fulltext: record.article_fulltext || '',
    article_summary: record.article_summary || '',
    tags: record.tags || '',
    url: record.url || '',
    url_mp3: record.url_mp3 || '',
    url_duration: record.url_duration || '',
    url_downmp3: record.url_downmp3 || '',
    url_mp3size: record.url_mp3size || '',
    url_downpdf: record.url_downpdf || '',
    url_pdfsize: record.url_pdfsize || '',
    content_id: record.content_id || '',
    asset_id: record.asset_id || '',
    // Legacy fields for backward compatibility
    title: record.article_title || record.title || '',
    description: record.article_introtext || record.description || '',
    topicOrder: record.ordering || record.topicOrder || 0,
    hasVideo: record.hasVideo || !!record.url,
    hasAudio: record.hasAudio || !!record.url_mp3,
    hasText: record.hasText || !!record.article_fulltext,
    hasQA: record.hasQA || false,
    isActive: record.isActive !== false,
    created: record.created,
    updated: record.updated,
  };

  if (record.expand?.courseId) {
    courseTopic.course = mapRecordToCourse(record.expand.courseId);
  }

  return courseTopic;
};

const mapRecordToMedia = (record: any): Media => ({
  id: record.id,
  title: record.title,
  url_hd: record.url_hd,
  url_sd: record.url_sd,
  url_image: record.url_image,
  mp4_duration: record.mp4_duration,
  url_mp3: record.url_mp3,
  mp3_duration: record.mp3_duration,
  url_downmp4: record.url_downmp4,
  mp4_size: record.mp4_size,
  url_downmp3: record.url_downmp3,
  mp3_size: record.mp3_size,
  summary: record.summary,
  tags: record.tags,
  assetId: record.assetId,
  resourceId: record.resourceId,
  intro_text: record.intro_text,
  full_text: record.full_text,
  summary_text: record.summary_text,
  contentType: record.contentType,
  duration: record.duration,
  fileSize: record.fileSize,
  high_quality_url: record.high_quality_url,
  low_quality_url: record.low_quality_url,
  image1_url: record.image1_url,
  image2_url: record.image2_url,
  fohuifayu_url: record.fohuifayu_url,
  file_hash: record.file_hash,
  created: record.created,
  updated: record.updated,
});

const mapRecordToTopicMedia = (record: any): TopicMedia => ({
  id: record.id,
  topicId: record.topicId,
  mediaId: record.mediaId,
  isActive: record.isActive,
  topic: record.expand?.topicId ? mapRecordToCourseTopic(record.expand.topicId) : undefined,
  media: record.expand?.mediaId ? mapRecordToMedia(record.expand.mediaId) : undefined,
  created: record.created,
  updated: record.updated,
});

// API Functions
export const getCategories = async (): Promise<PaginatedResponse<Category>> => {
  try {
    const result = await pb.collection('navMenu').getList(1, 10, {
      sort: 'displayOrder',
      requestKey: null, // Disable auto-cancellation
    });
    return {
      ...result,
      items: result.items.map(mapRecordToCategory),
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      items: [],
      totalItems: 0,
      totalPages: 1,
      page: 1,
      perPage: 0,
    };
  }
};

export const getCourses = async (): Promise<PaginatedResponse<Course>> => {
  try {
    const result = await pb.collection('courses').getFullList({
      sort: 'displayOrder',
      expand: 'categoryId',
      requestKey: null, // Disable auto-cancellation
    });

    const mappedCourses = result.map(mapRecordToCourse);

    return {
      items: mappedCourses,
      totalItems: mappedCourses.length,
      totalPages: 1,
      page: 1,
      perPage: mappedCourses.length,
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Return empty result instead of throwing
    return {
      items: [],
      totalItems: 0,
      totalPages: 1,
      page: 1,
      perPage: 0,
    };
  }
};

export const getCoursesByCategory = async (categoryId: string): Promise<PaginatedResponse<Course>> => {
  const result = await pb.collection('courses').getList(1, 500, {
    filter: `categoryId = "${categoryId}"`,
    sort: 'displayOrder',
    expand: 'categoryId',
  });
  return {
    ...result,
    items: result.items.map(mapRecordToCourse),
  };
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const record = await pb.collection('courses').getFirstListItem(`id="${id}"`);
    return mapRecordToCourse(record);
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    return null;
  }
};

export const getCourseTopics = async (): Promise<PaginatedResponse<CourseTopic>> => {
  const result = await pb.collection('courseTopics').getFullList({
    sort: 'ordering',
    expand: 'courseId',
  });

  const mappedCourseTopics = result.map(mapRecordToCourseTopic);

  return {
    items: mappedCourseTopics,
    totalItems: mappedCourseTopics.length,
    totalPages: 1,
    page: 1,
    perPage: mappedCourseTopics.length,
  };
};

export const getCourseTopicsByCourse = async (courseId: string): Promise<PaginatedResponse<CourseTopic>> => {
  try {
    const result = await pb.collection('courseTopics').getList(1, 500, {
      filter: `courseId = "${courseId}"`,
      sort: 'ordering',
      expand: 'courseId',
      requestKey: null, // Disable auto-cancellation
    });

    return {
      ...result,
      items: result.items.map(mapRecordToCourseTopic),
    };
  } catch (error) {
    console.error(`Error fetching course topics for course ${courseId}:`, error);
    // If the filter fails, get all topics and filter client-side
    try {
      const allTopics = await getCourseTopics();
      const filteredTopics = allTopics.items.filter(topic => topic.courseId === courseId);

      return {
        items: filteredTopics,
        totalItems: filteredTopics.length,
        totalPages: 1,
        page: 1,
        perPage: filteredTopics.length,
      };
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return {
        items: [],
        totalItems: 0,
        totalPages: 1,
        page: 1,
        perPage: 0,
      };
    }
  }
};

export const getCourseTopicById = async (topicId: string): Promise<CourseTopic | null> => {
  try {
    const record = await pb.collection('courseTopics').getOne(topicId, {
      expand: 'courseId',
    });
    return mapRecordToCourseTopic(record);
  } catch (error) {
    // Handle error silently in server-side context
    return null;
  }
};

export const getTopicMedia = async (): Promise<PaginatedResponse<TopicMedia>> => {
  const result = await pb.collection('topicMedia').getFullList({
    expand: 'topicId,mediaId',
  });
  return {
    items: result.map(mapRecordToTopicMedia),
    totalItems: result.length,
    totalPages: 1,
    page: 1,
    perPage: result.length,
  };
};

export const getTopicMediaByTopic = async (topicId: string): Promise<PaginatedResponse<TopicMedia>> => {
  try {
    const result = await pb.collection('topicMedia').getList(1, 500, {
      filter: `topicId = "${topicId}"`,
      expand: 'topicId,mediaId',
    });

    return {
      ...result,
      items: result.items.map(mapRecordToTopicMedia),
    };
  } catch (error) {
    // If filter fails, get all and filter client-side
    const allTopicMedia = await getTopicMedia();
    const filteredMedia = allTopicMedia.items.filter(tm => tm.topicId === topicId);

    return {
      items: filteredMedia,
      totalItems: filteredMedia.length,
      totalPages: 1,
      page: 1,
      perPage: filteredMedia.length,
    };
  }
};

// Utility function to get course cover image URL
export const getCourseImageUrl = (course: Course, thumbnail = false): string => {
  if (!course.cover) return '';
  const thumbParam = thumbnail ? '?thumb=100x0' : '';
  return `${config.apiUrl}/api/files/courses/${course.id}/${course.cover}${thumbParam}`;
};

// Utility function to get media thumbnail URL
export const getMediaImageUrl = (media: Media): string => {
  return media.url_image || media.image1_url || '';
};
