import { SvgIcon } from '@mui/material';

const ArrowTop = () => (
  // 保留内层 svg，同时让图标尺寸继承父级字体大小
  <SvgIcon fontSize='inherit'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width='38'
      height='38'
      viewBox='0 0 38 38'
      fill='none'
    >
      <path
        d='M38 19C38 29.4934 29.4934 38 19 38C8.50659 38 0 29.4934 0 19C0 8.50659 8.50659 0 19 0C29.4934 0 38 8.50659 38 19Z'
        fill='url(#linear_fill_483_8)'
      ></path>
      <path
        d='M19.592 10.6823C21.2062 10.6823 22.5161 9.32224 22.5161 7.64414C22.5161 5.96605 21.2062 4.60596 19.592 4.60596C17.9778 4.60596 16.668 5.96605 16.668 7.64414C16.668 9.32224 17.9763 10.6823 19.592 10.6823Z'
        fill='url(#linear_fill_483_10)'
      ></path>
      <path
        d='M30.6517 22.6295C28.8147 19.5685 23.3887 25.2667 20.5431 27.4226C20.369 27.3443 20.1944 27.2558 20.0218 27.1677C20.0956 27.1171 20.1695 27.0669 20.2385 27.0131C23.3791 24.9208 25.7748 21.496 25.494 16.6509C25.3983 15.007 24.2168 11.8989 20.4236 11.8989L20.4174 11.8989L18.7341 11.8989L18.7279 11.8989C14.9348 11.8989 13.7533 15.007 13.6576 16.6509C13.3768 21.496 15.7741 24.9224 18.9131 27.0131C18.9821 27.0669 19.056 27.1171 19.1297 27.1677C18.9556 27.2558 18.7826 27.346 18.6085 27.4226C15.7628 25.2667 10.3368 19.5685 8.49989 22.6295C6.66608 25.684 11.0474 28.3962 12.9252 28.5576C16.232 29.104 17.492 28.6372 19.3415 27.5641C19.4199 27.5201 19.498 27.4776 19.5749 27.432C19.6517 27.4776 19.7304 27.5217 19.8089 27.5641C21.6599 28.6372 22.918 29.1056 26.2264 28.5576C28.1041 28.3962 32.4855 25.684 30.6517 22.6295Z'
        fill='url(#linear_fill_483_11)'
      ></path>
      <defs>
        <linearGradient
          id='linear_fill_483_8'
          x1='0'
          y1='0'
          x2='38'
          y2='38'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0' stopColor='#CBE3F7' />
          <stop offset='1' stopColor='#B6C2FA' />
        </linearGradient>
        <linearGradient
          id='linear_fill_483_10'
          x1='16.66796875'
          y1='7.64404296875'
          x2='22.51611328125'
          y2='7.64404296875'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0' stopColor='#FFFFFF' />
          <stop offset='1' stopColor='#FFFFFF' />
        </linearGradient>
        <linearGradient
          id='linear_fill_483_11'
          x1='8.060546875'
          y1='20.34326171875'
          x2='31.0908203125'
          y2='20.34326171875'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0' stopColor='#FFFFFF' />
          <stop offset='1' stopColor='#FFFFFF' />
        </linearGradient>
      </defs>
    </svg>
  </SvgIcon>
);

export default ArrowTop;
