'use client';
import { Fade, useScrollTrigger } from '@mui/material';
import Box from '@mui/material/Box';
import ToTopIcon from '../icons/ToTopIcon';

export const handleScrollTop = (event: React.MouseEvent<HTMLDivElement>) => {
  const anchor = (
    (event.target as HTMLDivElement).ownerDocument || document
  ).querySelector(`.back-to-top-anchor`);
  if (anchor) {
    anchor.scrollIntoView({
      block: 'start',
    });
  }
};

const color = 'rgba(127, 173, 235, 1)';

export default function ScrollTop({ bgColor = color, visible = false }) {
  const trigger = useScrollTrigger({
    target: typeof window !== 'undefined' ? window : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Fade in={visible || trigger}>
      <Box
        onClick={
          visible
            ? handleScrollTop
            : () =>
                window.scrollTo({
                  top: 0,
                })
        }
        aria-label='scroll back to top'
        role='presentation'
        sx={{
          position: 'fixed',
          fontWeight: 500,
          bottom: 60,
          right: 24,
          color: bgColor,
          zIndex: 1000,
          '& svg': {
            fontSize: { lg: 45, xl: 64, xxl: 72 },
          },
        }}
      >
        <ToTopIcon />
      </Box>
    </Fade>
  );
}
