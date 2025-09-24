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
  lesson: { label: string; path: string }[];
  selectedIdx: number;
}

export default async function QaSidebar({
  lesson,
  selectedIdx,
}: LessonSidebarProps) {
  return (
    <Box
      sx={{
        width: '98%',
        height: '100%',
        background:
          'linear-gradient(175.97deg, rgba(232, 247, 255, 1) 0%, rgba(224, 226, 255, 1) 99.94%)',
        borderRadius: '20px',
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
          pt: 6,
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
              }}
            >
              <Box
                component={'a'}
                href={item.path}
                width={'100%'}
                sx={{
                  minHeight: 70,
                  marginLeft: 2,
                  boxSizing: 'border-box',
                }}
              >
                <ListItemButton
                  selected={isSelected}
                  sx={{
                    minHeight: 54,
                    px: 0,
                    py: 1,
                    alignItems: 'center',
                    background: isSelected ? 'white !important' : 'transparent',
                    borderRadius: isSelected ? '40px 0 0 40px' : 'none',
                    borderRight: isSelected ? '8px solid #fff' : 'none',
                    position: 'relative',
                    '&:before': isSelected
                      ? {
                          position: 'absolute',
                          top: -25,
                          right: -8,
                          content: '""',
                          background: '#fff',
                          height: 25,
                          aspectRatio: 1,
                          WebkitMask:
                            'radial-gradient(100% 100% at 0% 0%, transparent 0 100%, white 100%)', // 正方形角在右下
                          mask: 'radial-gradient(100% 100% at 0% 0%, transparent 0 100%, white 100%)', // 正方形角在右下
                        }
                      : {},
                    '&:after': isSelected
                      ? {
                          position: 'absolute',
                          bottom: -25,
                          right: -8,
                          content: '""',
                          background: '#fff',
                          height: 25,
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
                        mx: 2,
                        color: !isSelected ? MAIN_BLUE_COLOR : '#fff',
                        bgcolor: isSelected ? MAIN_BLUE_COLOR : '#fff',
                        width: 26,
                        height: 26,
                      }}
                    >
                      <Typography
                        variant='body2'
                        fontSize={18}
                        fontWeight={500}
                      >
                        {idx + 1}
                      </Typography>
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          fontWeight={isSelected ? 600 : 'inherit'}
                          fontSize={16}
                          marginRight={2}
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.2,
                            color: isSelected
                              ? 'rgba(86, 137, 204, 1)'
                              : STANDARD_TEXT_COLOR,
                          }}
                        >
                          {item.label}
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
