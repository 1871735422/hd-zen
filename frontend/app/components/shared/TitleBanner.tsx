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
        mx: 1,
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
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextStroke: '0.7px rgba(255, 255, 255, 1)',
          fontSize: '3.4rem',
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
              'linear-gradient(222deg, rgba(255, 168, 184, 1) 0%, rgba(255, 106, 114, 1) 69.37%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '1.7rem',
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
