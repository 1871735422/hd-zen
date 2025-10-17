'use client';

import { Link, styled } from '@mui/material';

const FileIconContainer = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 168, 184, 1) !important',
  paddingTop: 3,
  paddingBottom: -3,
  '&:hover': {
    color: 'rgba(255, 94, 124, 1) !important',
  },
  '& svg': {
    width: { lg: 28, xl: 30, xxl: 34 },
    height: { lg: 28, xl: 30, xxl: 34 },
  },
});

export default FileIconContainer;
