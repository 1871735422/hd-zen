'use client';
import { clearCourseTitle } from '@/app/utils/courseUtils';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { MAIN_BLUE_COLOR, STANDARD_TEXT_COLOR } from '../../constants/colors';

export interface LessonSidebarProps {
  lesson: { label: string; path: string; displayOrder: number }[];
  selectedIdx: number;
  onSelect?: (index: number) => void;
}

export default function QaSidebar({
  lesson,
  selectedIdx,
  onSelect,
}: LessonSidebarProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(175.97deg, rgba(232, 247, 255, 1) 0%, rgba(224, 226, 255, 1) 99.94%)',
        borderRadius: {
          lg: '20px',
          xl: '25px 30px 25px 25px',
          xxl: '30px 35px 30px 30px',
        },
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <List
        sx={{
          width: '100%',
          height: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: { lg: 6, xl: 8.2, xxl: 10 },
        }}
      >
        {lesson.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <ListItem
              key={idx}
              disablePadding
              sx={{
                width: '100%',
                mb: 2.5,
              }}
            >
              <Box
                component={'a'}
                href={item.path}
                width={'100%'}
                sx={{
                  minHeight: 70,
                  marginLeft: { lg: 2, xl: 3, xxl: 4 },
                  boxSizing: 'border-box',
                }}
                onClick={e => {
                  if (onSelect) {
                    e.preventDefault();
                    onSelect(idx);
                  }
                }}
              >
                <ListItemButton
                  selected={isSelected}
                  sx={{
                    minHeight: { lg: 54, xl: 70, xxl: 80 },
                    p: 0,
                    alignItems: 'center',
                    background: isSelected ? 'white !important' : 'transparent',
                    borderRadius: isSelected
                      ? {
                          lg: '40px 0 0 40px',
                          xl: '50px 0px 0px 50px',
                          xxl: '60px 0px 0px 60px',
                        }
                      : 'none',
                    borderRight: isSelected ? `8px solid #fff` : 'none',
                    position: 'relative',
                    '&:before': isSelected
                      ? {
                          position: 'absolute',
                          top: { lg: -25, xl: -30, xxl: -35 },
                          right: -8,
                          content: '""',
                          background: '#fff',
                          height: { lg: 25, xl: 30, xxl: 35 },
                          aspectRatio: 1,
                          WebkitMask:
                            'radial-gradient(100% 100% at 0% 0%, transparent 0 100%, white 100%)', // 正方形角在右下
                          mask: 'radial-gradient(100% 100% at 0% 0%, transparent 0 100%, white 100%)', // 正方形角在右下
                        }
                      : {},
                    '&:after': isSelected
                      ? {
                          position: 'absolute',
                          bottom: { lg: -25, xl: -30, xxl: -35 },
                          right: -8,
                          content: '""',
                          background: '#fff',
                          height: { lg: 25, xl: 30, xxl: 35 },
                          aspectRatio: 1,
                          WebkitMask:
                            'radial-gradient(100% 100% at 0% 100%, transparent 0 100%, white 100%)', // 正方形角在右上
                          mask: 'radial-gradient(100% 100% at 0% 100%, transparent 0 100%, white 100%)', // 正方形角在右上
                        }
                      : {},
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        mx: { lg: 1.5, xl: 2, xxl: 2.5 },
                        color: !isSelected ? MAIN_BLUE_COLOR : '#fff',
                        bgcolor: isSelected ? MAIN_BLUE_COLOR : '#fff',
                        width: 28,
                        height: 28,
                      }}
                    >
                      <Typography
                        fontSize={{ lg: 16, xl: 20, xxl: 22 }}
                        fontWeight={700}
                      >
                        {idx + 1}
                      </Typography>
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          fontWeight={isSelected ? 700 : 'inherit'}
                          fontSize={{ lg: 15, xl: 20, xxl: 22 }}
                          marginRight={{ lg: 1, xl: 2, xxl: 2.5 }}
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '29px',
                            color: isSelected
                              ? 'rgba(86, 137, 204, 1)'
                              : STANDARD_TEXT_COLOR,
                          }}
                        >
                          {clearCourseTitle(item.label)}
                        </Typography>
                      }
                    />
                  </Box>
                </ListItemButton>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
