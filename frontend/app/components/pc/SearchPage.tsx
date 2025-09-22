'use client';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { HELPER_TEXT_COLOR } from '../../constants/colors';
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
  { name: '内容从新到旧', value: 'newToOld' },
  { name: '内容从旧到新', value: 'oldToNew' },
  { name: '热门内容', value: 'hot' },
];

const resultFilter = [
  { name: '全部', value: 'all' },
  { name: '文章', value: 'artile' },
  { name: '音视频', value: 'av' },
];

const SearchPage = () => {
  const searchParams = useSearchParams();
  const _model = searchParams.get('model');
  const _category = searchParams.get('category');
  const [modelSelected, setModelSelected] = useState(searchModels[1].value);
  const [cate, setCate] = useState(searchCates[0].value);
  const [sort, setSort] = useState(resultSort[0].value);
  const [filter, setFilter] = useState(resultFilter[0].value);

  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModelSelected((event.target as HTMLInputElement).value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCate((event.target as HTMLSelectElement).value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleSearch = (searchQuery: string) => {
    // TODO: 实现搜索逻辑
    console.log('搜索:', {
      query: searchQuery,
      modelSelected,
      cate,
      sort,
      filter,
    });
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
          maxWidth: 1200,
          mx: 'auto',
          px: 2,
        }}
      >
        <Box>
          <SearchBox onSearch={handleSearch} placeholder='请输入搜索内容' />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              my: 3,
              fontSize: 14,
            }}
          >
            <RadioGroup
              aria-labelledby='model-radio-buttons-group'
              name='model-radio-buttons-group'
              value={modelSelected}
              onChange={handleModelChange}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-evenly',
              }}
            >
              {searchModels.map(item => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={item.name}
                  sx={{
                    fontSize: 14,
                  }}
                />
              ))}
            </RadioGroup>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
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
                  border: 'none',
                  fontSize: '13px',
                  paddingLeft: 4,
                  paddingRight: 20,
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
          {/* 搜索过滤结束 */}
          {/* 搜索内容展示 开始 */}
          <Paper
            sx={{
              py: 2,
              px: 6,
              mb: 5,
              borderRadius: 5,
            }}
          >
            <Box
              sx={{
                width: 300,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  color: HELPER_TEXT_COLOR,
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
                borderRadius: 1,
                fontSize: 13,
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
                {resultFilter.map(item => (
                  <Button
                    key={item.value}
                    size='small'
                    variant={filter === item.value ? 'contained' : 'text'}
                    onClick={() => handleFilterChange(item.value)}
                    sx={{
                      borderRadius: 3,
                      bgcolor:
                        filter === item.value
                          ? 'rgba(245, 147, 135, 1)'
                          : 'transparent',
                      color: filter === item.value ? '#fff' : HELPER_TEXT_COLOR,
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
                  color: HELPER_TEXT_COLOR,
                  fontSize: 12,
                }}
              >
                <Typography fontSize={'inherit'}>
                  共找到{' '}
                  <span style={{ color: 'rgba(237, 93, 74, 1)' }}>112</span> 条
                </Typography>
                <Typography fontSize={'inherit'}>
                  &lt; <span style={{ color: 'rgba(237, 93, 74, 1)' }}>1</span>
                  /10 &gt;
                </Typography>
              </Box>
            </Box>
            <Stack spacing={2}>
              <SearchInfoCard
                index={1}
                title='三个差别'
                content='以前没有修五加行的时候，总是以自利为主，自从修了五加行，利他之心开始增上，那就可以说有了收获。...'
                from='纸质图书 / 慧灯之光 第一册'
                type='文章'
                url='https://example.com/source'
                keywords={['五加行', '收获']}
              />
              <Divider />
              <SearchInfoCard
                index={2}
                title='三殊胜'
                content='以前没有修五加行的时候，总是以自利为主，自从修了五加行，利他之心开始增上，那就可以说有了收获。...'
                from='纸质图书 / 慧灯之光 第一册'
                type='文章'
                url='https://example.com/source'
                keywords={['五加行', '收获']}
              />
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;
