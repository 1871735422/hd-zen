import { pxToVw } from '@/app/utils/mobileUtils';
import { Slider, Stack } from '@mui/material';

export default function LineSpacingSlider({
  lineSpacing,
  setLineSpacing,
}: {
  lineSpacing: number;
  setLineSpacing: (lineSpacing: number) => void;
}) {
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Slider
        value={lineSpacing}
        onChange={(_, newValue: number | number[]) =>
          setLineSpacing(newValue as number)
        }
        min={0.9}
        max={2.8}
        step={0.1}
        sx={{
          height: pxToVw(34),
          position: 'relative',
          /* 左侧 */
          '&:before': {
            position: 'absolute',
            top: 0,
            left: 0,
            height: pxToVw(34),
            width: pxToVw(34),
            content: '"紧"',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: pxToVw(14),
            color: '#000',
            zIndex: 1,
          },
          /* 右侧 */
          '&:after': {
            position: 'absolute',
            top: 0,
            right: 0,
            height: pxToVw(34),
            width: pxToVw(34),
            content: '"松"',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: pxToVw(14),
            color: '#000',
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
              content: `"行距"`,
              fontSize: pxToVw(13),
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
