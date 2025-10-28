'use client';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';

export default function MobileSearchButton() {
  const router = useRouter();

  const handleSearch = () => {
    router.push('/search');
  };

  return (
    <IconButton onClick={handleSearch} sx={{ color: '#333' }} aria-label='搜索'>
      <SearchIcon />
    </IconButton>
  );
}
