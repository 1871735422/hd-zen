import { Stack } from '@mui/material';
import Image from 'next/image';

interface TitleBannerProps {
  title: string;
}
function TitleBanner({ title }: TitleBannerProps) {
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
    </Stack>
  );
}

export default TitleBanner;
