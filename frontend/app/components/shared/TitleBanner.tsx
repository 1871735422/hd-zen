'use client';
import { getSubTitle } from '@/app/utils/courseUtils';
import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface TitleBannerProps {
  title: string;
}
function TitleBanner({ title }: TitleBannerProps) {
  const pathname = usePathname();
  const courseOrder = pathname.split('/')[2]?.replace('lesson', '');
  const subTitle = getSubTitle(courseOrder);
  return (
    <Stack
      sx={{
        pt: { sm: 2, md: 3, lg: 5, xl: 7, xxl: 8 },
        ml: { sm: -1, md: -2, lg: -3, xl: -3, xxl: -4 },
        mb: { sm: 3, md: 4, lg: 5, xl: 7, xxl: 8 },
        flexDirection: 'row',
        alignItems: 'flex-end',
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
      {pathname.startsWith('/qa') && (
        <Typography
          className='bei-fang'
          lineHeight={2}
          sx={{
            background:
              'linear-gradient(222deg, rgba(255, 168, 184, 1) 0%, rgba(255, 106, 114, 1) 69.37%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 30,
            ml: -4,
            pb: 0.3,
          }}
        >
          {subTitle}
        </Typography>
      )}
    </Stack>
  );
}

export default TitleBanner;
