'use client';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { HELPER_TEXT_COLOR } from '../../constants/colors';
import type { TopicMediaX } from '../../types/models';
import CheckedIcon from '../icons/CheckedIcon';
import UncheckIcon from '../icons/UncheckIcon';
import { SearchBox } from '../shared/SearchBox';
import SearchInfoCard from './SearchInfoCard';

const searchCates = [
  { name: '全站搜索', value: 'all' },
  { name: '问答', value: 'qa' },
];

const searchModels = [
  { name: '匹配标题', value: 'title' },
  { name: '匹配内容', value: 'content' },
];

const resultSort = [
  { name: '内容从新到旧', value: 'desc' },
  { name: '内容从旧到新', value: 'asc' },
  // { name: '热门内容', value: 'hot' },
];

const resultFilter = [
  { name: '全部', value: 'all' },
  { name: '文章', value: 'artile' },
  { name: '音视频', value: 'av' },
];

// 格式化课程标题
const formatCourseTitle = (courseTitle: string): string => {
  return /第\S册/.test(courseTitle)
    ? '慧灯之光禅修 ' + courseTitle
    : courseTitle;
};

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('query');

  const [modelSelected, setModelSelected] = useState(searchModels[1].value);
  const [sort, setSort] = useState(
    searchParams.get('sort') || resultSort[0].value
  );
  const [filter, setFilter] = useState(
    searchParams.get('filter') || resultFilter[0].value
  );

  // 从URL参数获取分类，如果没有则使用默认值
  const cate = searchParams.get('cate') || searchCates[0].value;

  // 搜索结果状态
  const [searchResults, setSearchResults] = useState<TopicMediaX[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlQuery || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // 从URL参数初始化搜索
  useEffect(() => {
    if (urlQuery) {
      handleSearch(urlQuery);
    }
  }, [urlQuery]);

  // 监听URL中的filter参数变化
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter && urlFilter !== filter) {
      setFilter(urlFilter);
    }
  }, [searchParams, filter]);

  // 更新URL参数
  const updateUrl = (
    query: string,
    filterType?: string,
    cateType?: string,
    sortType?: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    if (filterType) {
      params.set('filter', filterType);
    }
    if (cateType) {
      params.set('cate', cateType);
    }
    if (sortType) {
      params.set('sort', sortType);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCate = (event.target as HTMLSelectElement).value;
    console.log({ newCate });
    // 更新URL参数
    updateUrl(searchQuery, filter, newCate, sort);
    // 如果有搜索查询，重新搜索以应用新的分类
    if (searchQuery) {
      handleSearchWithFilter(searchQuery, 1, filter, newCate); // 重置到第一页
    }
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    // 直接对当前搜索结果进行排序，不重新请求API
    if (searchResults.length > 0) {
      const sortedResults = [...searchResults].sort((a, b) => {
        const dateA = new Date(a.created).getTime();
        const dateB = new Date(b.created).getTime();
        return value === 'desc' ? dateB - dateA : dateA - dateB;
      });
      setSearchResults(sortedResults);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    // 如果有搜索查询，重新搜索以应用新的过滤条件
    if (searchQuery) {
      handleSearchWithFilter(searchQuery, 1, value, cate); // 重置到第一页，内部会更新URL
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      handleSearchWithFilter(searchQuery, newPage, filter, cate);
    }
  };

  const handleSearchWithFilter = async (
    query: string,
    page = 1,
    filterType: string,
    cateType?: string,
    sortType?: string
  ) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
      updateUrl('');
      return;
    }

    setIsLoading(true);
    setSearchQuery(query);
    setCurrentPage(page);
    updateUrl(query, filterType, cateType, sortType || sort);

    try {
      let response;

      console.log({ cate });

      // 根据分类选择不同的搜索API
      const currentCate = cateType || cate;
      const currentSort = sortType || sort;
      if (currentCate === 'qa') {
        // 问答搜索：仅搜索标题
        response = await fetch(
          `/api/search?title=${encodeURIComponent(query)}&page=${page}&pageSize=10&sort=${currentSort}&cate=qa`
        );
      } else {
        // 全站搜索：根据模型选择搜索方式
        if (modelSelected === 'title') {
          response = await fetch(
            `/api/search?title=${encodeURIComponent(query)}&page=${page}&pageSize=10&sort=${currentSort}&type=${filterType}`
          );
        } else if (modelSelected === 'content') {
          response = await fetch(
            `/api/search?content=${encodeURIComponent(query)}&page=${page}&pageSize=10&sort=${currentSort}&type=${filterType}`
          );
        }
      }

      if (response) {
        const data = await response.json();
        console.log(data);
        setSearchResults(data.items || []);
        setTotalPages(data.totalPages || 0);
        setTotalItems(data.totalItems || 0);
        setCurrentPage(data.currentPage || page);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
      updateUrl('');
      return;
    }

    setIsLoading(true);
    setSearchQuery(query);
    setCurrentPage(page);
    updateUrl(query, filter, cate, sort);

    try {
      let response;

      // 根据分类选择不同的搜索API
      if (cate === 'qa') {
        // 问答搜索：仅搜索标题
        response = await fetch(
          `/api/search?title=${encodeURIComponent(query)}&page=${page}&pageSize=10&sort=${sort}&cate=qa`
        );
      } else {
        // 全站搜索：根据模型选择搜索方式
        if (modelSelected === 'title') {
          response = await fetch(
            `/api/search?title=${encodeURIComponent(query)}&page=${page}&pageSize=10&sort=${sort}&type=${filter}`
          );
        } else if (modelSelected === 'content') {
          response = await fetch(
            `/api/search?content=${encodeURIComponent(query)}&page=${page}&pageSize=10&sort=${sort}&type=${filter}`
          );
        }
      }

      if (response) {
        const data = await response.json();
        console.log({ data });
        setSearchResults(data.items || []);
        setTotalPages(data.totalPages || 0);
        setTotalItems(data.totalItems || 0);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(180deg, rgba(224, 241, 255, 1) 0%, rgba(255, 255, 255, 0) 20.05%, rgba(217, 234, 252, 1) 33.35%, rgba(241, 247, 254, 1) 63.87%, rgba(245, 247, 251, 1) 100%),
            url(/images/search-bg.webp) no-repeat center center / contain
          `,
          filter: 'blur(40px)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: { lg: 1136, xl: 1600, xxl: 1920 },
          mr: { xs: 0, sm: 0, md: '10%', lg: '21%', xl: '30%', xxl: '30%' },
          ml: { xs: 0, sm: 0, md: '0%', lg: '8.5%', xl: '12%', xxl: '14%' },
          px: 2,
          '& .MuiTypography-body1': {
            fontSize: 14,
          },
        }}
      >
        <Box>
          <SearchBox
            onSearch={handleSearch}
            placeholder='请输入搜索关键词'
            initialValue={searchQuery}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              my: 3,
              color: 'rgba(68, 68, 68, 1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-evenly',
              }}
            >
              {cate !== 'qa' &&
                searchModels.map(item => (
                  <Box
                    key={item.value}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: 14,
                    }}
                    onClick={() => setModelSelected(item.value)}
                  >
                    {modelSelected === item.value ? (
                      <CheckedIcon sx={{ mr: 1 }} />
                    ) : (
                      <UncheckIcon sx={{ mr: 1 }} />
                    )}
                    <Typography fontSize='inherit'>{item.name}</Typography>
                  </Box>
                ))}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography fontSize={'inherit'} mr={2}>
                  分类选项：
                </Typography>
                <select
                  id='cate-select'
                  defaultValue={cate}
                  onChange={handleSelectChange}
                  style={{
                    color: 'rgba(78, 136, 219, 1)',
                    border: '1px solid rgba(212, 212, 212, 1)',
                    padding: '3px 20px 3px 4px',
                    backgroundColor: '#fff',
                  }}
                >
                  {searchCates.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>
          </Box>
          {/* 搜索过滤结束 */}
          {/* 搜索内容展示 开始 */}
          <Paper
            elevation={0}
            sx={{
              py: 2,
              px: 6,
              mb: 5,
              borderRadius: '30px',
            }}
          >
            <Box
              sx={{
                width: 260,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: 'rgba(119, 119, 119, 1)',
                }}
              >
                排序:
              </Typography>
              {resultSort.map(item => (
                <Button
                  key={item.value}
                  size='small'
                  onClick={() => handleSortChange(item.value)}
                  sx={{
                    fontSize: 14,
                    color:
                      sort === item.value
                        ? 'rgba(237, 93, 74, 1)'
                        : HELPER_TEXT_COLOR,
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
            {/* 结果排序结束 */}
            {/* 结果过滤开始 */}
            <Box
              sx={{
                bgcolor: 'rgba(247, 249, 250, 1)',
                borderRadius: '10px',
                p: 1,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  width: '70%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  mb: 2,
                }}
              >
                {cate !== 'qa' &&
                  resultFilter.map(item => (
                    <Button
                      key={item.value}
                      size='small'
                      variant={filter === item.value ? 'contained' : 'text'}
                      onClick={() => handleFilterChange(item.value)}
                      sx={{
                        borderRadius: '30px',
                        fontSize: 14,
                        width: 80,
                        height: 22,
                        bgcolor:
                          filter === item.value
                            ? 'rgba(245, 147, 135, 1)'
                            : 'transparent',
                        color:
                          filter === item.value ? '#fff' : HELPER_TEXT_COLOR,
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: HELPER_TEXT_COLOR,
                  fontSize: 12,
                  px: 1,
                }}
              >
                <Typography variant='body2' fontSize={'inherit'}>
                  共找到{' '}
                  <span style={{ color: 'rgba(237, 93, 74, 1)' }}>
                    {isLoading ? '...' : totalItems}
                  </span>{' '}
                  条
                </Typography>
                {totalPages > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size='small'
                      color='inherit'
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      sx={{ minWidth: 'auto', px: 0.5 }}
                    >
                      &lt;
                    </Button>
                    <Typography fontSize={'inherit'}>
                      <span style={{ color: 'rgba(237, 93, 74, 1)' }}>
                        {currentPage}
                      </span>
                      /{totalPages}
                    </Typography>
                    <Button
                      color='inherit'
                      size='small'
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      sx={{ minWidth: 'auto', px: 0.5 }}
                    >
                      &gt;
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 4,
                }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : searchResults.length > 0 ? (
              <Stack spacing={2}>
                {searchResults.map((item: TopicMediaX, index) => {
                  // 判断是文章还是音视频数据
                  const isArticle =
                    'fulltext' in item ||
                    'introtext' in item ||
                    'summary' in item;
                  const itemType = isArticle ? '文章' : '音视频';
                  // 获取课程信息
                  const courseInfo = {
                    courseTitle:
                      (item as TopicMediaX).courseTitle || '未知课程',
                    courseOrder: (item as TopicMediaX).courseOrder || '',
                    topicOrder: (item as TopicMediaX).topicOrder || '',
                    mediaType:
                      item?.mediaType === 'course'
                        ? ('course' as const)
                        : ('qa' as const),
                  };

                  return (
                    <Fragment key={index}>
                      <SearchInfoCard
                        index={index + 1}
                        title={item.title}
                        content={
                          isArticle ? item.fulltext || item.introtext || '' : ''
                        }
                        from={
                          isArticle
                            ? `纸质图书/${formatCourseTitle(courseInfo.courseTitle)}`
                            : `音视频/${formatCourseTitle(courseInfo.courseTitle) || '未知课程'}`
                        }
                        type={itemType}
                        url={
                          isArticle
                            ? `/course/${courseInfo.courseOrder}/lesson${courseInfo.topicOrder}?tab=article`
                            : `/${courseInfo.mediaType}/${courseInfo.courseOrder}/lesson${courseInfo.topicOrder}`
                        }
                        keywords={searchQuery ? [searchQuery] : []}
                      />
                      {index < searchResults.length - 1 && (
                        <Divider sx={{ color: '#F0F0F0' }} />
                      )}
                    </Fragment>
                  );
                })}
              </Stack>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: HELPER_TEXT_COLOR,
                }}
              >
                <Typography>未找到相关结果</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;
