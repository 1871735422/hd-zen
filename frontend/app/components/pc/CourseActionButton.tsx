'use client';

import { Button, ButtonProps } from '@mui/material';

export default function CourseActionButton({
  children,
  sx,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant='outlined'
      sx={{
        m: '0 auto',
        borderRadius: { lg: '25px', xl: '30px' },
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: { lg: 14, xl: 18, xxl: 20 },
        minHeight: { lg: '34px', xl: '46px' },
        border: '2px solid rgba(186, 213, 245, 1)',
        boxSizing: 'border-box',
        py: '6px',
        color: 'rgba(154, 189, 230, 1)',
        '&:hover': {
          background: 'linear-gradient(90deg, #4687cf 0%, #a9cefa 100%)',
          color: 'white',
          border: 'none',
          py: '8px',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
