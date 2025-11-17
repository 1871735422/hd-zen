'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { pxToVw } from '../../utils/mobileUtils';
import BackIcon from '../icons/BackIcon';
import LogoIcon from '../icons/LogoIcon';
import SearchIcon from '../icons/SearchIcon';
import { useSearchFocus } from './SearchFocusContext';
import TabNavigation from './TabNavigation';

/**
 * 移动端 Header
 * 根据设计稿实现：
 * - 首页（/）：Logo + 网站名称 + 搜索图标
 * - 其他页面：返回箭头 + 搜索框（可选）+ 搜索图标
 */
const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const searchParams = useSearchParams();
  const urlKeywords = searchParams.get('keywords');

  const [searchValue, setSearchValue] = useState(urlKeywords ?? '三殊胜');
  // console.log({ urlKeywords, searchValue });
  const { setIsSearchFocused } = useSearchFocus();
  const { addToHistory } = useSearchHistory();

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      addToHistory(searchValue);
      router.push(`/search?keywords=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <AppBar
      position='sticky'
      sx={{
        top: 0,
        background: '#fff',
        boxShadow: 'none',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: `${pxToVw(56)} !important`,
          height: pxToVw(56),
          px: '0',
          mr: pxToVw(18),
        }}
      >
        {isHomePage ? (
          // 首页布局：Logo + 网站名称 + 搜索图标
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Stack fontSize={pxToVw(33)} mx={pxToVw(17)}>
                <LogoIcon />
              </Stack>
              <Typography
                sx={{
                  color: STANDARD_TEXT_COLOR,
                  fontSize: pxToVw(21),
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                慧灯禅修
              </Typography>
            </Box>

            <IconButton
              onClick={() => router.push('/search')}
              sx={{
                color: 'rgba(86, 137, 204, 1)',
                p: 0,
              }}
              aria-label='搜索'
            >
              <SearchIcon />
            </IconButton>
          </>
        ) : (
          // 其他页面布局：返回箭头 + 搜索框 + 搜索图标
          <>
            <IconButton
              onClick={handleBack}
              sx={{
                ml: pxToVw(4),
                mr: pxToVw(16),
              }}
              aria-label='返回'
            >
              <BackIcon />
            </IconButton>

            <Box
              sx={{
                maxWidth: 243,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(242, 247, 255, 1)',
                borderRadius: pxToVw(20),
                pl: pxToVw(16),
                pr: pxToVw(11),
                height: pxToVw(40),
              }}
            >
              <TextField
                fullWidth
                variant='standard'
                placeholder={searchValue}
                autoFocus
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyUp={e => {
                  if (e.key === 'Enter') handleSearch();
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsSearchFocused(false);
                  }, 100);
                }}
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'rgba(192, 197, 207, 1)',
                    fontWeight: 500,
                  },
                }}
              />
              <IconButton
                onClick={handleSearch}
                sx={{
                  color: 'rgba(86, 137, 204, 1)',
                  fontSize: pxToVw(19),
                  p: 0,
                }}
                aria-label='搜索'
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Toolbar>
      <TabNavigation />
    </AppBar>
  );
};

export default Header;
