import { SvgIcon } from '@mui/material';

const BackIcon = () => (
  // 保留内层 svg，同时让图标尺寸继承父级字体大小
  <SvgIcon fontSize='inherit'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
    >
      <path
        stroke='rgba(68, 68, 68, 1)'
        strokeWidth='2'
        strokeLinejoin='round'
        strokeLinecap='round'
        d='M6 11.9958L18 11.9958'
      ></path>
      <path
        stroke='rgba(68, 68, 68, 1)'
        strokeWidth='2'
        strokeLinejoin='round'
        strokeLinecap='round'
        d='M12 18L6 12L12 6'
      ></path>
    </svg>
  </SvgIcon>
);

export default BackIcon;
