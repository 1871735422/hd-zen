import PocketBase from 'pocketbase';
import { Menu } from '../components/pc/MenuItem';
import {
  BookChapter,
  Category,
  Course,
  CourseTopic,
  DownloadResource,
  Media,
  PaginatedResponse,
  PocketRecord,
  QuestionResult,
  Questions,
  ReferenceBook,
  TagRelation,
  TopicMediaX,
} from '../types/models';

// Initialize PocketBase using environment variable
// 客户端组件只能访问 NEXT_PUBLIC_ 开头的环境变量
// 构建时使用 NEXT_PB_URL，运行时使用 NEXT_PUBLIC_PB_URL
const pbUrl = process.env.NEXT_PUBLIC_PB_URL || process.env.NEXT_PB_URL;
export const pb = new PocketBase(pbUrl);

// Configure PocketBase to prevent auto-cancellation
pb.autoCancellation(false);

// Configuration
export const config = {
  apiUrl: pbUrl,
  defaultPageSize: 50,
  requestTimeout: 10000, // 10 seconds
} as const;

// Helper functions for mapping records

const mapRecordToCategory = (record: PocketRecord): Category => ({
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

const mapRecordToCourse = (record: PocketRecord): Course => {
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

const mapRecordToCourseTopic = (record: PocketRecord): CourseTopic => {
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

// API Functions
export const getCategories = async (name?: string): Promise<Array<Menu>> => {
  try {
    const result = await pb.collection('navMenu').getFullList({
      sort: 'displayOrder',
      filter: `isActive = true ${name ? '&& name = "' + name + '"' : ''}`,
    });

    return result.map(({ name, slug, subMenu }) => {
      return {
        name,
        slug,
        subMenu,
      };
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    // 构建时返回空数组而不是抛出错误
    return [];
  }
};

export const getCourses = async (): Promise<PaginatedResponse<Course>> => {
  try {
    const result = await pb.collection('courses').getFullList({
      sort: 'displayOrder',
      expand: 'categoryId',
      requestKey: null, // Disable auto-cancellation
    });

    const mappedCourses = result.map(record =>
      mapRecordToCourse(record as PocketRecord)
    );

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

/**
 *
 * @param displayOrder 课程编号 如：1
 * @returns 课程内容
 */
export const getCourseTopicsByDisplayOrder = async (
  displayOrder: string
): Promise<PaginatedResponse<CourseTopic>> => {
  const result = await pb.collection('courseTopics').getList(1, 50, {
    filter: `courseId.displayOrder = "${displayOrder}"`,
    expand: 'courseId',
    fields: 'article_title,ordering',
  });

  return {
    ...result,
    items: result.items.map(record =>
      mapRecordToCourseTopic(record as PocketRecord)
    ),
  };
};

/**
 *
 * @param volume 第几册课程 如：1
 * @param lesson 课时编号 如：1
 * @returns 此问题内容列表
 */
export const getQuestionsByOrder = async (
  volume: string,
  lesson: string
): Promise<PaginatedResponse<Questions>> => {
  const result = await pb.collection('questions').getList(1, 30, {
    filter: [
      'topicId.courseId.displayOrder = ' + volume,
      'topicId.ordering = ' + lesson,
    ].join(' && '),
    expand: 'topicId,topicId.courseId',
    // fields: 'title,topicId.expand.ordering',
  });

  return {
    ...result,
    items: result.items.map(record => record as unknown as Questions),
  };
};

export const getAnswerMediasByOrder = async (
  courseOrder: string,
  topicOrder?: string,
  questionOrder?: string,
  fetchMedia?: boolean
): Promise<QuestionResult[]> => {
  const filters = ['courseOrder = ' + courseOrder];
  if (topicOrder) {
    filters.push('topicOrder = ' + topicOrder);
  }
  if (questionOrder) {
    filters.push('questionOrder = ' + questionOrder);
  }

  let fileds =
    'courseTitle,topicTitle,questionTitle,questionOrder,questionCreated,description';
  if (fetchMedia) {
    fileds +=
      ',url_image,url_hd,url_sd,mp4_duration,url_downmp4,mp4_size,url_mp3,mp3_duration,url_downmp3,mp3_size,summary';
  }

  const result = await pb
    .collection('vGetQuestionsWithCourseTopic')
    .getList(1, 50, {
      filter: filters.join(' && '),
      fields: fileds,
    });
  console.log('result', result);

  if (!result) return [];
  return result?.items as unknown as QuestionResult[];
};

export const getCourseByDisplayOrder = async (
  displayOrder: string
): Promise<Course | null> => {
  try {
    const record = await pb
      .collection('courses')
      .getFirstListItem(`displayOrder="${displayOrder}"`);
    return mapRecordToCourse(record as PocketRecord);
  } catch (error) {
    console.error(`Error fetching course ${displayOrder}:`, error);
    return null;
  }
};

export const getReferenceByDisplayOrder = async (
  displayOrder: string
): Promise<Course | null> => {
  try {
    const record = await pb
      .collection('courses')
      .getFirstListItem(`displayOrder="${displayOrder}"`);
    return mapRecordToCourse(record as PocketRecord);
  } catch (error) {
    console.error(`Error fetching course ${displayOrder}:`, error);
    return null;
  }
};

/**
 *
 * @returns 课程内容列表
 */
export const getCourseTopics = async (): Promise<
  PaginatedResponse<CourseTopic>
> => {
  const result = await pb.collection('courseTopics').getFullList({
    sort: 'ordering',
    expand: 'courseId',
  });

  const mappedCourseTopics = result.map(record =>
    mapRecordToCourseTopic(record as PocketRecord)
  );

  return {
    items: mappedCourseTopics,
    totalItems: mappedCourseTopics.length,
    totalPages: 1,
    page: 1,
    perPage: mappedCourseTopics.length,
  };
};

export const getCourseTopicsByCourse = async (
  courseId: string
): Promise<PaginatedResponse<CourseTopic>> => {
  try {
    const result = await pb.collection('courseTopics').getList(1, 50, {
      filter: `courseId = "${courseId}"`,
      sort: 'ordering',
      expand: 'courseId',
      requestKey: null, // Disable auto-cancellation
    });

    return {
      ...result,
      items: result.items.map(record =>
        mapRecordToCourseTopic(record as PocketRecord)
      ),
    };
  } catch (error) {
    console.error(
      `Error fetching course topics for course ${courseId}:`,
      error
    );
    // If the filter fails, get all topics and filter client-side
    try {
      const allTopics = await getCourseTopics();
      const filteredTopics = allTopics.items.filter(
        topic => topic.courseId === courseId
      );

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

export const getCourseTopicById = async (
  topicId: string
): Promise<CourseTopic | null> => {
  try {
    const record = await pb.collection('courseTopics').getOne(topicId, {
      expand: 'courseId',
    });
    return mapRecordToCourseTopic(record as PocketRecord);
  } catch {
    // Handle error silently in server-side context
    return null;
  }
};

/**
 *
 * @param courseOrder 第几册课程 如：1
 * @param lessonOrder 课时编号 如：1
 * @returns 此课时内容
 */
export const getCourseTopicByOrder = async (
  courseOrder: string,
  lessonOrder: string
): Promise<CourseTopic | null> => {
  try {
    const record = await pb
      .collection('courseTopics')
      .getFirstListItem(
        [
          'courseId.displayOrder = ' + courseOrder,
          'ordering = ' + lessonOrder,
        ].join(' && '),
        {
          expand: 'courseId',
        }
      );

    return mapRecordToCourseTopic(record as PocketRecord);
  } catch {
    // Handle error silently in server-side context
    return null;
  }
};

/**
 *
 * @param courseOrder 第几册课程 如：1
 * @param lessonOrder 课时编号 如：1
 * @returns 此课时媒体内容
 */
export const getTopicMediaByOrder = async (
  courseOrder: string,
  topicOrder?: string
): Promise<TopicMediaX[]> => {
  try {
    // 增加超时时间和错误处理
    const filters = ['courseOrder = ' + courseOrder];
    if (topicOrder) {
      filters.push('topicOrder = ' + topicOrder);
    }

    const result = await pb.collection('vGetTopicMedia').getList(1, 50, {
      filter: filters.join(' && '),
    });
    // console.log({ courseOrder, topicOrder });

    return result?.items as unknown as TopicMediaX[];
  } catch (error) {
    console.error(
      `Error fetching topicMedia for course ${courseOrder}, lesson ${topicOrder}:`,
      error
    );
    return [];
  }
};

// Utility function to get course cover image URL
export const getCourseImageUrl = (
  course: Course,
  thumbnail = false
): string => {
  if (!course.cover) return '';
  const thumbParam = thumbnail ? '?thumb=100x0' : '';
  return `${config.apiUrl}/api/files/courses/${course.id}/${course.cover}${thumbParam}`;
};

// Utility function to get media thumbnail URL
export const getMediaImageUrl = (media: Media): string => {
  return media.url_image || media.image1_url || '';
};

export const getTagRelations = async (tag: string): Promise<TagRelation[]> => {
  if (!tag) return [];
  const resultList = await pb.collection('vGetTagRelation').getList(1, 50, {
    filter: `tags ~ "${tag}"`,
  });
  // console.log('resultList', resultList);
  return resultList.items as unknown as TagRelation[];
};

export const getSearchQuestions = async (
  title: string,
  page = 1,
  pageSize = 10,
  sort = 'desc'
): Promise<{
  items: QuestionResult[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> => {
  if (!title)
    return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };

  try {
    let totalItems = 0;
    let totalPages = 0;
    let allItems: QuestionResult[] = [];

    const result = await pb
      .collection('vGetQuestionMedia')
      .getList(page, pageSize, {
        filter: `title ~ "${title}"`,
        sort: sort === 'desc' ? '-created' : 'created',
      });
    allItems = [...allItems, ...(result.items as unknown as QuestionResult[])];
    totalItems += result.totalItems;
    totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: allItems,
      totalItems,
      totalPages,
      currentPage: page,
    };
  } catch {
    return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
};

export const getSearchArticles = async (
  title?: string,
  content?: string,
  page = 1,
  pageSize = 10,
  sort = 'asc',
  type = 'all' // all, article, av
): Promise<{
  items: TopicMediaX[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> => {
  if (!title && !content)
    return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };

  // 构建搜索过滤器
  const buildFilter = (keywords: string[], isTitle = false) => {
    const keywordFilters = keywords.map(keyword => {
      if (isTitle) {
        return `title ~ "${keyword}"`;
      }
      return `(fulltext ~ "${keyword}" || introtext ~ "${keyword}" || summary ~ "${keyword}")`;
    });
    return keywordFilters.join(' && ');
  };

  const getKeywords = (text: string) =>
    text.split(/[,\s]+/).filter(k => k.trim());

  // 构建媒体搜索过滤器（仅搜索标题）
  const buildMediaFilter = (searchText: string) => {
    if (!searchText) return '';
    return buildFilter(getKeywords(searchText), true);
  };

  // 构建文章搜索过滤器
  const buildArticleFilter = (title?: string, content?: string) => {
    if (title && content) {
      return `(title ~ "${title}" || fulltext ~ "${content}" || introtext ~ "${content}" || summary ~ "${content}")`;
    } else if (title) {
      return buildFilter(getKeywords(title), true);
    } else if (content) {
      return buildFilter(getKeywords(content), false);
    } else {
      return '';
    }
  };

  // 搜索集合的通用函数
  const searchCollection = async (collection: string, filter: string) => {
    if (!filter) return { items: [], totalItems: 0 };

    const result = await pb.collection(collection).getList(page, pageSize, {
      filter,
      sort: sort === 'desc' ? 'created' : '-created',
    });

    return {
      items: result.items as unknown as TopicMediaX[],
      totalItems: result.totalItems,
    };
  };

  try {
    let allItems: TopicMediaX[] = [];
    let totalItems = 0;

    // 根据类型搜索不同的集合
    if (type === 'all') {
      // 搜索全部：同时搜索 articles、courseMedia 和 questionMedia

      // 搜索文章
      const articleFilter = buildArticleFilter(title, content);
      const articlesResult = await searchCollection(
        'vGetArticles',
        articleFilter
      );
      allItems = [...allItems, ...articlesResult.items];
      totalItems += articlesResult.totalItems;

      // 搜索课程媒体
      const courseMediaFilter = buildMediaFilter(title || content || '');
      const courseMediaResult = await searchCollection(
        'vGetCourseMedia',
        courseMediaFilter
      );
      allItems = [...allItems, ...courseMediaResult.items];
      totalItems += courseMediaResult.totalItems;

      // 搜索问答媒体
      const questionMediaFilter = buildMediaFilter(title || content || '');
      const questionMediaResult = await searchCollection(
        'vGetQuestionMedia',
        questionMediaFilter
      );
      allItems = [...allItems, ...questionMediaResult.items];
      totalItems += questionMediaResult.totalItems;
    } else if (type === 'artile') {
      // 只搜索文章
      const articleFilter = buildArticleFilter(title, content);
      const articlesResult = await searchCollection(
        'vGetArticles',
        articleFilter
      );
      allItems = [...allItems, ...articlesResult.items];
      totalItems += articlesResult.totalItems;
    } else if (type === 'av') {
      // 搜索课程媒体和问答媒体
      const mediaFilter = buildMediaFilter(title || content || '');
      console.log({ mediaFilter });

      // 搜索课程媒体
      const courseMediaResult = await searchCollection(
        'vGetCourseMedia',
        mediaFilter
      );
      allItems = [...allItems, ...courseMediaResult.items];
      totalItems += courseMediaResult.totalItems;

      // 搜索问答媒体
      const questionMediaResult = await searchCollection(
        'vGetQuestionMedia',
        mediaFilter
      );
      allItems = [...allItems, ...questionMediaResult.items];
      totalItems += questionMediaResult.totalItems;
    }

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: allItems,
      totalItems,
      totalPages,
      currentPage: page,
    };
  } catch {
    return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
};

export const getDownloadResources = async (
  isQa = false
): Promise<DownloadResource[]> => {
  const records = await pb.collection('download').getFullList({
    filter: `name${isQa ? '' : '!'}~'问答' && isActive=true`,
    order: 'displayOrder',
  });
  return records as unknown as DownloadResource[];
};

export const getReferenceBooks = async (
  bookOrder: number
): Promise<ReferenceBook[]> => {
  const records = await pb.collection('referenceBooks').getFullList({
    filter: `displayOrder ~ ${bookOrder}`,
    order: 'displayOrder',
  });
  // console.log(records);

  return records as unknown as ReferenceBook[];
};

export const getBookChapters = async (
  chapterOrder: number
): Promise<BookChapter[]> => {
  const records = await pb.collection('bookChapters').getFullList({
    filter: `displayOrder ~ ${chapterOrder}`,
    order: 'displayOrder',
  });
  console.log(records);

  return records as unknown as BookChapter[];
};
