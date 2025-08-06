'use client';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Menu, MenuItem as MuiMenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import { usePathname, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { NAV_COLOR } from '../../constants';
import { STANDARD_TEXT_COLOR } from '../../constants/colors';

export type Menu = {
  name: string;
  slug: string;
  subMenu: Menu[] | null;
};

interface MenuItemProps {
  item: Menu;
  index: number;
  isSelected: boolean;
  onToggle: (idx: number) => void;
  onClose: () => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  index,
  isSelected,
  onToggle,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = !!item.subMenu;

  const buttonSx = {
    color: isSelected ? NAV_COLOR : STANDARD_TEXT_COLOR,
    fontWeight: isSelected ? 700 : 500,
    background: 'transparent',
    '&:hover': {
      color: NAV_COLOR,
      background: 'rgba(70, 114, 166, 0.08)',
    },
    minWidth: 0,
    px: { xs: 0.5, sm: 1, md: 1.5 },
  };

  const clearMenuTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleButtonMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    clearMenuTimeout();
    if (hasChildren) {
      setAnchorEl(event.currentTarget);
      setIsHovering(true);
      onToggle(index);
    }
  };

  const handleButtonMouseLeave = () => {
    clearMenuTimeout();
    timeoutRef.current = setTimeout(() => {
      if (!isHovering) {
        setAnchorEl(null);
        onClose();
      }
    }, 300);
  };

  const handleMenuMouseEnter = () => {
    clearMenuTimeout();
    setIsHovering(true);
  };

  const handleMenuMouseLeave = () => {
    setIsHovering(false);
    setAnchorEl(null);
    onClose();
  };

  const handleSubMenuClick = (slug: string) => {
    setAnchorEl(null);
    setIsHovering(false);
    onClose();
    router.push(slug);
  };

  const open = Boolean(anchorEl);

  if (hasChildren) {
    return (
      <>
        <Button
          id={`menu-button-${index}`}
          aria-controls={open ? `menu-${index}` : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
          sx={buttonSx}
          endIcon={<KeyboardArrowDownIcon />}
          onClick={() => router.push(item.slug)}
        >
          {item.name}
        </Button>
        <Menu
          id={`menu-${index}`}
          anchorEl={anchorEl}
          open={open}
          onClose={() => {
            setAnchorEl(null);
            setIsHovering(false);
          }}
          slotProps={{
            list: {
              'aria-labelledby': `menu-button-${index}`,
            },
          }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '0 0 5px 5px',
              borderTop: '1px solid #cfd8dc',
              minWidth: 200,
              // CSS动画：淡入淡出效果
              animation: open ? 'fadeIn 0.2s ease-in-out' : 'none',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(-10px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            },
          }}
        >
          {item.subMenu &&
            item.subMenu.map((subItem: Menu) => (
              <MuiMenuItem
                key={subItem.name}
                onClick={() => handleSubMenuClick(subItem.slug)}
                sx={{
                  fontSize: 14,
                  color:
                    subItem.slug === pathname ? NAV_COLOR : STANDARD_TEXT_COLOR,
                  fontWeight: subItem.slug === pathname ? 700 : 500,
                  '&:hover': {
                    color: NAV_COLOR,
                    background: 'rgba(70, 114, 166, 0.08)',
                  },
                  py: 1,
                  px: 2,
                }}
              >
                {subItem.name}
              </MuiMenuItem>
            ))}
        </Menu>
      </>
    );
  }

  return (
    <Button sx={buttonSx} onClick={() => router.push(item.slug)}>
      {item.name}
    </Button>
  );
};

export default MenuItemComponent;
