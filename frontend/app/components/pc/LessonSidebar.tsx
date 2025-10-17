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

const labelItemList = [
  {
    key: '',
    label: '视频',
    icon: <VideoCamIcon />,
    color: 'rgba(86, 137, 204, 1)',
  },
  {
    key: 'audio',
    label: '音频',
    icon: <WaveIcon />,
    color: 'rgba(175, 183, 240, 1)',
  },
  {
    key: 'article',
    label: '文字',
    icon: <CharIcon />,
    color: 'rgba(199, 143, 227, 1)',
  },
  { key: 'qa', label: '问答', icon: <QaIcon /> },
];
export interface LessonSidebarProps {
  path: string;
  selectedKey?: string;
  excludeLabels: (typeof labelItemList)[number]['label'][];
}

export default async function LessonSidebar({
  path,
  selectedKey,
  excludeLabels,
}: LessonSidebarProps) {
  const labelItems = labelItemList.filter(
    item => !excludeLabels.includes(item.label)
  );

  const defaultSelected = (
    labelItems.find(item => item.key === selectedKey) || labelItems[0]
  )?.key;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: { lg: 68, xl: 96, xxl: 110 },
        background:
          'linear-gradient(180deg, rgba(157, 208, 250, 1) 0%, rgba(255, 166, 224, 1) 99.96%)',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        px: 0,
        py: { xl: 0.5, xxl: 0.8 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& svg': {
          width: { lg: 17, xl: 24, xxl: 28 },
          height: { lg: 17, xl: 24, xxl: 28 },
        },
      }}
    >
      {/* 顶部相关资料 */}

      <Typography
        sx={{
          color: '#fff',
          mt: 1,
          mb: 0.5,
          fontSize: { lg: 11, xl: 16, xxl: 18 },
          fontWeight: 700,
        }}
      >
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
          '& .MuiTypography-root': {
            fontSize: { lg: 11, xl: 16, xxl: 18 },
          },
        }}
      >
        {labelItems.map((item, idx) => {
          const isSelected = defaultSelected === item.key;

          return (
            <ListItem
              key={item.key}
              disablePadding
              sx={{
                mb: idx !== labelItems.length - 1 ? 1 : 0,
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
                  height: { lg: 80, xl: 94, xxl: 108 },
                  borderLeft: isSelected ? '8px solid transparent' : 'none',
                  boxSizing: 'border-box',
                }}
              >
                <ListItemButton
                  selected={isSelected}
                  sx={{
                    height: { lg: 46, xl: 56, xxl: 64 },
                    p: 0,
                    alignItems: 'center',
                    background: isSelected ? 'white !important' : 'transparent',
                    borderRadius: isSelected ? '40px 0 0 40px' : 'none',
                    borderRight: isSelected ? '8px solid #fff' : 'none',
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
                        <Typography fontWeight={700} textAlign='center'>
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
