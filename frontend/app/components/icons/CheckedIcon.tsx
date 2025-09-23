import { SvgIcon, SxProps } from '@mui/material';

const CheckedIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon
    sx={{
      width: 14,
      height: 14,
      cursor: 'pointer',
      ...sx,
    }}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 17 17'
      fill='none'
    >
      <circle
        cx='8.5'
        cy='8.5'
        r='8'
        stroke='rgba(194, 194, 194, 1)'
        strokeWidth='1'
        fill='#FFFFFF'
      ></circle>
      <circle cx='8.5' cy='8.5' r='3' fill='rgba(42, 130, 228, 1)'></circle>
    </svg>
  </SvgIcon>
);

export default CheckedIcon;
