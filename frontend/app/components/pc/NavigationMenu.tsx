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
        px: 4,
        gap: { xs: 0.5, sm: 1, md: 2 },
      }}
    >
      {menuData.map(item => {
        return (
          <Box key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuItemComponent item={item} />
          </Box>
        );
      })}
    </Box>
  );
};

export default NavigationMenu;
