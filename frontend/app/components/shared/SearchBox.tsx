'use client';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import ClearIcon from '../icons/ClearIcon';

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  initialValue?: string;
}

export const SearchBox = ({
  placeholder = '输入您想搜索的文字',
  onSearch,
  initialValue = '',
}: SearchBoxProps) => {
  const [query, setQuery] = useState(initialValue);

  // 监听 initialValue 变化
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleClear = () => {
    setQuery('');
  };

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '40px',
        display: 'flex',
        alignItems: 'center',
        px: { sm: 0.3, md: 0.4, lg: 0.5, xl: 0.6, xxl: 0.8 },
      }}
    >
      <TextField
        id='search'
        variant='outlined'
        fullWidth
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyUp={handleKeyDown}
        placeholder={placeholder}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: { sm: 40, md: 50, lg: 54, xl: 76, xxl: 84 },
            fontSize: { sm: 12, md: 13, lg: 13, xl: 18, xxl: 20 },
            color: 'rgba(119, 119, 119, 1)',
            borderRadius: '40px',
            pl: { sm: 1, md: 1.5, lg: 2, xl: 2, xxl: 2.5 },
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
          },
        }}
      />
      <Stack direction='row' spacing={1} alignItems='center'>
        {query && (
          <IconButton
            sx={{ fontSize: { sm: 16, md: 18, lg: 19, xl: 27, xxl: 30 } }}
            aria-label='clear'
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        )}
        <Button
          onClick={() => handleSearch()}
          sx={{
            background:
              'linear-gradient(90deg, rgba(70, 134, 207, 1) 0%, rgba(170, 207, 250, 1) 100%)',
            width: { sm: 32, md: 40, lg: 48, xl: 67, xxl: 75 },
            height: { sm: 30, md: 38, lg: 46, xl: 65, xxl: 72 },
            minWidth: 0,
            borderRadius: '100%',
            color: '#fff',
            boxSizing: 'border-box',
            fontSize: { sm: 10, md: 12, lg: 13, xl: 18, xxl: 20 },
          }}
        >
          搜索
        </Button>
      </Stack>
    </Box>
  );
};
