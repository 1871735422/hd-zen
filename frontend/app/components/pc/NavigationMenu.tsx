import Box from '@mui/material/Box';
import React from 'react';
import MenuItemComponent, { Menu } from './MenuItem';

interface NavigationProps {
  menuData: Menu[];
}

const NavigationMenu: React.FC<NavigationProps> = ({ menuData }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 6,
        justifyContent: 'flex-start',
        pl: { sm: 1, md: 2, lg: 4, xl: 7, xxl: 8 },
        gap: { sm: 0.5, md: 0.8, lg: 1, xl: 1.2, xxl: 1.5 },
      }}
    >
      {menuData.map(item => {
        return (
          <Box
            key={item.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& .MuiButton-endIcon': {
                marginLeft: 0,
                transform: 'scaleX(1.2)',
                fontWeight: 100,
              },
            }}
          >
            <MenuItemComponent item={item} />
          </Box>
        );
      })}
    </Box>
  );
};

export default NavigationMenu;
