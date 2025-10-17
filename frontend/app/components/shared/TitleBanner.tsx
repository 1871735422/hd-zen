import { Stack } from '@mui/material';
import Image from 'next/image';

interface TitleBannerProps {
  title: string;
}
function TitleBanner({ title }: TitleBannerProps) {
  return (
    <Stack
      sx={{
        pt: { sm: 2, md: 3, lg: 5, xl: 7, xxl: 8 },
        ml: { sm: -1, md: -2, lg: -3, xl: -3, xxl: -4 },
        mb: { sm: 3, md: 4, lg: 5, xl: 7, xxl: 8 },
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
    </Stack>
  );
}

export default TitleBanner;
