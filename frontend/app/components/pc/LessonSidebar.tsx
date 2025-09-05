import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import CharIcon from '../icons/CharIcon';
import QaIcon from '../icons/QaIcon';
import VideoCamIcon from '../icons/VideoCamIcon';
import WaveIcon from '../icons/WaveIcon';

export interface LessonSidebarProps {
  path: string;
  selectedKey: string;
}

export default async function LessonSidebar({
  path,
  selectedKey,
}: LessonSidebarProps) {
  const items = [
    {
      key: '',
      label: '视频',
      icon: <VideoCamIcon />,
      color: '#82B2E8',
    },
    {
      key: 'audio',
      label: '音频',
      icon: <WaveIcon />,
      color: 'rgba(175, 183, 240, 1)',
    },
    {
      key: 'reading',
      label: '文字',
      icon: <CharIcon />,
      color: 'rgba(199, 143, 227, 1)',
    },
    { key: 'qa', label: '问答', icon: <QaIcon /> },
  ];

  const defaultSelected =
    items.find(item => item.key === selectedKey)?.key || '';

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: 80,
        background:
          'linear-gradient(180deg, rgba(157, 208, 250, 1) 0%, rgba(255, 166, 224, 1) 99.96%)',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 顶部相关资料 */}

      <Typography sx={{ color: '#fff', mt: 2, fontSize: 13 }}>
        相关资料
      </Typography>
      <List
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {items.map((item, idx) => {
          const isSelected = defaultSelected === item.key;
          return (
            <ListItem
              key={item.key}
              disablePadding
              sx={{
                mb: idx !== items.length - 1 ? 1 : 0,
                width: '100%',
              }}
            >
              <Box
                component={'a'}
                href={
                  item.key === 'qa'
                    ? path.replace('course', 'qa')
                    : `${path}${item.key ? '?tab=' + item.key : ''}`
                }
                sx={{
                  width: 100,
                  height: 80,
                  borderLeft: isSelected ? '8px solid transparent' : 'none',
                  boxSizing: 'border-box',
                }}
              >
                <ListItemButton
                  selected={isSelected}
                  sx={{
                    height: 46,
                    p: 0,
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
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: isSelected ? item.color : '#fff',
                    }}
                  >
                    {item.icon}
                    <ListItemText
                      sx={{ m: 0 }}
                      primary={
                        <Typography
                          fontWeight={isSelected ? 600 : 'inherit'}
                          textAlign='center'
                          fontSize={12}
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
