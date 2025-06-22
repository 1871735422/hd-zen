'use client';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
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
import { menuData, NAV_COLOR, TEXT_COLOR } from '../../constants';

const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLElement | null)[]>([]);

  // 使用 useMemo 来缓存当前选中状态的计算结果
  const currentSelectedIndex = useMemo(() => {
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
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (event: React.MouseEvent<HTMLElement>, idx: number) => {
    if (open && selectedIndex === idx) {
      setOpen(false);
      setSelectedIndex(null);
    } else {
      setOpen(true);
      setSelectedIndex(idx);
    }
  };

  return (
    <Box sx={{ display: 'flex', flex: 6, justifyContent: 'space-between' }}>
      {menuData.map((item, idx) => {
        const hasChildren = !!item.children;
        const isSelected = currentSelectedIndex === idx;
        return (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button
              ref={el => {
                buttonRefs.current[idx] = el;
              }}
              onMouseEnter={e => {
                if (hasChildren) {
                  handleToggle(e, idx);
                }
              }}
              sx={{
                color: isSelected ? NAV_COLOR : TEXT_COLOR,
                fontWeight: isSelected ? 700 : 500,
                fontSize: 18,
                background: 'transparent',
                '&:hover': {
                  color: NAV_COLOR,
                  background: 'rgba(70, 114, 166, 0.08)',
                },
                minWidth: 0,
              }}
              endIcon={hasChildren ? <KeyboardArrowDownIcon /> : null}
              id={`composition-button-${idx}`}
              aria-controls={
                open && selectedIndex === idx ? 'composition-menu' : undefined
              }
              aria-expanded={open && selectedIndex === idx ? 'true' : undefined}
              aria-haspopup='true'
              onClick={() => {
                router.push(item.path);
              }}
            >
              {item.label}
            </Button>
            {hasChildren && (
              <Popper
                open={open && selectedIndex === idx}
                anchorEl={buttonRefs.current[idx]}
                role={undefined}
                placement='bottom-start'
                transition
                style={{ zIndex: 1300, position: 'absolute' }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom-start'
                          ? 'left top'
                          : 'left bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id='composition-menu'
                          aria-labelledby='composition-button'
                          sx={{
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            borderTop: '1px solid #cfd8dc',
                          }}
                          onMouseLeave={e => handleToggle(e, idx)}
                        >
                          {item.children!.map(child => (
                            <MenuItem
                              key={child.label}
                              sx={{
                                color:
                                  child.path === pathname
                                    ? NAV_COLOR
                                    : TEXT_COLOR,
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
