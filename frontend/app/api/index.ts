import PocketBase from 'pocketbase';
import { Menu } from '../components/pc/MenuItem';
import {
  BookChapter,
  Category,
  Course,
  CourseTopic,
  Dict,
  DownloadResource,
  PaginatedResponse,
  PocketRecord,
  QuestionResult,
  QuestionResultGrouped,
  ReferenceBook,
  SearchCate,
  SearchType,
  TagRelation,
  TopicMediaX,
} from '../types/models';
import {
  CategorySchema,
  CourseSchema,
  CourseTopicSchema,
  QuestionResultSchema,
  TagRelationSchema,
  validateWithZod,
} from './validators';

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

export const getContentWaitingForUpdateText = async (): Promise<string> => {
  try {
    const resultList = await pb.collection('dicts').getList(1, 50, {
      filter: 'key="content_waiting_for_update"',
      fields: 'value',
    });
    const result = resultList.items as unknown as Dict[];
    return result[0]?.value || '';
  } catch (error) {
    console.error(error);
    return '';
  }
};

// Search utility functions
export const getKeywords = (text: string): string[] =>
  text.split(/[,\s]+/).filter(k => k.trim());

export const buildFilter = (keywords: string[], isTitle = false): string => {
  const keywordFilters = keywords.map(keyword => {
    if (isTitle) {
      return `title ~ "${keyword}"`;
    }
    return `(fulltext ~ "${keyword}" || introtext ~ "${keyword}" || summary ~ "${keyword}")`;
  });
  return keywordFilters.join(' && ');
};

export const buildMediaFilter = (searchText: string): string => {
  if (!searchText) return '';
  return buildFilter(getKeywords(searchText), true);
};

