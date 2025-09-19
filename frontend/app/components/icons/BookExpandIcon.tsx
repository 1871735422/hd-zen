import { SvgIcon, SxProps } from '@mui/material';

const BookExpandIcon = ({ sx }: { sx?: SxProps }) => (
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
      width='16.212890625'
      height='16.3564453125'
      viewBox='0 0 16.212890625 16.3564453125'
      fill='none'
    >
      <path
        d='M1.68848 2.38525L5.40397 2.38525C6.89635 2.38525 8.10615 3.60575 8.10615 5.11133L8.10615 14.3118C8.10615 13.1826 7.19879 12.2673 6.07951 12.2673L1.68848 12.2673L1.68848 2.38525Z'
        stroke='currentColor'
        strokeWidth='1.3333333333333333'
        strokeLinejoin='round'
      ></path>
      <path
        d='M14.5241 2.38525L10.8086 2.38525C9.31624 2.38525 8.10645 3.60575 8.10645 5.11133L8.10645 14.3118C8.10645 13.1826 9.0138 12.2673 10.1331 12.2673L14.5241 12.2673L14.5241 2.38525Z'
        stroke='currentColor'
        strokeWidth='1.3333333333333333'
        strokeLinejoin='round'
      ></path>
    </svg>
  </SvgIcon>
);

export default BookExpandIcon;
