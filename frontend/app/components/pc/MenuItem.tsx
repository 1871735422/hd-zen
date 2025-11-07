'use client';
import { Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const buttonSx = {
    color:
      pathname.split('/')[1] === item.slug ? NAV_COLOR : STANDARD_TEXT_COLOR,
    fontWeight: 500,
    fontSize: { lg: 16, xl: 20, xxl: 22 },
    '&:hover': {
      color: NAV_COLOR,
      backgroundColor: 'transparent',
    },
    px: { lg: 2, xlg: 2.2, xl: 2.5, xxl: 3 },
  };

  if (hasChildren) {
    return (
      <Box
        sx={{
          position: 'relative',
          '& .MuiButtonBase-root': {
            backgroundColor: 'transparent',
          },
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Button sx={buttonSx} endIcon={<DropDownIcon />}>
          <Link href={`/${item.slug}${item?.slug === 'course' ? '' : '/1'}`}>
            {item.name}
          </Link>
        </Button>
        <Stack
          sx={{
            position: 'absolute',
            top: { lg: 54, xl: 69, xxl: 78 },
            left: { lg: -10, xl: -10, xxl: -12 },
            zIndex: 1000,
            opacity: isOpen ? 1 : 0,
            py: { lg: 1, xl: 1.2, xxl: 1.5 },
            px: 2,
            justifyContent: 'center',
            alignItems: 'center',
            visibility: isOpen ? 'visible' : 'hidden',
            transform: 'translateY(-10px)',
            transition: 'all 0.2s ease-in-out',
            background: 'white',
            borderRadius: '0 0 20px 20px',
            // minWidth: { lg: 142, xl: 200, xxl: 220 },
            width: 'min-content',
            // 横线
            borderTop: '2px solid rgba(131, 181, 247, 1)',
            boxShadow: '0px 5px 20px  rgba(131, 181, 247, 0.3)',

            // 竖线
            '&:before': {
              width: 2,
              height: { lg: 18, xl: 24, xxl: 30 },
              content: '""',
              position: 'absolute',
              backgroundColor: 'rgba(130, 178, 232, 1)',
              left: { lg: 38, xl: 53, xxl: 60 },
              top: { lg: -18, xl: -26, xxl: -32 },
            },
          }}
        >
          {item.subMenu &&
            item.subMenu.map((subItem: Menu) => {
              return (
                <Link
                  key={subItem.name}
                  href={`/${item.slug}/${subItem.slug}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    textDecoration: 'none',
                    width: '100%',
                  }}
                >
                  <Button
                    sx={{
                      width: '100%',
                      fontSize: { lg: 14, xl: 16, xxl: 18 },
                      fontWeight: 400,
                      color: STANDARD_TEXT_COLOR,
                      padding: {
                        lg: '6px 12px',
                        xl: '8px 16px',
                        xxl: '10px 20px',
                      },
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
        </Stack>
      </Box>
    );
  }

  return (
    <Button sx={buttonSx}>
      <Link href={`/${item.slug}`}>{item.name}</Link>
    </Button>
  );
};

export default MenuItemComponent;
