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
        borderRadius: { lg: '25px', xl: '30px' },
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: { lg: 14, xl: 18 },
        minHeight: { lg: '36px', xl: '46px' },
        border: '2px solid rgba(186, 213, 245, 1)',
        boxSizing: 'border-box',
        py: 0.75,
        color: 'rgba(154, 189, 230, 1)',
        '&:hover': {
          background: 'linear-gradient(90deg, #4687cf 0%, #a9cefa 100%)',
          color: 'white',
          border: 'none',
          py: 1,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
