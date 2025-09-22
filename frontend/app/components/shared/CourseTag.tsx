'use client';
import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import React from 'react';

const StyledChip = styled(Chip)(() => ({
  borderRadius: '20px',
  height: 'auto',
  border: 'none',
  backgroundColor: '#fff',
  color: '#8BA2B0',
  cursor: 'pointer',
  '&:hover': {
    color: '#fff',
    backgroundColor: '#A5C9F2',
  },
  '& .MuiChip-label': {
    padding: '3px 8px',
  },
}));

const CourseTag: React.FC<ChipProps> = ({ label, ...rest }) => {
  const router = useRouter();
  return (
    <StyledChip
      onClick={() => router.push(`/tags?tag=${label}`)}
      label={label}
      variant={'filled'}
      {...rest}
    />
  );
};

CourseTag.displayName = 'CourseTag';

export default CourseTag;
