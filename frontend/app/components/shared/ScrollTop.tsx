'use client';
import { Fade, useScrollTrigger } from '@mui/material';
import Box from '@mui/material/Box';
import ToTopIcon from '../icons/ToTopIcon';

export const handleScrollTop = (event: React.MouseEvent<HTMLDivElement>) => {
  const anchor = (
    (event.target as HTMLDivElement).ownerDocument || document
  ).querySelector('#back-to-top-anchor');

  if (anchor) {
    anchor.scrollIntoView({
      block: 'center',
    });
  }
};
export default function ScrollTop() {
  const trigger = useScrollTrigger({
    target: typeof window !== 'undefined' ? window : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleScrollTop}
        aria-label='scroll back to top'
        role='presentation'
        sx={{
          position: 'fixed',
          bottom: 60,
          right: 16,
          color: 'rgba(127, 173, 235, 1)',
        }}
      >
        <ToTopIcon />
      </Box>
    </Fade>
  );
}
