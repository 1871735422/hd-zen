'use client';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { NAV_COLOR } from '../../constants';
import { STANDARD_TEXT_COLOR } from '../../constants/colors';

export type Menu = {
  name: string;
  slug: string;
  subMenu: Menu[] | null;
};

interface MenuItemProps {
  item: Menu;
}
const MenuItemComponent: React.FC<MenuItemProps> = ({ item }) => {
  const hasChildren = !!item.subMenu;
  const pathname = usePathname();
  const isSelected = pathname.startsWith(`/${item.slug}`);

  const buttonSx = {
    color: isSelected ? NAV_COLOR : STANDARD_TEXT_COLOR,
    fontWeight: isSelected ? 700 : 500,
    '&:hover': {
      color: NAV_COLOR,
      background: 'rgba(70, 114, 166, 0.08)',
    },
    px: { xs: 0.5, sm: 1, md: 1.5 },
  };

  if (hasChildren) {
    return (
      <Box
        sx={{
          position: 'relative',
          '&:hover .menu-dropdown': {
            opacity: 1,
            visibility: 'visible',
            transform: 'translateY(0)',
          },
        }}
      >
        <Link href={`/${item.slug}/1`} style={{ textDecoration: 'none' }}>
          <Button sx={buttonSx} endIcon={<KeyboardArrowDownIcon />}>
            {item.name}
          </Button>
        </Link>
        <Box
          className='menu-dropdown'
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            opacity: 0,
            visibility: 'hidden',
            transform: 'translateY(-10px)',
            transition: 'all 0.2s ease-in-out',
            background: 'white',
            borderRadius: '0 0 5px 5px',
            border: '1px solid #cfd8dc',
            borderTop: 'none',
            minWidth: 200,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              opacity: 1,
              visibility: 'visible',
              transform: 'translateY(0)',
            },
          }}
        >
          {item.subMenu &&
            item.subMenu.map((subItem: Menu) => {
              const isSubSelected = pathname.startsWith(
                `/${item.slug}/${subItem.slug}`
              );
              return (
                <Link
                  key={subItem.name}
                  href={`/${item.slug}/${subItem.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    sx={{
                      fontSize: 14,
                      color: isSubSelected ? NAV_COLOR : STANDARD_TEXT_COLOR,
                      fontWeight: isSubSelected ? 700 : 500,
                      padding: '8px 16px',
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderRadius: 0,
                      '&:hover': {
                        color: NAV_COLOR,
                        background: 'rgba(70, 114, 166, 0.08)',
                      },
                    }}
                  >
                    {subItem.name}
                  </Button>
                </Link>
              );
            })}
        </Box>
      </Box>
    );
  }

  return (
    <Link href={`/${item.slug}`} style={{ textDecoration: 'none' }}>
      <Button sx={buttonSx}>{item.name}</Button>
    </Link>
  );
};

export default MenuItemComponent;
