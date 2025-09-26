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
    width: 30,
    hegit: 30,
  },
});

export default FileIconContainer;
