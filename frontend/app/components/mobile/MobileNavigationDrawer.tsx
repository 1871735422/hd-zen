'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 280;

export default function MobileNavigationDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { title: '慧灯禅修课', href: '/course' },
    { title: '禅修课问答', href: '/qa' },
    { title: '参考资料', href: '/reference' },
    { title: '搜索', href: '/search' },
    { title: '标签', href: '/tags' },
  ];

  const handleToggle = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        onClick={handleToggle}
        sx={{ color: '#333' }}
        aria-label='open menu'
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor='right'
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Drawer Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant='h6' fontWeight={600}>
              菜单
            </Typography>
            <IconButton onClick={handleClose} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Menu Items */}
          <List>
            {menuItems.map(item => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  href={item.href}
                  selected={pathname.startsWith(item.href)}
                  onClick={handleClose}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.12)',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: pathname.startsWith(item.href) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
