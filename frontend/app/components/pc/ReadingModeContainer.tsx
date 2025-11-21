'use client';
import {
  MOBILE_READING_THEMES,
  READING_THEMES as PC_READING_THEMES,
  SCROLL_TOP_BG_COLOR,
} from '@/app/constants/colors';
import { useDeviceType } from '@/app/utils/deviceUtils';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/courseUtils';
import { ScrollTop } from '../shared';
import { useReadingMode } from './ReadingModeProvider';
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
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  // Minimal shared values to reduce repetition (keep rest unchanged)
  const READING_THEMES = isMobile ? MOBILE_READING_THEMES : PC_READING_THEMES;

  const theme = isMobile
    ? MOBILE_READING_THEMES[state.backgroundTheme]
    : READING_THEMES[state.backgroundTheme];

  const rowStackSx = {
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontSize: isMobile ? pxToVw(12) : 18,
  };
  const tagBoxSx = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
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

  const PcArticleMeta = () => {
    return (
      <Box>
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
              {tags.slice(0, 5).map((tag, index) => (
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
                    fontSize: isMobile ? pxToVw(12) : 18,
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
                lineHeight: 1.7,
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
      </Box>
    );
  };

  const MobileArticleMeta = () => {
    return (
      <Box>
        {/* 作者和日期 */}
        {(author || date) && (
          <Typography
            sx={{
              color: 'rgba(153, 153, 153, 1)',
              fontSize: pxToVw(12),
              lineHeight: 2.3,
              textAlign: 'center',
            }}
          >
            {author && `作者: ${author}`}
            <span style={{ paddingLeft: '15px' }}>
              {date && formatDate(date)}
            </span>
          </Typography>
        )}

        {/* 概述 */}
        {summary && (
          <Typography
            sx={{
              backgroundColor: theme.tagBg,
              borderRadius: pxToVw(20),
              px: pxToVw(15),
              py: pxToVw(9),
              mt: pxToVw(10),
              color: theme.text,
              lineHeight: 1.42,
              fontSize: pxToVw(14),
            }}
          >
            <strong>概述：</strong>
            {summary}
          </Typography>
        )}
      </Box>
    );
  };

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
        pt: isMobile ? 0 : { lg: 5, xl: 7, xxl: 9 },
        pb: 0,
        transition: 'background-color 0.3s ease',
        overflow: 'auto',
        backgroundColor: theme.background,
      }}
    >
      {/* 文章内容和侧边栏容器 */}
      <Box
        sx={
          isMobile
            ? {
                ':before': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: pxToVw(45),
                  background: theme.tagText,
                },
              }
            : {
                position: 'relative',
                maxWidth: { lg: 900, xl: 1240 },
                margin: '40px auto 0px',
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
              }
        }
      >
        <Paper
          elevation={0}
          sx={
            isMobile
              ? {
                  px: pxToVw(17),
                  py: pxToVw(39),
                  backgroundColor: theme.background,
                }
              : {
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
                      lineHeight: 2.2,
                    },
                  },
                }
          }
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
              mt: isMobile ? 0 : -2,
              mb: isMobile ? pxToVw(34) : { lg: 7, xl: 10, xxl: 12 },
              fontSize: isMobile ? pxToVw(20) : { lg: 26, xl: 36, xxl: 40 },
              lineHeight: 1.45,
            }}
          >
            {title}
          </Typography>

          {isMobile ? <MobileArticleMeta /> : <PcArticleMeta />}
          {/* 文章内容 */}
          <Box
            sx={{
              px: pxToVw(isMobile ? 7 : 0),
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
        bgColor={
          isMobile
            ? SCROLL_TOP_BG_COLOR[state.backgroundTheme]
            : theme.sidebarBackBg
        }
        visible={visible}
      />
    </Box>
  );
}
