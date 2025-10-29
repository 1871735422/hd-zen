'use client';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import LogoIcon from '../icons/LogoIcon';
import { pxToVw } from '../../utils/mobileUtils';

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
  const [searchValue, setSearchValue] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
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
          px: pxToVw(20),
        }}
      >
        {isHomePage ? (
          // 首页布局：Logo + 网站名称 + 搜索图标
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: pxToVw(8),
                flex: 1,
              }}
            >
              <LogoIcon />
              <Typography
                sx={{
                  color: '#333',
                  fontSize: pxToVw(16),
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
                color: '#666',
                padding: pxToVw(8),
              }}
              aria-label='搜索'
            >
              <SearchIcon sx={{ fontSize: pxToVw(20) }} />
            </IconButton>
          </>
        ) : (
          // 其他页面布局：返回箭头 + 搜索框 + 搜索图标
          <>
            <IconButton
              onClick={handleBack}
              sx={{
                color: '#666',
                padding: pxToVw(8),
                marginRight: pxToVw(12),
              }}
              aria-label='返回'
            >
              <ArrowBackIosNewIcon sx={{ fontSize: pxToVw(16) }} />
            </IconButton>

            <Box
              component='form'
              onSubmit={e => {
                e.preventDefault();
                handleSearch();
              }}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F5F5F5',
                borderRadius: pxToVw(20),
                paddingX: pxToVw(16),
                height: pxToVw(40),
                mr: pxToVw(8),
              }}
            >
              <TextField
                fullWidth
                variant='standard'
                placeholder='三殊胜'
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: pxToVw(14),
                  },
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: pxToVw(14),
                    color: '#333',
                  },
                }}
              />
            </Box>

            <IconButton
              onClick={handleSearch}
              sx={{
                color: '#666',
                padding: pxToVw(8),
              }}
              aria-label='搜索'
            >
              <SearchIcon sx={{ fontSize: pxToVw(20) }} />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
