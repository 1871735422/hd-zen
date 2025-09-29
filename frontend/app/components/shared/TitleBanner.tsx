import { Stack, Typography } from '@mui/material';
import Image from 'next/image';

interface TitleBannerProps {
  title: string;
  subTitle?: string;
}
function TitleBanner({ title, subTitle }: TitleBannerProps) {
  return (
    <Stack
      sx={{
        pt: { lg: 5.5, xl: 7 },
        ml: -3,
        mb: 7,
        flexDirection: 'row',
        alignItems: 'flex-end',
        cursor: 'pointer',
      }}
    >
      <Image
        src={`/images/${title}.webp`}
        alt={title}
        width={380}
        height={80}
        style={{
          objectFit: 'contain',
          marginLeft: title === '学修参考资料' ? '25px' : 0,
        }}
      />
      {subTitle && (
        <Typography
          variant='h2'
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
