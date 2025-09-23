import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';
import { getCategories } from '../../api';
import LogoIcon from '../icons/LogoIcon';
import NavigationMenu from './NavigationMenu';
import SearchForm from './SearchForm';

const Header: React.FC = async () => {
  const menuData = await getCategories();

  return (
    <AppBar
      id='back-to-top-anchor'
      position='static'
      sx={{
        background: 'transparent',
        boxShadow: 'none',
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
        <NavigationMenu menuData={menuData} />

        {/* 搜索框 */}
        <SearchForm />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
