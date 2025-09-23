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
        px: 0.5,
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
            color: 'rgba(119, 119, 119, 1)',
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
      <Stack direction='row' spacing={1} alignItems='center'>
        {query && (
          <IconButton
            sx={{ height: 20, p: 0 }}
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
            width: 48,
            height: 46,
            minWidth: 0,
            borderRadius: '100%',
            color: '#fff',
            boxSizing: 'border-box',
          }}
        >
          搜索
        </Button>
      </Stack>
    </Box>
  );
};
