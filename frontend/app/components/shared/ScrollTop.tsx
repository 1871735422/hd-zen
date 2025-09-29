'use client';
import { Fade, useScrollTrigger } from '@mui/material';
import Box from '@mui/material/Box';
import ToTopIcon from '../icons/ToTopIcon';

export const handleScrollTop = (
  event: React.MouseEvent<HTMLDivElement>,
  readingMode = false
) => {
  const anchor = (
    (event.target as HTMLDivElement).ownerDocument || document
  ).querySelector(`${readingMode ? '.' : '#'}back-to-top-anchor`);

  if (anchor) {
    anchor.scrollIntoView({
      block: 'center',
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
        onClick={e => handleScrollTop(e, visible)}
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
            fontSize: { lg: 50, xl: 64 },
          },
        }}
      >
        <ToTopIcon />
      </Box>
    </Fade>
  );
}
