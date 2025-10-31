import { Box, Typography } from '@mui/material';
import VideoIcon from '../icons/VideoIcon';

interface CornerBadgeProps {
  content?: string | number;
}

export default function CornerBadge({ content }: CornerBadgeProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: { lg: -2, xl: -1 },
        right: 0,
        width: {
          lg: content ? 80 : 88,
          xl: content ? 100 : 110,
        },
        height: content ? 60 : { lg: 65, xl: 80 },
        display: 'flex',
        zIndex: 1,
        background: 'url(/images/course-badge.png) no-repeat center center',
        backgroundSize: content ? 'contain' : '70% 70%',
        backgroundPosition: '100% 5%',
        '& svg': {
          position: 'absolute',
          top: '13%',
          right: '18%',
          fontSize: { lg: 20, xl: 24 },
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
