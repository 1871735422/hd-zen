import { SvgIcon } from '@mui/material';

const ArrowTop = () => (
  // 保留内层 svg，同时让图标尺寸继承父级字体大小
  <SvgIcon fontSize='inherit'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 13 7'
      width='1em'
      height='1em'
      fill='none'
    >
      <path
        stroke='currentColor'
        strokeWidth='1'
        strokeLinejoin='round'
        strokeLinecap='round'
        d='M0.5 6.5L6.5 0.5L12.5 6.5'
      ></path>
    </svg>
  </SvgIcon>
);

export default ArrowTop;