export const buildArticleFilter = (
  title?: string,
  content?: string
): string => {
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

export const searchCollection = async (
  collection: string,
  filter: string,
  page = 1,
  pageSize = 10,
  sort = 'asc'
): Promise<{ items: TopicMediaX[]; totalItems: number }> => {
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

interface SearchConfig {
  collections: Array<{
    name: string;
    filterBuilder: (title?: string, content?: string) => string;
  }>;
}

const searchConfigs: Record<SearchType, SearchConfig> = {
  all: {
    collections: [
      { name: 'vGetArticles', filterBuilder: buildArticleFilter },
      { name: 'vGetReference', filterBuilder: buildArticleFilter },
      {
        name: 'vGetCourseMedia',
        filterBuilder: (title, content) =>
          buildMediaFilter(title || content || ''),
      },
      {
        name: 'vGetQuestionMedia',
        filterBuilder: (title, content) =>
          buildMediaFilter(title || content || ''),
      },
    ],
  },
  article: {
    collections: [
      { name: 'vGetArticles', filterBuilder: buildArticleFilter },
      { name: 'vGetReference', filterBuilder: buildArticleFilter },
    ],
  },
  av: {
    collections: [
      {
        name: 'vGetCourseMedia',
        filterBuilder: (title, content) =>
          buildMediaFilter(title || content || ''),
      },
      {
        name: 'vGetQuestionMedia',
        filterBuilder: (title, content) =>
          buildMediaFilter(title || content || ''),
      },
      {
        name: 'vGetReferenceMedia',
        filterBuilder: (title, content) =>
          buildMediaFilter(title || content || ''),
      },
    ],
  },
};

const mapRecordToCategory = (record: PocketRecord): Category => {
  return validateWithZod(
    CategorySchema,
    record,
    `Invalid category data (id: ${record.id})`
  );
};

const mapRecordToCourse = (record: PocketRecord): Course => {
  const course = validateWithZod(
    CourseSchema,
    record,
    `Invalid course data (id: ${record.id})`
  ) as Course;

  // 处理 expand 字段（如果需要）
  if (record.expand?.categoryId) {
    course.category = mapRecordToCategory(record.expand.categoryId);
  }

  return course;
};

const mapRecordToCourseTopic = (record: PocketRecord): CourseTopic => {
  // 预处理数据，确保符合 schema（处理可选字段和默认值）
  // tags 可能是数组，需要转换为字符串
  let tagsValue: string | undefined = undefined;
  if (record.tags) {
    if (Array.isArray(record.tags)) {
      tagsValue = record.tags.join(',');
    } else if (typeof record.tags === 'string') {
      tagsValue = record.tags;
    }
  }

  const processedRecord = {
    ...record,
    courseId: record.courseId || '',
    article_title: record.article_title || '',
    article_alias: record.article_alias || '',
    ordering: record.ordering || 0,
    title: record.article_title || record.title || '',
    topicOrder: record.ordering || record.topicOrder || 0,
    hasVideo: record.hasVideo ?? !!record.url,
    hasAudio: record.hasAudio ?? !!record.url_mp3,
    hasText: record.hasText ?? !!record.article_fulltext,
    hasQA: record.hasQA ?? false,
    isActive: record.isActive !== false,
    // 处理 tags 字段：数组转字符串
    tags: tagsValue,
  };

  const courseTopic = validateWithZod(
    CourseTopicSchema,
    processedRecord,
    `Invalid course topic data (id: ${record.id})`
  ) as CourseTopic;

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

    return result.map(({ name, description, slug, subMenu }) => {
      return {
        name,
        description,
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

    // 转换并验证每个结果，单个记录失败不影响其他记录
    const mappedCourses: Course[] = [];
    for (const record of result) {
      try {
        const course = mapRecordToCourse(record as PocketRecord);
        mappedCourses.push(course);
      } catch (error) {
        // 单个记录验证失败，记录错误但继续处理其他记录
        console.error(
          `Skipping invalid course record (id: ${record.id || 'unknown'}):`,
          error
        );
        if (process.env.NODE_ENV === 'development') {
          console.error('Record data:', record);
        }
      }
    }

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

export const getAnswerMediasByOrder = async (
  courseOrder: string,
  topicOrder?: string,
  fetchMedia?: boolean
): Promise<QuestionResultGrouped[]> => {
  const filters = ['courseOrder = ' + courseOrder];
  if (topicOrder) {
    filters.push('topicOrder = ' + topicOrder);
  }

  let fileds =
    'courseTitle,topicTitle,topicOrder,questionTitle,questionContent,questionOrder,questionCreated,description,isActive';
  if (fetchMedia) {
    fileds +=
      ',url_image,url_hd,url_sd,mp4_duration,url_downmp4,mp4_size,url_mp3,mp3_duration,url_downmp3,mp3_size,summary';
  }

  const result = await pb.collection('vGetAnswerMedias').getFullList({
    filter: filters.join(' && '),
    fields: fileds,
  });
  // console.log('result', result);

  if (!result) return [];

  // 验证并转换数据（预处理：视图数据可能缺少基础字段）
  const items: QuestionResult[] = [];
  for (const record of result) {
    try {
      // 预处理数据，补充可能缺失的基础字段并处理类型转换
      const processedRecord = {
        // 先展开原有数据
        ...record,
        // 基础字段（视图可能没有，提供默认值）- 后设置会覆盖前面的
        id: String(record.id || `temp_${Date.now()}_${Math.random()}`),
        created: record.created || new Date().toISOString(),
        updated: record.updated || record.created || new Date().toISOString(),
        // title 可能不存在，使用 questionTitle 作为后备
        title: record.title || record.questionTitle || '',
        // 确保 topicOrder 和 questionOrder 是数字（可能是字符串）
        topicOrder:
          typeof record.topicOrder === 'number'
            ? record.topicOrder
            : typeof record.topicOrder === 'string'
              ? Number.parseInt(record.topicOrder, 10) || 0
              : 0,
        questionOrder:
          typeof record.questionOrder === 'number'
            ? record.questionOrder
            : typeof record.questionOrder === 'string'
              ? Number.parseInt(record.questionOrder, 10) || 0
              : 0,
      };

      const validated = validateWithZod(
        QuestionResultSchema,
        processedRecord,
        `Invalid question result data (id: ${processedRecord.id})`
      );
      items.push(validated);
    } catch (error) {
      // 单个记录验证失败，记录错误但继续处理其他记录
      console.error(
        `Skipping invalid question result record (id: ${record.id || 'unknown'}):`,
        error
      );
      if (process.env.NODE_ENV === 'development') {
        console.error('Record data:', record);
      }
    }
  }

  // 按 topicTitle 分组
  const groupedMap = new Map<string, QuestionResult[]>();
  for (const item of items) {
    const topicTitle = item.topicTitle || '';
    if (!groupedMap.has(topicTitle)) {
      groupedMap.set(topicTitle, []);
    }
    groupedMap.get(topicTitle)!.push(item);
  }

  // 转换为数组格式
  const grouped: QuestionResultGrouped[] = Array.from(groupedMap.entries()).map(
    ([topicTitle, questions]) => ({
      topicTitle,
      questions,
    })
  );

  return grouped;
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

export const getCourseTopicsByCourse = async (
  courseId: string
): Promise<PaginatedResponse<CourseTopic>> => {
  try {
    const result = await pb.collection('courseTopics').getFullList({
      filter: `courseId = "${courseId}"`,
      sort: 'ordering',
      expand: 'courseId',
      requestKey: null, // Disable auto-cancellation
    });

    // 转换并验证每个结果，单个记录失败不影响其他记录
    const mappedTopics: CourseTopic[] = [];
    for (const record of result) {
      try {
        const topic = mapRecordToCourseTopic(record as PocketRecord);
        mappedTopics.push(topic);
      } catch (error) {
        // 单个记录验证失败，记录错误但继续处理其他记录
        console.error(
          `Skipping invalid course topic record (id: ${record.id || 'unknown'}):`,
          error
        );
        if (process.env.NODE_ENV === 'development') {
          console.error('Record data:', record);
        }
      }
    }

    return {
      items: mappedTopics,
      totalItems: mappedTopics.length,
      totalPages: 1,
      page: 1,
      perPage: mappedTopics.length,
    };
  } catch (error) {
    console.error(
      `Error fetching course topics for course ${courseId}:`,
      error
    );
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
 * @param courseOrder 第几册课程 如：1
 * @param topicOrder 课时编号 如：1
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

    const result = await pb.collection('vGetTopicMedia').getFullList({
      filter: filters.join(' && '),
    });
    // console.log({ courseOrder, topicOrder });

    return result as unknown as TopicMediaX[];
  } catch (error) {
    console.error(
      `Error fetching topicMedia for course ${courseOrder}, lesson ${topicOrder}:`,
      error
    );
    return [];
  }
};

export const getTagRelations = async (tag: string): Promise<TagRelation[]> => {
  if (!tag) return [];
  try {
    const resultList = await pb.collection('vGetTagRelation').getFullList({
      filter: `tags ~ "${tag}"`,
    });

    // 转换并验证每个结果
    const validatedResults: TagRelation[] = [];
    for (const record of resultList) {
      try {
        // 数据格式转换：处理可能的类型不匹配和缺失字段
        const transformedRecord = {
          ...record,
          // 确保 id, created, updated 存在
          id: String(record.id ?? ''),
          created: record.created ?? new Date().toISOString(),
          updated: record.updated ?? record.created ?? new Date().toISOString(),
          // 如果 tags 是字符串，转换为数组
          tags: Array.isArray(record.tags)
            ? record.tags
            : typeof record.tags === 'string'
              ? record.tags
                  .split(',')
                  .map(t => t.trim())
                  .filter(Boolean)
              : [],
          // 确保 courseOrder 和 topicOrder 是字符串（可能是数字）
          courseOrder: String(record.courseOrder ?? ''),
          topicOrder: String(record.topicOrder ?? ''),
          // 处理可能缺失的 topicActive 字段
          topicActive:
            record.topicActive !== undefined
              ? Boolean(record.topicActive)
              : record.courseActive !== undefined
                ? Boolean(record.courseActive)
                : true,
        };

        const validated = validateWithZod(
          TagRelationSchema,
          transformedRecord,
          `Invalid tag relation data (id: ${record.id || 'unknown'})`
        );
        validatedResults.push(validated);
      } catch (error) {
        // 单个记录验证失败，记录错误但继续处理其他记录
        console.error(
          `Skipping invalid tag relation record (id: ${record.id || 'unknown'}):`,
          error
        );
        if (process.env.NODE_ENV === 'development') {
          console.error('Record data:', record);
        }
      }
    }

    return validatedResults;
  } catch (error) {
    console.error('Error fetching tag relations:', error);
    return [];
  }
};

export const getSearchResults = async (
  title?: string,
  content?: string,
  page = 1,
  pageSize = 10,
  sort = 'asc',
  type: SearchType = 'all',
  cate: SearchCate = 'all'
): Promise<{
  items: TopicMediaX[] | QuestionResult[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> => {
  console.log('Search called:', { title, content, type, cate, pageSize });

  if (!title && !content) {
    return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }

  try {
    // 问答搜索：仅搜索标题
    if (cate === 'qa') {
      const searchTerm = title || content;
      if (!searchTerm) {
        return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
      }

      const result = await pb
        .collection('vGetQuestionMedia')
        .getList(page, pageSize, {
          filter: `title ~ "${searchTerm}"`,
          sort: sort === 'desc' ? '-created' : 'created',
        });

      const totalPages = Math.ceil(result.totalItems / pageSize);

      return {
        items: result.items as unknown as QuestionResult[],
        totalItems: result.totalItems,
        totalPages,
        currentPage: page,
      };
    }

    // 课程搜索：根据 searchType 过滤文章和课程媒体
    if (cate === 'course') {
      let courseCollections: Array<{
        name: string;
        filterBuilder: (title?: string, content?: string) => string;
      }> = [];

      // 根据 searchType 确定要搜索的集合
      if (type === 'article') {
        // 只搜索课程文章
        courseCollections = [
          { name: 'vGetArticles', filterBuilder: buildArticleFilter },
        ];
      } else if (type === 'av') {
        // 只搜索课程媒体
        courseCollections = [
          {
            name: 'vGetCourseMedia',
            filterBuilder: (title?: string, content?: string) =>
              buildMediaFilter(title || content || ''),
          },
        ];
      } else {
        // 默认搜索所有类型（all 或其他）
        courseCollections = [
          { name: 'vGetArticles', filterBuilder: buildArticleFilter },
          {
            name: 'vGetCourseMedia',
            filterBuilder: (title?: string, content?: string) =>
              buildMediaFilter(title || content || ''),
          },
        ];
      }

      const allItems: TopicMediaX[] = [];
      let totalItems = 0;

      // 并行搜索课程相关的集合，智能分配数量
      const searchPromises = courseCollections.map(
        async ({ name, filterBuilder }) => {
          const filter = filterBuilder(title, content);
          if (!filter) return { items: [], totalItems: 0 };
          // 获取足够的数据来支持当前页
          return searchCollection(name, filter, 1, pageSize * page, sort);
        }
      );

      const results = await Promise.all(searchPromises);
      // 合并搜索结果
      results.forEach(result => {
        allItems.push(...result.items);
        totalItems += result.totalItems;
      });

      // 应用分页确保返回正确的数量
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = allItems.slice(startIndex, endIndex);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        items: paginatedItems,
        totalItems,
        totalPages,
        currentPage: page,
      };
    }

    // 参考资料搜索：根据 searchType 过滤参考资料和参考资料媒体
    if (cate === 'reference') {
      let referenceCollections: Array<{
        name: string;
        filterBuilder: (title?: string, content?: string) => string;
      }> = [];

      // 根据 searchType 确定要搜索的集合
      if (type === 'article') {
        // 只搜索参考资料文章
        referenceCollections = [
          { name: 'vGetReference', filterBuilder: buildArticleFilter },
        ];
      } else if (type === 'av') {
        // 只搜索参考资料媒体
        referenceCollections = [
          {
            name: 'vGetReferenceMedia',
            filterBuilder: (title?: string, content?: string) =>
              buildMediaFilter(title || content || ''),
          },
        ];
      } else {
        // 默认搜索所有类型（all 或其他）
        referenceCollections = [
          { name: 'vGetReference', filterBuilder: buildArticleFilter },
          {
            name: 'vGetReferenceMedia',
            filterBuilder: (title?: string, content?: string) =>
              buildMediaFilter(title || content || ''),
          },
        ];
      }

      const allItems: TopicMediaX[] = [];
      let totalItems = 0;

      // 并行搜索参考资料相关的集合
      const searchPromises = referenceCollections.map(
        async ({ name, filterBuilder }) => {
          const filter = filterBuilder(title, content);
          if (!filter) {
            return { items: [], totalItems: 0 };
          }
          return searchCollection(name, filter, page, pageSize, sort);
        }
      );

      const results = await Promise.all(searchPromises);

      // 合并搜索结果
      results.forEach(result => {
        allItems.push(...result.items);
        totalItems += result.totalItems;
      });

      const totalPages = Math.ceil(totalItems / pageSize);
      // console.log(`Reference search: ${totalItems} items found`);

      return {
        items: allItems,
        totalItems,
        totalPages,
        currentPage: page,
      };
    }

    // 全站搜索 (默认行为)
    const config = searchConfigs[type];
    if (!config) {
      throw new Error(`Invalid search type: ${type}`);
    }

    const allItems: TopicMediaX[] = [];
    let totalItems = 0;

    // 第一阶段：并行获取各集合的总数
    const countPromises = config.collections.map(
      async ({ name, filterBuilder }) => {
        const filter = filterBuilder(title, content);
        const result = await pb.collection(name).getList(1, 1, { filter });
        return { name, count: result.totalItems };
      }
    );

    const counts = await Promise.all(countPromises);
    const totalCountAcrossAll = counts.reduce((sum, c) => sum + c.count, 0);

    // 第二阶段：按比例分配搜索数量，获取足够数据支持分页
    const searchPromises = config.collections.map(
      async ({ name, filterBuilder }) => {
        const filter = filterBuilder(title, content);
        const collectionCount = counts.find(c => c.name === name)?.count || 0;

        // 按比例分配，确保总数不超过pageSize，每个集合至少1个项目
        const allocatedSize =
          collectionCount === 0
            ? 0
            : Math.max(
                1,
                Math.min(
                  pageSize,
                  Math.ceil((pageSize * collectionCount) / totalCountAcrossAll)
                )
              );

        if (allocatedSize === 0) return { items: [], totalItems: 0 };

        // 获取足够的数据来支持当前页：每集合获取 allocatedSize * page 的数据
        const fetchSize = Math.min(allocatedSize * page, collectionCount);
        return searchCollection(name, filter, 1, fetchSize, sort);
      }
    );

    const results = await Promise.all(searchPromises);

    // 合并搜索结果
    results.forEach(result => {
      allItems.push(...result.items);
      totalItems += result.totalItems;
    });

    // 应用分页确保返回正确的数量
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = allItems.slice(startIndex, endIndex);

    const totalPages = Math.ceil(totalItems / pageSize);
    console.log(`Global search (${type}): ${totalItems} items found`);

    return {
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Search error:', error);
    return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
};

export const getDownloadResources = async (
  isQa = false,
  courseOrder?: string,
  lessonOrder?: string
): Promise<DownloadResource[]> => {
  const filters = [
    `downType="${isQa ? `qa${courseOrder}` : 'downpage'}"`,
    lessonOrder ? `displayOrder="${lessonOrder}"` : '',
    'isActive=true',
  ]
    .filter(Boolean)
    .join(' && ');

  const records = await pb.collection('download').getFullList({
    filter: filters,
    sort: 'displayOrder',
  });
  return records as unknown as DownloadResource[];
};

export const getBookChapters = async (
  bookOrder: string,
  chapterOrder?: string
): Promise<BookChapter[]> => {
  // console.log({ bookOrder, chapterOrder });

  let filters = `bookId.displayOrder = ${bookOrder}`;
  if (chapterOrder) {
    filters += `&& ordering = ${chapterOrder}`;
  }
  const records = await pb.collection('bookChapters').getFullList({
    filter: filters,
    sort: 'ordering',
    expand: 'bookId',
  });

  return records as unknown as BookChapter[];
};

export const getReferenceBooks = async (): Promise<ReferenceBook[]> => {
  const records = await pb.collection('referenceBooks').getFullList({
    filter: 'isActive = true',
  });

  return records as unknown as ReferenceBook[];
};

export const getBookMediaByOrder = async (
  bookOrder: string,
  chapterOrder?: string
): Promise<TopicMediaX[]> => {
  try {
    // 增加超时时间和错误处理
    const filters = ['courseOrder = ' + bookOrder];
    if (chapterOrder) {
      filters.push('topicOrder = ' + chapterOrder);
    }

    const result = await pb.collection('vGetBookMedia').getFullList({
      filter: filters.join(' && '),
    });
    // console.log({ courseOrder, topicOrder });
    // console.log({ result });
    return result as unknown as TopicMediaX[];
  } catch (error) {
    console.error(
      `Error fetching topicMedia for book ${bookOrder}, lesson ${chapterOrder}:`,
      error
    );
    return [];
  }
};
