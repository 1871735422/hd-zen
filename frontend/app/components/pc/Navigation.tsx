'use client';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  CircularProgress,
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';
import { NAV_COLOR } from '../../constants';
import { STANDARD_TEXT_COLOR } from '../../constants/colors';
import { useDynamicMenu } from '../../hooks/useDynamicMenu';

const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLElement | null)[]>([]);

  const { menuData, loading } = useDynamicMenu();

  // 简化选中状态计算，确保首页默认选中
  const currentSelectedIndex = useMemo(() => {
    // 如果是首页路径，直接返回0（首页索引）
    if (pathname === '/') {
      return 0;
    }

    // 查找匹配的菜单项
    for (let i = 0; i < menuData.length; i++) {
      const item = menuData[i];
      if (item.path === pathname) {
        return i;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === pathname) {
            return i;
          }
        }
      }
    }
    return null;
  }, [pathname, menuData]);

  const handleClose = () => {
    setOpen(false);
    setSelectedIndex(null);
  };

  const handleToggle = (event: React.MouseEvent<HTMLElement>, idx: number) => {
    if (open && selectedIndex === idx) {
      handleClose();
    } else {
      setOpen(true);
      setSelectedIndex(idx);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flex: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={20} sx={{ color: NAV_COLOR }} />
      </Box>
    );
  }

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
      {menuData.map((item, idx) => {
        const hasChildren = !!item.children;
        const isSelected = currentSelectedIndex === idx;

        return (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              ref={el => {
                buttonRefs.current[idx] = el;
              }}
              onMouseEnter={e => hasChildren && handleToggle(e, idx)}
              sx={{
                color: isSelected ? NAV_COLOR : STANDARD_TEXT_COLOR,
                fontWeight: isSelected ? 700 : 500,
                background: 'transparent',
                '&:hover': {
                  color: NAV_COLOR,
                  background: 'rgba(70, 114, 166, 0.08)',
                },
                minWidth: 0,
                px: { xs: 0.5, sm: 1, md: 1.5 },
              }}
              endIcon={hasChildren ? <KeyboardArrowDownIcon /> : null}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </Button>

            {hasChildren && (
              <Popper
                open={open && selectedIndex === idx}
                anchorEl={buttonRefs.current[idx]}
                placement='bottom-start'
                transition
                style={{ zIndex: 1300 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          sx={{
                            borderRadius: '0 0 5px 5px',
                            borderTop: '1px solid #cfd8dc',
                          }}
                          onMouseLeave={() => handleClose()}
                        >
                          {item.children!.map(child => (
                            <MenuItem
                              key={child.label}
                              sx={{
                                fontSize: 14,
                                color:
                                  child.path === pathname
                                    ? NAV_COLOR
                                    : STANDARD_TEXT_COLOR,
                                fontWeight: child.path === pathname ? 700 : 500,
                                '&:hover': {
                                  color: NAV_COLOR,
                                  background: 'rgba(70, 114, 166, 0.08)',
                                },
                              }}
                              onClick={() => {
                                handleClose();
                                router.push(child.path);
                              }}
                            >
                              {child.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Navigation;
