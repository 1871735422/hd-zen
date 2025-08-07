import { Box, Typography } from '@mui/material';
import VideoIcon from '../icons/VideoIcon';

interface CornerBadgeProps {
  content?: string | number;
}

export default function CornerBadge({ content }: CornerBadgeProps) {
  const sizeConfig = {
    medium: {
      width: 60,
      height: 36,
    },
    large: {
      width: 80,
      height: 60,
    },
  };

  const config = sizeConfig[content ? 'medium' : 'large'];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: -1,
        right: 0,
        width: config.width,
        height: config.height,
        display: 'flex',
        zIndex: 1,
        background: 'url(/images/course-badge.png) no-repeat center center',
        backgroundSize: content ? 'contain' : '100% 100%',
        backgroundPosition: '0 0',
      }}
    >
      {content ? (
        <Typography
          sx={{
            position: 'absolute',
            top: 6,
            right: '35%',
            fontSize: 14,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {content}
        </Typography>
      ) : (
        <VideoIcon
          sx={{
            position: 'absolute',
            top: '20%',
            right: '25%',
            fontSize: 24,
            color: 'white',
          }}
        />
      )}
    </Box>
  );
}
