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
    fontSize: { sm: 14, md: 16, lg: 18, xl: 20, xxl: 22 },
    '&:hover': {
      color: NAV_COLOR,
      backgroundColor: 'transparent',
    },
    px: { sm: 0.5, md: 0.8, lg: 1, xl: 2.5, xxl: 3 },
  };

  if (hasChildren) {
    return (
      <Box
        sx={{
          position: 'relative',
          '&:hover > div': {
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
          sx={{
            position: 'absolute',
            top: { sm: 48, md: 56, lg: 68, xl: 76, xxl: 84 },
            left: { sm: -5, md: -8, lg: -10, xl: -10, xxl: -12 },
            zIndex: 1000,
            opacity: 0,
            p: { sm: 0.5, md: 0.8, lg: 1, xl: 1.2, xxl: 1.5 },
            visibility: 'hidden',
            transform: 'translateY(-10px)',
            transition: 'all 0.2s ease-in-out',
            background: 'white',
            borderRadius: '0 0 20px 20px',
            minWidth: { sm: 120, md: 150, lg: 180, xl: 200, xxl: 220 },
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
              left: { sm: 35, md: 44, lg: 53, xl: 53, xxl: 60 },
              top: { sm: -18, md: -22, lg: -26, xl: -26, xxl: -30 },
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
                    fontSize: { sm: 12, md: 14, lg: 16, xl: 16, xxl: 18 },
                    fontWeight: 400,
                    color: STANDARD_TEXT_COLOR,
                    padding: {
                      sm: '4px 8px',
                      md: '6px 12px',
                      lg: '8px 16px',
                      xl: '8px 16px',
                      xxl: '10px 20px',
                    },
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
