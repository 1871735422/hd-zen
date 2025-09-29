import { SvgIcon } from '@mui/material';

const AudioPlayIcon = () => (
  <SvgIcon
    sx={{
      fontSize: { lg: 18, xl: 20 },
      cursor: 'pointer',
      padding: '2px 1px 2px 3px',
    }}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width='13.009765625'
      height='20'
      viewBox='0 0 13.009765625 20'
      fill='currentColor'
    >
      <path
        d='M11.95 7.84561L8.59 5.02561L3.13 0.445605C1.97293 -0.511537 0 0.174177 0 1.54561L0 10.4456L0 18.4556C0 19.827 1.97293 20.517 3.13 19.5456L11.95 12.1456C13.3623 10.9742 13.3623 9.03132 11.95 7.84561Z'
        fillRule='evenodd'
        fill='url(#linear_fill_267_716)'
      ></path>
      <defs>
        <linearGradient
          id='linear_fill_267_716'
          x1='0'
          y1='9.99560546875'
          x2='13'
          y2='9.99560546875'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0' stopColor='#4686CF' />
          <stop offset='1' stopColor='#AACFFA' />
        </linearGradient>
      </defs>
    </svg>
  </SvgIcon>
);

export default AudioPlayIcon;
