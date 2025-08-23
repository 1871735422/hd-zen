'use client';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { HELPER_TEXT_COLOR } from '../../constants/colors';
import ClearIcon from '../icons/ClearIcon';
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
  const queryText = searchParams.get('query');
  const model = searchParams.get('model');
  const category = searchParams.get('category');
  const [modelSelected, setModelSelected] = useState(searchModels[1].value);
  const [cate, setCate] = useState(searchCates[0].value);
  const [sort, setSort] = useState(resultSort[0].value);
  const [filter, setFilter] = useState(resultFilter[0].value);
  const [query, setQuery] = useState(queryText);

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

  return (
    <Container
      sx={{
        minHeight: '70vh',
        width: '100%',
        margin: '0 auto',
        py: 5,
      }}
    >
      <Box
        sx={{
          ml: { lg: 5, md: 0 },
          mr: { lg: 25, md: 15, xs: 0 },
        }}
      >
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            px: 0.5,
          }}
        >
          <TextField
            id='search'
            variant='outlined'
            fullWidth
            value={query}
            onChange={e => setQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '40px',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
              },
            }}
          />
          <IconButton children={<ClearIcon />} sx={{ height: 20 }} />
          <Button
            sx={{
              background:
                'linear-gradient(90deg, rgba(70, 134, 207, 1) 0%, rgba(170, 207, 250, 1) 100%)',
              width: 50,
              height: 46,
              minWidth: 0,
              borderRadius: '100%',
              color: '#fff',
              boxSizing: 'border-box',
            }}
          >
            搜索
          </Button>
        </Box>
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
              {searchCates.map((item, idx) => (
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
                &lt; <span style={{ color: 'rgba(237, 93, 74, 1)' }}>1</span>/10
                &gt;
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
    </Container>
  );
};

export default SearchPage;
