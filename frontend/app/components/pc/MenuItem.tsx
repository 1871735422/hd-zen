'use client';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();

  const buttonSx = {
    color:
      pathname.split('/')[1] === item.slug ? NAV_COLOR : STANDARD_TEXT_COLOR,
    fontWeight: 500,
    fontSize: { lg: 18, xl: 20 },
    '&:hover': {
      color: NAV_COLOR,
      backgroundColor: 'transparent',
    },
    px: {lg: 1, xl: 2.5 },
  };

  if (hasChildren) {
    return (
      <Box
        sx={{
          position: 'relative',
          '&:hover .menu-dropdown': {
            opacity: 1,
            visibility: 'visible',
          },
          '& .MuiButtonBase-root': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Button
          sx={buttonSx}
          endIcon={<DropDownIcon />}
          onClick={() =>
            router.push(`/${item.slug}${item?.slug === 'course' ? '' : '/1'}`)
          }
        >
          {item.name}
        </Button>
        <Box
          className='menu-dropdown'
          sx={{
            position: 'absolute',
            top: 68,
            left: -10,
            zIndex: 1000,
            opacity: 0,
            p: 1,
            visibility: 'hidden',
            transform: 'translateY(-10px)',
            transition: 'all 0.2s ease-in-out',
            background: 'white',
            borderRadius: '0 0 20px 20px',
            minWidth: 180,
            width: 'fit-content',
            borderTop: '2px solid rgba(131, 181, 247, 1)',
            boxShadow: '0px 5px 20px  rgba(131, 181, 247, 0.3)',
            '&:hover': {
              opacity: 1,
              visibility: 'visible',
            },
            '&:before': {
              width: 2,
              height: 24,
              content: '""',
              position: 'absolute',
              backgroundColor: 'rgba(130, 178, 232, 1)',
              left: 53,
              top: -26,
            },
          }}
        >
          {item.subMenu &&
            item.subMenu.map((subItem: Menu) => {
              return (
                <Button
                  key={subItem.name}
                  onClick={() => router.push(`/${item.slug}/${subItem.slug}`)}
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
              );
            })}
        </Box>
      </Box>
    );
  }

  return (
    <Button onClick={() => router.push(`/${item.slug}`)} sx={buttonSx}>
      {item.name}
    </Button>
  );
};

export default MenuItemComponent;
