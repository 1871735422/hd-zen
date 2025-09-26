'use client';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/courseUtils';
import { ScrollTop } from '../shared';
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.querySelector('.back-to-top-anchor');

    if (!anchor) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0.01 }
    );

    io.observe(anchor);
    return () => io.disconnect();
  }, []);

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
          margin: '40px auto 60px',
          zIndex: 2,
          ':before': {
            content: '""',
            position: 'absolute',
            top: -28,
            left: '2%',
            width: '96%',
            height: 32,
            borderRadius: '20px 20px 0 0',
            backgroundColor: READING_THEMES[
              state.backgroundTheme
            ].main?.replace('1)', '0.3)'),
          },
          ':after': {
            content: '""',
            position: 'absolute',
            top: -40,
            left: '3%',
            width: '94%',
            height: 36,
            borderRadius: '20px 20px 0 0',
            backgroundColor: READING_THEMES[
              state.backgroundTheme
            ].main?.replace('1)', '0.15)'),
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: READING_THEMES[state.backgroundTheme].main,
            borderRadius: '20px',
            padding: '80px 60px 60px 60px',
            minHeight: 'calc(100vh - 160px)',
            ':before': {
              content: '""',
              position: 'absolute',
              top: -14,
              left: '1%',
              width: '98%',
              height: 22,
              borderRadius: '20px 20px 0 0',
              backgroundColor: READING_THEMES[
                state.backgroundTheme
              ].main?.replace('1)', '0.5)'),
            },
          }}
        >
          {/* 标题 */}
          <Typography
            className='back-to-top-anchor'
            variant='h3'
            component='h1'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: READING_THEMES[state.backgroundTheme].text,
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
                  color: READING_THEMES[state.backgroundTheme].text,
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
                  '& a:hover': {
                    opacity: 0.7,
                  },
                }}
              >
                {tags.map((tag, index) => (
                  <Box
                    component={'a'}
                    href={`/tags?tag=${tag}`}
                    target='_blank'
                    key={index}
                    sx={{
                      backgroundColor:
                        READING_THEMES[state.backgroundTheme].tagBg,
                      color: READING_THEMES[state.backgroundTheme].tagText,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: 14,
                      cursor: 'pointer',
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
                  color: READING_THEMES[state.backgroundTheme].text,
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
                  color: READING_THEMES[state.backgroundTheme].text,
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
                  color: READING_THEMES[state.backgroundTheme].text,
                  fontSize: 13,
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
          <Divider
            sx={{
              backgroundColor: READING_THEMES[state.backgroundTheme].divider,
            }}
          />

          {/* 文章内容 */}
          <Box
            sx={{
              color: READING_THEMES[state.backgroundTheme].text,
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
                borderLeft: `4px solid ${READING_THEMES[state.backgroundTheme].text}`,
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

      <ScrollTop
        bgColor={READING_THEMES[state.backgroundTheme].sidebarBackBg}
        visible={visible}
      />
    </Box>
  );
}
