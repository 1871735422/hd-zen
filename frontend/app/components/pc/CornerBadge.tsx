import VideocamIcon from '@mui/icons-material/Videocam';
import { Box, Typography } from '@mui/material';
import BadgeIcon from '../icons/BadgeIcon';

interface CornerBadgeProps {
  content?: string | number;
  size?: 'small' | 'medium' | 'large';
}

export default function CornerBadge({ content, size = 'medium' }: CornerBadgeProps) {
  const sizeConfig = {
    small: {
      width: 32,
      height: 20,
      fontSize: 10,
    },
    medium: {
      width: 40,
      height: 25,
      fontSize: 12,
    },
    large: {
      width: 48,
      height: 30,
      fontSize: 14,
    },
  };

  const config = sizeConfig[size];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: config.width,
        height: config.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      <BadgeIcon size={size} />
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {content ? (
          <Typography
            sx={{
              fontSize: config.fontSize,
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            {content}
          </Typography>
        ) : (
          <VideocamIcon
            sx={{
              fontSize: config.fontSize + 2,
              color: 'white',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
