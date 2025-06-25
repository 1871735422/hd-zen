'use client';
import ArticleIcon from '@mui/icons-material/Article';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import QuizIcon from '@mui/icons-material/Quiz';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

const items = [
  { key: '', label: '视频', icon: <OndemandVideoIcon /> },
  { key: 'audio', label: '音频', icon: <GraphicEqOutlinedIcon /> },
  { key: 'reading', label: '文字', icon: <ArticleIcon /> },
  { key: 'qa', label: '问答', icon: <QuizIcon /> },
];

export interface LessonSidebarProps {
  selected: string;
  onSelect: (key: string) => void;
}

const activeColor = 'rgba(86, 137, 204, 1)';

export default function LessonSidebar({
  selected,
  onSelect,
}: LessonSidebarProps) {
  const defaultSelected = items.find(item => item.key === selected)
    ? selected
    : '';
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: 80,
        minHeight: 500,
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

      <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 16, mt: 2 }}>
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
                justifyContent: 'flex-start',
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderLeft: isSelected ? '8px solid transparent' : 'none',
                  boxSizing: 'border-box',
                }}
              >
                <ListItemButton
                  onClick={() => onSelect(item.key)}
                  selected={isSelected}
                  sx={{
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    background: isSelected ? 'white !important' : 'transparent',
                    borderRadius: isSelected ? '40px 0 0 40px' : 'none',
                    borderRight: isSelected ? '8px solid #fff' : 'none',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      color: isSelected ? activeColor : '#fff',
                      fontSize: 24,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={isSelected ? 700 : 500}
                        color={isSelected ? activeColor : '#fff'}
                        fontSize={14}
                        textAlign='center'
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
