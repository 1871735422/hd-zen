import { Stack, Typography } from '@mui/material';
import React from 'react';

interface TitleBannerProps {
  title: string;
  subTitle?: string;
}
function TitleBanner({ title, subTitle }: TitleBannerProps) {
  return (
    <Stack sx={{ pt: 4, mb: 6, flexDirection: 'row', alignItems: 'flex-end' }}>
      <Typography
        variant='h2'
        className='fz-quanfu'
        sx={{
          color: 'rgba(102, 158, 222, 1)',
          textShadow:
            '0 2px 8px rgba(255,255,255,0.92), 0 4px 10px rgba(0,0,0,0.08)',
          display: 'inline-block',
        }}
      >
        {title}
      </Typography>
      {subTitle && (
        <Typography
          variant='h5'
          className='bei-fang'
          lineHeight={2}
          sx={{
            color: 'rgba(255, 106, 114, .9)',
            fontSize: '1.8rem',
            px: 1,
          }}
        >
          {subTitle}
        </Typography>
      )}
    </Stack>
  );
}

export default TitleBanner;
