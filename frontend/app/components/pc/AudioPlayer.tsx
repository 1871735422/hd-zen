import { Box, Typography } from '@mui/material';

export interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        flex: 1,
      }}
    >
      <audio controls style={{ width: '100%' }} preload='metadata'>
        <source src={src} type='audio/mpeg' />
        <track kind='captions' srcLang='zh' label='captions' default />
        <Typography color='error'>您的浏览器不支持音频播放。</Typography>
      </audio>
    </Box>
  );
}
