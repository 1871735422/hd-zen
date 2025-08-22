import { SvgIcon, SxProps } from '@mui/material';

const BookIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon
    sx={{
      width: 18,
      height: 18,
      cursor: 'pointer',
      ...sx,
    }}
    children={
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width='16.212890625'
        height='16.1912841796875'
        viewBox='0 0 16.212890625 16.1912841796875'
        fill='none'
      >
        <path
          d='M2.36426 12.4807C2.36426 9.88222 2.36426 3.71043 2.36426 3.71043C2.36426 2.59266 3.27161 1.68652 4.39089 1.68652L11.8219 1.68652L11.8219 10.4568C11.8219 10.4568 6.15832 10.4568 4.39089 10.4568C3.27624 10.4568 2.36426 11.3622 2.36426 12.4807Z'
          stroke='rgba(214, 214, 214, 1)'
          strokeWidth='1.3333333333333333'
          strokeLinejoin='round'
          fill='#D6D6D6'
        ></path>
        <path
          stroke='rgba(214, 214, 214, 1)'
          strokeWidth='1.3333333333333333'
          strokeLinejoin='round'
          strokeLinecap='round'
          d='M11.8219 10.4568C11.8219 10.4568 4.78058 10.4568 4.39089 10.4568C3.27161 10.4568 2.36426 11.363 2.36426 12.4807C2.36426 13.5985 3.27161 14.5046 4.39089 14.5046C5.13706 14.5046 8.73998 14.5046 13.8485 14.5046L13.8485 2.36121'
        ></path>
        <path
          stroke='rgba(214, 214, 214, 1)'
          strokeWidth='1.3333333333333333'
          strokeLinejoin='round'
          strokeLinecap='round'
          d='M4.72852 12.4807L11.484 12.4807'
        ></path>
      </svg>
    }
  />
);

export default BookIcon;
