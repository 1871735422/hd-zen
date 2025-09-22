'use client';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import ClearIcon from '../icons/ClearIcon';

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBox = ({
  placeholder = '输入您想搜索的文字',
  onSearch,
}: SearchBoxProps) => {
  const [query, setQuery] = useState('');

  const handleClear = () => {
    setQuery('');
  };

  const handleSearch = () => {
    onSearch?.(query);
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
        placeholder={placeholder}
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
      <IconButton sx={{ height: 20 }} aria-label='clear' onClick={handleClear}>
        <ClearIcon />
      </IconButton>
      <Button
        onClick={() => handleSearch()}
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
  );
};
