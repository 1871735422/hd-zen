import { pxToVw } from '@/app/utils/mobileUtils';
import { Slider, Stack } from '@mui/material';

export default function FontWeightSlider({
  fontWeight,
  setFontWeight,
}: {
  fontWeight: number;
  setFontWeight: (fontWeight: number) => void;
}) {
  return (
    <Stack
      flex={1}
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Slider
        value={fontWeight / 100}
        onChange={(_, newValue: number | number[]) =>
          setFontWeight(newValue as number)
        }
        min={1}
        max={9}
        step={1}
        sx={{
          position: 'relative',
          height: pxToVw(34),
          /* 左侧小 B */
          '&:before': {
            position: 'absolute',
            top: 0,
            left: 0,
            height: pxToVw(34),
            width: pxToVw(34),
            content: '"B"',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: pxToVw(12),
            color: '#000',
            transform: 'scaleX(1.2)',
            zIndex: 1,
          },
          /* 右侧小 B */
          '&:after': {
            position: 'absolute',
            top: 0,
            right: 0,
            height: pxToVw(34),
            width: pxToVw(34),
            content: '"B"',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: pxToVw(18),
            fontWeight: 700,
            color: '#000',
            transform: 'scaleX(1.1)',
            zIndex: 1,
          },
          py: `0 !important`,
          '& .MuiSlider-rail': {
            height: pxToVw(34),
            borderRadius: pxToVw(20),
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
              content: `""`,
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
    </Stack>
  );
}
