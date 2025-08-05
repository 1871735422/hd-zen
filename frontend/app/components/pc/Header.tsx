import { TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';
import { NAV_COLOR } from '../../constants';
import { STANDARD_TEXT_COLOR } from '../../constants/colors';
import LogoIcon from '../icons/LogoIcon';
import SearchIcon from '../icons/SearchIcon';
import Navigation from './Navigation';

const Header: React.FC = () => {
  return (
    <AppBar
      position='static'
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        minHeight: { xl: 70 },
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'center',
      }}
      component='header'
    >
      <Toolbar
        sx={{
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: '180px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <LogoIcon />
          <Typography variant='h6' sx={{ color: STANDARD_TEXT_COLOR }}>
            <Link href='/'>慧灯禅修</Link>
          </Typography>
        </Box>

        {/* 菜单 */}
        <Navigation />

        {/* 搜索框 */}
        <Box
          sx={{
            width: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 },
          }}
        >
          <TextField
            variant='outlined'
            size='small'
            placeholder=''
            sx={{
              width: { xs: 120, sm: 150, md: 180 },
              height: { xs: 28, md: 30 },
              '& .MuiOutlinedInput-root': {
                height: { xs: 28, sm: 30, md: 32 },
                fontSize: { xs: 14, sm: 15, md: 16 },
                color: STANDARD_TEXT_COLOR,
                borderRadius: 1,
                px: { xs: 1, sm: 1.5, md: 2 },
                backgroundColor: 'transparent',
                '& fieldset': {
                  borderColor: '#cfd8dc',
                },
                '&:hover fieldset': {
                  borderColor: NAV_COLOR,
                },
                '&.Mui-focused fieldset': {
                  borderColor: NAV_COLOR,
                },
              },
              '& input': {
                p: 0,
                height: '100%',
              },
            }}
          />
          <SearchIcon />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
