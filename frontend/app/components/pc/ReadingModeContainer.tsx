'use client';
import { Box, Paper, Stack, Typography } from '@mui/material';
import {
  getTagBgColor,
  getTagTextColor,
  getTextColor,
} from '../../constants/colors';
import { formatDate } from '../../utils/courseUtils';
import { READING_THEMES, useReadingMode } from './ReadingModeProvider';
import ReadingModeSidebar from './ReadingModeSidebar';

interface ReadingModeContainerProps {
  title: string;
  tags?: string[];
  summary?: string;
  author?: string;
  date?: string;
  content: string;
  onExitReadingMode?: () => void;
}

export default function ReadingModeContainer({
  title,
  tags = [],
  summary,
  author,
  date,
  content,
  onExitReadingMode,
}: ReadingModeContainerProps) {
  const { state } = useReadingMode();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: READING_THEMES[state.backgroundTheme].background,
        padding: '40px 80px 40px 40px', // 右侧留出侧边栏空间
        transition: 'background-color 0.3s ease',
        overflow: 'auto',
      }}
    >
      {/* 文章内容和侧边栏容器 */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
          zIndex: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: READING_THEMES[state.backgroundTheme].main,
            borderRadius: '16px',
            padding: '80px 60px 60px 60px',
            minHeight: 'calc(100vh - 160px)',
          }}
        >
          {/* 标题 */}
          <Typography
            variant='h3'
            component='h1'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: getTextColor(state.backgroundTheme),
              marginBottom: '40px',
              fontSize: '2rem',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {/* 标签 */}
          {tags.length > 0 && (
            <Stack
              sx={{
                marginBottom: 2,
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant='body2'
                component={'span'}
                sx={{
                  color: getTextColor(state.backgroundTheme),
                  fontSize: '14px',
                  fontWeight: '500',
                  minWidth: 40,
                  marginRight: 1.5,
                }}
              >
                标签:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                {tags.map((tag, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: getTagBgColor(state.backgroundTheme),
                      color: getTagTextColor(state.backgroundTheme),
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${getTagTextColor(state.backgroundTheme)}20`,
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            </Stack>
          )}

          {/* 概述 */}
          {summary && (
            <Stack
              sx={{
                marginBottom: 2,
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant='body2'
                component={'span'}
                sx={{
                  color: getTextColor(state.backgroundTheme),
                  fontSize: '14px',
                  fontWeight: '500',
                  minWidth: 40,
                  marginRight: 1.5,
                }}
              >
                概述:
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: getTextColor(state.backgroundTheme),
                  lineHeight: state.lineSpacing,
                  fontSize: `${state.fontSize}px`,
                  opacity: 0.8,
                }}
              >
                {summary}
              </Typography>
            </Stack>
          )}

          {/* 作者和日期 */}
          {(author || date) && (
            <Box sx={{ marginBottom: 1.5 }}>
              <Typography
                variant='body2'
                sx={{
                  color: getTextColor(state.backgroundTheme),
                  fontSize: '14px',
                  opacity: 0.7,
                }}
              >
                {author && `作者: ${author}`}
                <span style={{ paddingLeft: '15px' }}>
                  {date && formatDate(date)}
                </span>
              </Typography>
            </Box>
          )}

          {/* 分隔线 */}
          <Box
            sx={{
              height: '1px',
              backgroundColor: getTextColor(state.backgroundTheme),
              opacity: 0.2,
              marginBottom: '40px',
            }}
          />

          {/* 文章内容 */}
          <Box
            sx={{
              color: getTextColor(state.backgroundTheme),
              fontSize: `${state.fontSize}px`,
              lineHeight: state.lineSpacing,
              fontWeight: state.fontWeight,
              '& p': {
                marginBottom: '24px',
                textAlign: 'justify',
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                marginTop: '32px',
                marginBottom: '16px',
                fontWeight: 'bold',
              },
              '& h1': { fontSize: '1.8em' },
              '& h2': { fontSize: '1.6em' },
              '& h3': { fontSize: '1.4em' },
              '& h4': { fontSize: '1.2em' },
              '& h5': { fontSize: '1.1em' },
              '& h6': { fontSize: '1em' },
              '& blockquote': {
                borderLeft: `4px solid ${getTextColor(state.backgroundTheme)}40`,
                paddingLeft: '20px',
                margin: '20px 0',
                fontStyle: 'italic',
                opacity: 0.8,
              },
              '& ul, & ol': {
                paddingLeft: '24px',
                marginBottom: '20px',
              },
              '& li': {
                marginBottom: '8px',
              },
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Paper>

        {/* 侧边栏 - 吸附在文章内容右侧 */}
        <ReadingModeSidebar onExitReadingMode={onExitReadingMode} />
      </Box>
    </Box>
  );
}
