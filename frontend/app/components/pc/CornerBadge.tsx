import { Box, Typography } from '@mui/material';
import VideoIcon from '../icons/VideoIcon';

interface CornerBadgeProps {
  content?: string | number;
}

export default function CornerBadge({ content }: CornerBadgeProps) {
  const sizeConfig = {
    medium: {
      width: 80,
      height: 46,
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
        backgroundSize: content ? 'contain' : '70% 70%',
        backgroundPosition: '100% 5%',
      }}
    >
      {content ? (
        <Typography
          sx={{
            position: 'absolute',
            top: 6,
            right: '35%',
            fontSize: 18,
            color: 'white',
          }}
        >
          {content}
        </Typography>
      ) : (
        <VideoIcon
          sx={{
            position: 'absolute',
            top: '13%',
            right: '18%',
            fontSize: 14,
            color: 'white',
          }}
        />
      )}
    </Box>
  );
}
