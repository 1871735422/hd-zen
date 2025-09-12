'use client';
import { Box, Paper, Typography } from '@mui/material';
import { BACKGROUND_THEMES, useReadingMode } from './ReadingModeProvider';

interface ReadingModeContainerProps {
  title: string;
  tags?: string[];
  summary?: string;
  author?: string;
  date?: string;
  content: string;
}

export default function ReadingModeContainer({
  title,
  tags = [],
  summary,
  author,
  date,
  content,
}: ReadingModeContainerProps) {
  const { state } = useReadingMode();

  const getTextColor = (theme: string) => {
    switch (theme) {
      case 'dark':
        return 'rgba(255, 255, 255, 0.9)';
      case 'gray':
        return 'rgba(66, 66, 66, 0.9)';
      case 'green':
        return 'rgba(66, 66, 66, 0.9)';
      default:
        return 'rgba(66, 66, 66, 0.9)';
    }
  };

  const getTagBgColor = (theme: string) => {
    switch (theme) {
      case 'dark':
        return 'rgba(255, 255, 255, 0.1)';
      case 'gray':
        return 'rgba(66, 66, 66, 0.1)';
      case 'green':
        return 'rgba(66, 66, 66, 0.1)';
      default:
        return 'rgba(66, 66, 66, 0.1)';
    }
  };

  const getTagTextColor = (theme: string) => {
    switch (theme) {
      case 'dark':
        return 'rgba(255, 255, 255, 0.8)';
      case 'gray':
        return 'rgba(66, 66, 66, 0.8)';
      case 'green':
        return 'rgba(66, 66, 66, 0.8)';
      default:
        return 'rgba(66, 66, 66, 0.8)';
    }
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
        backgroundColor: BACKGROUND_THEMES[state.backgroundTheme],
        padding: '40px 80px 40px 40px', // 右侧留出侧边栏空间
        transition: 'background-color 0.3s ease',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}
    >
      {/* 顶部阴影层 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.08), transparent)`,
          zIndex: 1,
          pointerEvents: 'none',
          borderRadius: '0 0 16px 16px',
        }}
      />

      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '16px',
          padding: '80px 60px 60px 60px',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
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
            fontSize: '2.5rem',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        {/* 标签 */}
        {tags.length > 0 && (
          <Box sx={{ marginBottom: '30px', textAlign: 'center' }}>
            <Typography
              variant='body2'
              sx={{
                color: getTextColor(state.backgroundTheme),
                marginBottom: '16px',
                fontSize: '14px',
                fontWeight: '500',
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
          </Box>
        )}

        {/* 概述 */}
        {summary && (
          <Box sx={{ marginBottom: '30px' }}>
            <Typography
              variant='body2'
              sx={{
                color: getTextColor(state.backgroundTheme),
                marginBottom: '12px',
                fontSize: '14px',
                fontWeight: '500',
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
          </Box>
        )}

        {/* 作者和日期 */}
        {(author || date) && (
          <Box sx={{ marginBottom: '40px', textAlign: 'center' }}>
            <Typography
              variant='body2'
              sx={{
                color: getTextColor(state.backgroundTheme),
                fontSize: '14px',
                opacity: 0.7,
              }}
            >
              {author && `作者: ${author}`}
              {author && date && ' '}
              {date && date}
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
    </Box>
  );
}
