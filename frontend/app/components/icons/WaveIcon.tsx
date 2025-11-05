import { SvgIcon, SxProps } from '@mui/material';

const WaveIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon
    sx={{
      width: 24,
      height: 24,
      cursor: 'pointer',
      ...sx,
    }}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width='26'
      height='26'
      viewBox='0 0 26 26'
      fill='none'
    >
      <defs>
        <linearGradient id='wave_icon_g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='var(--icon-btn-stop1, currentColor)' />
          <stop offset='90%' stopColor='var(--icon-btn-stop2, currentColor)' />
        </linearGradient>
      </defs>
      <g opacity='0'>
        <path d='M24 24L0 24L0 0L24 0L24 24Z' fill='#82B2E8'></path>
      </g>
      <path
        d='M16.19 2L7.81 2C4.17 2 2 4.17 2 7.81L2 16.18C2 19.83 4.17 22 7.81 22L16.18 22C19.82 22 21.99 19.83 21.99 16.19L21.99 7.81C22 4.17 19.83 2 16.19 2ZM6.75 14.14C6.75 14.55 6.41 14.89 6 14.89C5.59 14.89 5.25 14.55 5.25 14.14L5.25 9.86C5.25 9.45 5.59 9.11 6 9.11C6.41 9.11 6.75 9.45 6.75 9.86L6.75 14.14ZM9.75 15.57C9.75 15.98 9.41 16.32 9 16.32C8.59 16.32 8.25 15.98 8.25 15.57L8.25 8.43C8.25 8.02 8.59 7.68 9 7.68C9.41 7.68 9.75 8.02 9.75 8.43L9.75 15.57ZM12.75 17C12.75 17.41 12.41 17.75 12 17.75C11.59 17.75 11.25 17.41 11.25 17L11.25 7C11.25 6.59 11.59 6.25 12 6.25C12.41 6.25 12.75 6.59 12.75 7L12.75 17ZM15.75 15.57C15.75 15.98 15.41 16.32 15 16.32C14.59 16.32 14.25 15.98 14.25 15.57L14.25 8.43C14.25 8.02 14.59 7.68 15 7.68C15.41 7.68 15.75 8.02 15.75 8.43L15.75 15.57ZM18.75 14.14C18.75 14.55 18.41 14.89 18 14.89C17.59 14.89 17.25 14.55 17.25 14.14L17.25 9.86C17.25 9.45 17.59 9.11 18 9.11C18.41 9.11 18.75 9.45 18.75 9.86L18.75 14.14Z'
        fill='url(#wave_icon_g)'
      ></path>
    </svg>
  </SvgIcon>
);

export default WaveIcon;
