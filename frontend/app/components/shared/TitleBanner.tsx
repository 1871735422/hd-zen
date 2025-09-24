import { Stack, Typography } from '@mui/material';

interface TitleBannerProps {
  title: string;
  subTitle?: string;
}
function TitleBanner({ title, subTitle }: TitleBannerProps) {
  return (
    <Stack
      sx={{
        pt: 5.5,
        mx: 3,
        mb: 7,
        flexDirection: 'row',
        alignItems: 'flex-end',
        cursor: 'pointer',
      }}
    >
      <Typography
        variant='h2'
        className='fz-quanfu'
        sx={{
          background:
            'linear-gradient( rgba(34, 96, 168, 1) 0%, rgba(102, 158, 222, 1) 100%)',
          // backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255, 255, 255, 1)',
          textShadow: 'none',
          display: 'inline-block',
          fontSize: '3.2rem',
          fontWeight: 200,
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
            background:
              'linear-gradient(to bottom, rgba(255, 106, 114, 1), rgba(255, 150, 160, 0.7))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
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
