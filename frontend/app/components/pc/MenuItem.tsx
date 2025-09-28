'use client';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import React from 'react';
import { NAV_COLOR } from '../../constants';
import { STANDARD_TEXT_COLOR } from '../../constants/colors';
import DropDownIcon from '../icons/DropDownIcon';

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

  const buttonSx = {
    color: STANDARD_TEXT_COLOR,
    fontWeight: 500,
    fontSize: { lg: 18, xl: 20 },
    '&:hover': {
      color: NAV_COLOR,
      background: 'rgba(70, 114, 166, 0.08)',
    },
    px: 1.5,
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
        <Link
          href={`/${item.slug}${item?.slug === 'course' ? '' : '/1'}`}
          style={{ textDecoration: 'none' }}
        >
          <Button sx={buttonSx} endIcon={<DropDownIcon />}>
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
            p: 1,
            visibility: 'hidden',
            transform: 'translateY(-10px)',
            transition: 'all 0.2s ease-in-out',
            background: 'white',
            borderRadius: '0 0 15px 15px',
            minWidth: 150,
            width: 'fit-content',
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
              return (
                <Link
                  key={subItem.name}
                  href={`/${item.slug}/${subItem.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    sx={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: STANDARD_TEXT_COLOR,
                      padding: '8px 16px',
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderRadius: 0,
                      whiteSpace: 'nowrap',
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
