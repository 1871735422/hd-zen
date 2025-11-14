import { pxToVw } from '@/app/utils/mobileUtils';
import { Slider, Stack, Typography } from '@mui/material';

export default function FontSizeSlider({
  fontSize,
  setFontSize,
  bgColor,
}: {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  bgColor: string;
}) {
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      mb={1.5}
    >
      {/* 左侧小 A */}
      <Typography
        sx={{
          fontSize: pxToVw(12),
          fontWeight: 400,
          color: '#000',
          transform: 'scaleX(1.2)',
        }}
      >
        A
      </Typography>
      <Slider
        value={fontSize}
        onChange={(_, newValue: number | number[]) =>
          setFontSize(newValue as number)
        }
        min={10}
        max={28}
        step={1}
        sx={{
          height: pxToVw(34),
          mx: pxToVw(20),
          pb: `0 !important`,
          '& .MuiSlider-rail': {
            height: pxToVw(34),
            borderRadius: pxToVw(20),
            background: bgColor,
            opacity: 1,
          },
          '& .MuiSlider-track': {
            display: 'none',
          },
          '& .MuiSlider-thumb': {
            width: pxToVw(34),
            height: pxToVw(34),
            borderRadius: '50%',
            backgroundColor: '#fff',

            '&:before': {
              content: `"${fontSize}"`,
              fontSize: pxToVw(16),
              fontWeight: 400,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        }}
      />
      {/* 右侧大 A */}
      <Typography
        sx={{
          fontSize: pxToVw(18),
          fontWeight: 400,
          color: '#000',
          transform: 'scaleX(1.1)',
        }}
      >
        A
      </Typography>
    </Stack>
  );
}
