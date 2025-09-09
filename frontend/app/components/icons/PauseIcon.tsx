import { SvgIcon } from '@mui/material';

export default function PauseIcon() {
  return (
    <SvgIcon sx={{ fontSize: 20 }}>
      <defs>
        <linearGradient id='audio_pause_gradient' x1='0' y1='0' x2='28' y2='0'>
          <stop offset='0' stopColor='#4686CF' />
          <stop offset='1' stopColor='#AACFFA' />
        </linearGradient>
      </defs>
      <path d='M6 4H10V20H6V4Z' fill='url(#audio_pause_gradient)' />
      <path d='M14 4H18V20H14V4Z' fill='url(#audio_pause_gradient)' />
    </SvgIcon>
  );
}
