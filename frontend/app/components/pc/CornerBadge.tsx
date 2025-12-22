import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, Typography } from '@mui/material';
import VideoIcon from '../icons/VideoIcon';

interface CornerBadgeProps {
  content?: string | number;
  isMobile?: boolean;
}

export default function CornerBadge({ content, isMobile }: CornerBadgeProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: isMobile ? pxToVw(-1) : { lg: -2, xl: -1 },
        right: 0,
        width: isMobile
          ? pxToVw(48)
          : {
              lg: content ? 80 : 88,
              xl: content ? 100 : 110,
            },
        height: isMobile
          ? pxToVw(36)
          : content
            ? pxToVw(60)
            : { lg: pxToVw(65), xl: pxToVw(80) },
        display: 'flex',
        zIndex: 1,
        background: `url(/images/${
          isMobile ? 'mobile/course-badge' : 'course-badge'
        }.png) no-repeat center center`,
        backgroundSize: content ? 'contain' : '70% 70%',
        backgroundPosition: '100% 5%',
        '& svg': {
          position: 'absolute',
          top: isMobile ? pxToVw(1) : '13%',
          right: isMobile ? pxToVw(5) : '18%',
          fontSize: isMobile ? pxToVw(16) : { lg: pxToVw(20), xl: pxToVw(24) },
          color: 'white',
        },
      }}
    >
      {content ? (
        <Typography
          sx={{
            position: 'absolute',
            top: 3,
            right: '33%',
            fontSize: { lg: 20, xl: 24 },
            color: 'white',
          }}
        >
          {content}
        </Typography>
      ) : (
        <VideoIcon />
      )}
    </Box>
  );
}
