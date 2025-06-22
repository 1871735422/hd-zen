import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';
import { NAV_COLOR, TEXT_COLOR } from '../../constants';
import Navigation from './Navigation';

const Header: React.FC = () => {
  return (
    <AppBar
      position='static'
      sx={{
        background: '#fff',
        boxShadow: 'none',
        height: 76,
        width: 1920,
        maxWidth: '100%',
        justifyContent: 'center',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 76,
          width: '100%',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 2,
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconButton size='large' edge='start' color='inherit' sx={{ mr: 1 }}>
            <AccountCircle sx={{ fontSize: 40, color: NAV_COLOR }} />
          </IconButton>
          <Typography variant='h6' sx={{ color: TEXT_COLOR, fontWeight: 600 }}>
            <Link href='/'>慧灯禅修</Link>
          </Typography>
        </Box>

        {/* 菜单 */}
        <Navigation />

        {/* 搜索框 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 4,
            justifyContent: 'center',
          }}
        >
          <Box
            component='input'
            type='text'
            placeholder=''
            sx={{
              width: 180,
              height: 32,
              border: '1px solid #cfd8dc',
              borderRadius: 2,
              px: 2,
              fontSize: 16,
              color: TEXT_COLOR,
              outline: 'none',
              '&:focus': {
                borderColor: NAV_COLOR,
              },
            }}
          />
          <SearchIcon sx={{ color: NAV_COLOR, fontSize: 24, ml: 1 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
