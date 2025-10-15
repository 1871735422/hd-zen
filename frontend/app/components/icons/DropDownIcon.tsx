import { SvgIcon, type SvgIconProps } from '@mui/material';

const DropDownIcon = (props: SvgIconProps) => (
  <SvgIcon viewBox='0 0 24 24' {...props}>
    <path
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M7 10l5 5 5-5'
    />
  </SvgIcon>
);

export default DropDownIcon;
