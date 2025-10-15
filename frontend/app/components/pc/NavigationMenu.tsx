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
        pl: {md: 2, lg: 4, xl: 7 },
        gap: 1,
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
