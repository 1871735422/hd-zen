'use client';
import { pxToVw } from '@/app/utils/mobileUtils';
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
import { HELPER_TEXT_COLOR, MAIN_BLUE_COLOR } from '../../constants/colors';
import type { TopicMediaX } from '../../types/models';
import CheckedIcon from '../icons/CheckedIcon';
import UncheckIcon from '../icons/UncheckIcon';
import { CustomPagination } from '../shared';
import { SearchBox } from '../shared/SearchBox';
import SearchInfoCard from './SearchInfoCard';

const searchCates = [
  { name: '全站搜索', value: 'all' },
  { name: '慧灯禅修课', value: 'course' },
  { name: '禅修课问答', value: 'qa' },
  { name: '学修参考资料', value: 'reference' },
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

const searchTypes = [
  { name: '全部', value: 'all' },
  { name: '文章', value: 'article' },
  { name: '音视频', value: 'av' },
];

// 格式化课程标题
const formatCourseTitle = (courseTitle: string, mediaType?: string): string => {
  if (mediaType === 'qa') {
    return '禅修课问答/' + courseTitle;
  }

  return /(第\S册|(寂止|空性)的修法)/.test(courseTitle)
    ? '慧灯禅修课/禅修课 ' + courseTitle
    : '学修参考资料/' + courseTitle;
};

const SearchPage = ({ isMobile }: { isMobile: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlKeywords = searchParams.get('keywords');

  const [modelSelected, setModelSelected] = useState(searchModels[1].value);
  const [sort, setSort] = useState(
    searchParams.get('sort') || resultSort[0].value
  );
  const [searchType, setSearchType] = useState(
    searchParams.get('searchType') || searchTypes[0].value
  );

  // 从URL参数获取分类，如果没有则使用默认值
  const cate = searchParams.get('cate') || searchCates[0].value;

  // 搜索结果状态
  const [searchResults, setSearchResults] = useState<TopicMediaX[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState(urlKeywords || '');
  // 从URL参数获取页码，如果没有则默认为1
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // 监听URL中的page参数变化
  useEffect(() => {
    const urlPageParam = parseInt(searchParams.get('page') || '1', 10);
    if (urlPageParam !== currentPage) {
      setCurrentPage(urlPageParam);
    }
  }, [searchParams, currentPage]);

  // 从URL参数初始化搜索
  useEffect(() => {
    if (urlKeywords) {
      handleSearch(urlKeywords, urlPage);
    }
  }, [urlKeywords, urlPage]);

  // 监听URL中的searchType参数变化
  useEffect(() => {
    const urlSearchType = searchParams.get('searchType');
    if (urlSearchType && urlSearchType !== searchType) {
      setSearchType(urlSearchType);
    }
  }, [searchParams, searchType]);

  // 监听URL中的page参数变化，当页面参数改变时重新搜索
  useEffect(() => {
    if (urlKeywords && urlPage > 1) {
      handleSearch(urlKeywords, urlPage);
    }
  }, [urlPage]);

  // 更新URL参数
  const updateUrl = (
    keywords: string,
    searchTypeParam?: string,
    cateType?: string,
    sortType?: string,
    pageParam?: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (keywords) {
      params.set('keywords', keywords);
      params.delete('content'); // 移除旧的 content 参数
    } else {
      params.delete('keywords');
      params.delete('content');
    }
    if (searchTypeParam) {
      params.set('searchType', searchTypeParam);
    }
    if (cateType) {
      params.set('cate', cateType);
    }
    if (sortType) {
      params.set('sort', sortType);
    }
    if (pageParam && pageParam > 1) {
      params.set('page', pageParam.toString());
    } else {
      params.delete('page'); // 第一页不显示page参数
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCate = (event.target as HTMLSelectElement).value;
    // 更新URL参数，重置到第一页
    updateUrl(searchKeywords, searchType, newCate, sort, 1);
    // 如果有搜索查询，重新搜索以应用新的分类
    if (searchKeywords) {
      handleSearchWithFilter(searchKeywords, 1, searchType, newCate); // 重置到第一页
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

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    // 如果有搜索查询，重新搜索以应用新的过滤条件
    if (searchKeywords) {
      handleSearchWithFilter(searchKeywords, 1, value, cate); // 重置到第一页，内部会更新URL
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      // 更新URL参数以保持浏览器历史
      updateUrl(searchKeywords, searchType, cate, sort, newPage);
      handleSearchWithFilter(searchKeywords, newPage, searchType, cate);
    }
  };

  const handleSearchWithFilter = async (
    keywords: string,
    page = 1,
    searchTypeParam: string,
    cateType?: string,
    sortType?: string
  ) => {
    if (!keywords.trim()) {
      setSearchResults([]);
      setSearchKeywords('');
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
      updateUrl('');
      return;
    }

    setIsLoading(true);
    setSearchKeywords(keywords);
    setCurrentPage(page);
    // 不在handleSearchWithFilter中更新URL，因为调用者已经更新了
    // updateUrl(keywords, searchTypeParam, cateType, sortType || sort);

    try {
      // 根据分类选择不同的搜索API
      const currentCate = cateType || cate;
      const currentSort = sortType || sort;
      const response = await fetch(
        `/api/search?${modelSelected === 'title' ? 'title' : 'keywords'}=${encodeURIComponent(keywords)}&page=${page}&pageSize=10&sort=${currentSort}&cate=${currentCate}&searchType=${searchTypeParam}`
      );

      if (response) {
        const data = await response.json();
        console.log('currentCate', currentCate, 'search data', data);
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

  const handleSearch = async (keywords: string, page = 1) => {
    if (!keywords.trim()) {
      setSearchResults([]);
      setSearchKeywords('');
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
      updateUrl('');
      return;
    }

    setIsLoading(true);
    setSearchKeywords(keywords);
    setCurrentPage(page);
    updateUrl(keywords, searchType, cate, sort, page);

    try {
      // 简化统一搜索API调用逻辑
      const queryKey = modelSelected === 'title' ? 'title' : 'keywords';
      const params = [
        `${queryKey}=${encodeURIComponent(keywords)}`,
        `page=${page}`,
        'pageSize=10',
        `sort=${sort}`,
        `cate=${cate}`,
        `searchType=${searchType}`,
      ].join('&');
      const response = await fetch(`/api/search?${params}`);
      if (response) {
        const data = await response.json();
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

  const SearchFilter = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          my: 3,
          px: isMobile ? pxToVw(35) : 0,
          '& .MuiTypography-body1': {
            fontSize: isMobile ? pxToVw(14) : 14,
            color: isMobile ? 'rgba(119, 119, 119, 1)' : 'rgba(68, 68, 68, 1)',
          },
        }}
      >
        <Stack
          sx={{
            flexDirection: isMobile ? 'column' : 'row',
            flex: 2,
            justifyContent: 'space-evenly',
            gap: 2,
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
                }}
                onClick={() => setModelSelected(item.value)}
              >
                {modelSelected === item.value ? (
                  <CheckedIcon sx={{ mr: 1 }} />
                ) : (
                  <UncheckIcon sx={{ mr: 1 }} />
                )}
                <Typography variant='body1'>{item.name}</Typography>
              </Box>
            ))}
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            flex: 3,
            justifyContent: 'center',
            gap: isMobile ? pxToVw(1) : 3,
          }}
        >
          <Typography variant='body1'>分类选项：</Typography>
          <select
            id='cate-select'
            defaultValue={cate}
            onChange={handleSelectChange}
            style={{
              width: isMobile ? pxToVw(105) : 'auto',
              height: isMobile ? pxToVw(29) : 'auto',
              borderRadius: isMobile ? pxToVw(23) : 'none',
              color: 'rgba(78, 136, 219, 1)',
              border: '1px solid rgba(212, 212, 212, 1)',
              padding: '3px 20px 3px 4px',
              backgroundColor: '#fff',
              fontSize: isMobile ? pxToVw(13) : 14,
            }}
          >
            {searchCates.map(item => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </Stack>
      </Box>
    );
  };

  const ResultSort = () => {
    return (
      <>
        <Box
          sx={{
            width: isMobile ? pxToVw(260) : 260,
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
              fontSize: isMobile ? pxToVw(13) : '',
            }}
          >
            排序:
          </Typography>
          {resultSort.map(item => (
            <Button
              key={item.value}
              onClick={() => handleSortChange(item.value)}
              sx={
                isMobile
                  ? {
                      borderRadius: pxToVw(30),
                      px: pxToVw(10),
                      py: pxToVw(1),
                      fontSize: pxToVw(13),
                      background:
                        sort === item.value
                          ? 'linear-gradient(90deg, rgba(165, 209, 240, 1) 0%, rgba(173, 178, 247, 1) 100%)'
                          : 'rgba(242, 247, 255, 1)',
                      color: sort === item.value ? '#fff' : MAIN_BLUE_COLOR,
                    }
                  : {
                      color:
                        sort === item.value
                          ? 'rgba(237, 93, 74, 1)'
                          : HELPER_TEXT_COLOR,
                    }
              }
            >
              {item.name}
            </Button>
          ))}
        </Box>
        {/* 结果排序结束 */}
        {/* 结果过滤开始 */}
        <Box
          sx={{
            bgcolor: isMobile
              ? 'rgba(250, 250, 250, 1)'
              : 'rgba(247, 249, 250, 1)',
            borderRadius: isMobile ? pxToVw(18) : '10px',
            p: 1,
            mt: isMobile ? pxToVw(18) : 1,
          }}
        >
          <Box
            sx={{
              width: '70%',
              display: 'flex',
              justifyContent: 'space-around',
              mb: isMobile ? pxToVw(6) : 2,
              mx: isMobile ? 'auto' : 0,
              fontSize: isMobile ? pxToVw(13) : 14,
            }}
          >
            {cate !== 'qa' &&
              searchTypes.map(item => (
                <Button
                  key={item.value}
                  size='small'
                  variant={searchType === item.value ? 'contained' : 'text'}
                  onClick={() => handleSearchTypeChange(item.value)}
                  sx={{
                    fontSize: isMobile ? pxToVw(13) : 14,
                    borderRadius: isMobile ? pxToVw(30) : '30px',
                    width: isMobile ? pxToVw(64) : 80,
                    height: isMobile ? pxToVw(24) : 22,
                    bgcolor:
                      searchType === item.value
                        ? 'rgba(245, 147, 135, 1)'
                        : isMobile
                          ? 'rgba(240, 237, 233, 1)'
                          : 'transparent',
                    color:
                      searchType === item.value
                        ? '#fff'
                        : isMobile
                          ? 'rgba(168, 159, 143, 1)'
                          : HELPER_TEXT_COLOR,
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
      </>
    );
  };

  const SearchResutList = () => {
    return (
      <Box>
        {isLoading ? (
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <CircularProgress size={40} />
          </Stack>
        ) : searchResults.length > 0 ? (
          <Stack spacing={2}>
            {searchResults.map((item: TopicMediaX, index) => {
              // 判断是文章还是音视频数据
              const isArticle = item?.fulltext || item?.introtext;
              // console.log(index + 1, item);

              // 搜到 summary当作视频
              const itemType = isArticle ? '文章' : '音视频';
              // 获取课程信息
              const courseInfo = {
                courseTitle: (item as TopicMediaX).courseTitle || '未知课程',
                courseOrder: (item as TopicMediaX).courseOrder || '',
                topicOrder: (item as TopicMediaX).topicOrder || '',
                mediaType: item?.mediaType,
              };

              return (
                <Fragment key={index}>
                  <SearchInfoCard
                    index={index + 1}
                    title={item.title}
                    content={
                      isArticle
                        ? item.fulltext || item.introtext || ''
                        : item?.summary
                          ? `<p><b>概述：</b>${item?.summary}</p>`
                          : ''
                    }
                    from={
                      isArticle
                        ? formatCourseTitle(courseInfo.courseTitle)
                        : `音视频/${formatCourseTitle(courseInfo.courseTitle, courseInfo.mediaType)}`
                    }
                    type={itemType}
                    url={`/${courseInfo.mediaType}/${courseInfo.courseOrder}/lesson${courseInfo.topicOrder}${
                      isArticle
                        ? `?tab=article#highlight=${encodeURIComponent(searchKeywords)}`
                        : courseInfo.mediaType === 'qa'
                          ? `?title=${item?.title || 1}#highlight=${encodeURIComponent(searchKeywords)}`
                          : `#highlight=${encodeURIComponent(searchKeywords)}`
                    }`}
                    keywords={searchKeywords ? [searchKeywords] : []}
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
      </Box>
    );
  };
  // 移动端渲染
  if (isMobile) {
    return (
      <Stack
        sx={{
          flex: 1,
          background:
            'linear-gradient(0deg, rgba(250, 252, 255, 1) 0%, rgba(227, 241, 255, 1) 100%)',
          boxShadow: '0px 0px 10px  rgba(215, 228, 252, 1)',
        }}
      >
        <SearchFilter />
        <Box
          sx={{
            p: pxToVw(18),
            borderRadius: `${pxToVw(30)} ${pxToVw(30)} 0 0`,
            background: '#fff',
            boxShadow: '0px 0px 10px  rgba(215, 228, 252, 1)',
            flex: 1,
          }}
        >
          <ResultSort />
          <SearchResutList />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            maxVisible={4}
            mode='pagination'
          />
        </Box>
      </Stack>
    );
  }

  // PC端渲染
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
          width: { lg: 1060, xl: 1420 },
          ml: { md: '5%', lg: '10%', xl: '12%' },
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
            initialValue={searchKeywords}
          />
          <SearchFilter />
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
            <ResultSort />
            <SearchResutList />
          </Paper>
        </Box>
        <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          maxVisible={4}
          mode='pagination'
        />
      </Box>
    </Box>
  );
};

export default SearchPage;
