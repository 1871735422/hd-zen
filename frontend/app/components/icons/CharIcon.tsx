import { SvgIcon } from '@mui/material';

const CharIcon = () => (
  <SvgIcon
    sx={{
      fontSize: '0.85em',
    }}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 19.99005126953125 20'
      fill='currentColor'
      width={'1em'}
      height={'1em'}
    >
      <defs>
        <linearGradient id='char_icon_g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='var(--icon-btn-stop1, currentColor)' />
          <stop offset='90%' stopColor='var(--icon-btn-stop2, currentColor)' />
        </linearGradient>
      </defs>
      <path
        d='M14.19 0L5.81 0C2.17 0 0 2.17 0 5.81L0 14.18C0 17.83 2.17 20 5.81 20L14.18 20C17.82 20 19.99 17.83 19.99 14.19L19.99 5.81C20 2.17 17.83 0 14.19 0ZM15 15.47C13.29 15.47 11.69 14.73 10.41 13.36C8.96 14.67 7.07 15.47 5 15.47C4.59 15.47 4.25 15.13 4.25 14.72C4.25 14.31 4.59 13.97 5 13.97C8.47 13.97 11.34 11.22 11.71 7.7L10 7.7L5.01 7.7C4.6 7.7 4.26 7.36 4.26 6.95C4.26 6.54 4.6 6.21 5.01 6.21L9.25 6.21L9.25 5.28C9.25 4.87 9.59 4.53 10 4.53C10.41 4.53 10.75 4.87 10.75 5.28L10.75 6.21L12.44 6.21C12.46 6.21 12.48 6.2 12.5 6.2C12.52 6.2 12.54 6.21 12.56 6.21L14.99 6.21C15.4 6.21 15.74 6.55 15.74 6.96C15.74 7.37 15.4 7.71 14.99 7.71L13.21 7.71C13.06 9.42 12.42 10.99 11.44 12.27C12.44 13.38 13.69 13.98 15 13.98C15.41 13.98 15.75 14.32 15.75 14.73C15.75 15.14 15.41 15.47 15 15.47Z'
        fill='url(#char_icon_g)'
      ></path>
    </svg>
  </SvgIcon>
);

export default CharIcon;
