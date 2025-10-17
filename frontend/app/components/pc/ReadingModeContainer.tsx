'use client';
import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
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

  // Minimal shared values to reduce repetition (keep rest unchanged)
  const theme = READING_THEMES[state.backgroundTheme];
  const rowStackSx = {
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  };
  const tagBoxSx = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    '& a:hover': { opacity: 0.7 },
  };

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
        backgroundColor: theme.background,
        py: 7,
        transition: 'background-color 0.3s ease',
        overflow: 'auto',
      }}
    >
      {/* 文章内容和侧边栏容器 */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: { lg: 900, xl: 1240 },
          margin: '40px auto 60px',
          zIndex: 2,
          ':before': {
            content: '""',
            position: 'absolute',
            top: { lg: -28, xl: -36 },
            left: '2.2%',
            width: '95.6%',
            height: 50,
            borderRadius: { lg: '20px 20px 0 0', xl: '30px 30px 0 0' },
            backgroundColor: theme.main?.replace('1)', '0.3)'),
          },
          ':after': {
            content: '""',
            position: 'absolute',
            top: { lg: -40, xl: -52 },
            left: '3.6%',
            width: '92.8%',
            height: 60,
            borderRadius: { lg: '20px 20px 0 0', xl: '30px 30px 0 0' },
            backgroundColor: theme.main?.replace('1)', '0.15)'),
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: theme.main,
            borderRadius: {
              lg: '20px 20px 0 0',
              xl: '30px 30px 0 0',
              xxl: '35px 35px 0 0',
            },
            p: { lg: 12, xl: 18, xxl: 22 },
            minHeight: 'calc(100vh - 160px)',
            ':before': {
              content: '""',
              position: 'absolute',
              top: { lg: -14, xl: -18, xxl: -22 },
              left: '1%',
              width: '98%',
              height: 32,
              borderRadius: {
                lg: '20px 20px 0 0',
                xl: '30px 30px 0 0',
                xxl: '35px 35px 0 0',
              },
              backgroundColor: theme.main?.replace('1)', '0.5)'),
              '& .MuiTypography-root': {
                fontSize: state.fontSize,
                lineHeight: '40px',
              },
            },
          }}
        >
          {/* 标题 */}
          <Typography
            className='back-to-top-anchor'
            variant='h1'
            component='h1'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.text,
              mt: -2,
              mb: { lg: 7, xl: 10, xxl: 12 },
              fontSize: { lg: 26, xl: 36, xxl: 40 },
              lineHeight: { lg: '37px', xl: '52px', xxl: '58px' },
            }}
          >
            {title}
          </Typography>

          {/* 标签 */}
          {tags.length > 0 && (
            <Stack sx={rowStackSx}>
              <Typography
                component={'span'}
                sx={{
                  color: theme.text,
                  fontWeight: '500',
                  minWidth: 40,
                  mx: { lg: 1.5, xl: 3 },
                }}
              >
                标签:
              </Typography>
              <Box sx={tagBoxSx}>
                {tags.map((tag, index) => (
                  <Chip
                    component={'a'}
                    href={`/tags?tag=${tag}`}
                    target='_blank'
                    key={index}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: { lg: '20px', xl: '30px' },
                      backgroundColor: theme.tagBg,
                      color: `${theme.tagText} !important`,
                      fontSize: 18,
                    }}
                    label={tag}
                  />
                ))}
              </Box>
            </Stack>
          )}

          {/* 概述 */}
          {summary && (
            <Stack sx={{ ...rowStackSx, mb: 3 }}>
              <Typography
                component={'span'}
                sx={{
                  color: theme.text,
                  fontWeight: '500',
                  minWidth: 40,
                  mx: { lg: 1.5, xl: 3 },
                }}
              >
                概述:
              </Typography>
              <Typography
                sx={{
                  color: theme.text,
                  lineHeight: state.lineSpacing,
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
                sx={{
                  color: theme.text,
                  fontSize: state.fontSize - 2,
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
          <Divider sx={{ backgroundColor: theme.divider }} />

          {/* 文章内容 */}
          <Box
            sx={{
              color: theme.text,
              fontSize: `${state.fontSize}px`,
              lineHeight: state.lineSpacing,
              fontWeight: state.fontWeight,
              '& p': { marginBottom: '24px', textAlign: 'justify' },
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
                borderLeft: `4px solid ${theme.text}`,
                paddingLeft: '20px',
                margin: '20px 0',
                fontStyle: 'italic',
                opacity: 0.8,
              },
              '& ul, & ol': { paddingLeft: '24px', marginBottom: '20px' },
              '& li': { marginBottom: '8px' },
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
