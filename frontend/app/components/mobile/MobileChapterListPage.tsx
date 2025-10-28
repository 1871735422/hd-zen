import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';

interface Chapter {
  id: number;
  title: string;
  displayOrder: number;
}

interface MobileChapterListPageProps {
  bookName: string;
  chapters: Chapter[];
  bookOrder: string;
}

const MobileChapterListPage: React.FC<MobileChapterListPageProps> = ({
  bookName,
  chapters,
  bookOrder,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F5F9FC 0%, #FFFFFF 100%)',
        paddingTop: pxToVw(20),
        paddingBottom: pxToVw(40),
        paddingX: pxToVw(20),
      }}
    >
      {/* Breadcrumb */}
      <Box
        sx={{
          marginBottom: pxToVw(32),
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: pxToVw(4),
        }}
      >
        <Link href='/' style={{ textDecoration: 'none' }}>
          <Typography
            sx={{
              fontSize: pxToVw(14),
              color: '#4A6B8A',
              cursor: 'pointer',
              '&:hover': { color: '#2E5A8A' },
            }}
          >
            首页
          </Typography>
        </Link>
        <Typography sx={{ fontSize: pxToVw(14), color: '#4A6B8A' }}>
          {' '}
          /{' '}
        </Typography>
        <Link href='/reference' style={{ textDecoration: 'none' }}>
          <Typography
            sx={{
              fontSize: pxToVw(14),
              color: '#4A6B8A',
              cursor: 'pointer',
              '&:hover': { color: '#2E5A8A' },
            }}
          >
            学修参考资料
          </Typography>
        </Link>
        <Typography sx={{ fontSize: pxToVw(14), color: '#4A6B8A' }}>
          {' '}
          /{' '}
        </Typography>
        <Typography
          sx={{
            fontSize: pxToVw(14),
            color: '#333',
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          《{bookName}》
        </Typography>
      </Box>

      {/* Chapter List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(20) }}>
        {chapters.map((chapter, index) => (
          <Link
            key={`chapter-${chapter.id}-${index}`}
            href={`/reference/${bookOrder}/${chapter.displayOrder}`}
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: pxToVw(20),
                backgroundColor: 'white',
                borderRadius: pxToVw(16),
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {/* Gradient Icon */}
              <Box
                sx={{
                  width: pxToVw(80),
                  height: pxToVw(60),
                  borderRadius: pxToVw(12),
                  background:
                    'linear-gradient(135deg, #E6D4DE 0%, #D4C6E6 50%, #C6D4E6 100%)',
                  marginRight: pxToVw(20),
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  },
                }}
              />

              {/* Chapter Title */}
              <Typography
                sx={{
                  fontSize: pxToVw(16),
                  color: '#333',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {chapter.title}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>

      {/* Empty State */}
      {chapters.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            paddingY: pxToVw(60),
          }}
        >
          <Typography
            sx={{
              fontSize: pxToVw(16),
              color: '#999',
            }}
          >
            暂无章节内容
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MobileChapterListPage;
