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
        top: { lg: -2, xl: -1 },
        right: 0,
        width: isMobile
          ? 46
          : {
              lg: content ? 80 : 88,
              xl: content ? 100 : 110,
            },
        height: isMobile ? 36 : content ? 60 : { lg: 65, xl: 80 },
        display: 'flex',
        zIndex: 1,
        background: `url(/images/${
          isMobile ? 'course-badge' : 'course-badge'
        }.png) no-repeat center center`,
        backgroundSize: content ? 'contain' : '70% 70%',
        backgroundPosition: '100% 5%',
        '& svg': {
          position: 'absolute',
          top: isMobile ? pxToVw(3) : '13%',
          right: isMobile ? pxToVw(6) : '18%',
          fontSize: isMobile ? 16 : { lg: 20, xl: 24 },
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
