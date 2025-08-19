'use client';
import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import React from 'react';

interface CourseTagProps extends ChipProps {
  /**
   * active = true 时显示填充（filled）样式
   * active = false 时显示描边（outlined）样式
   */
  active?: boolean;
}

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'active',
})<CourseTagProps>(({ theme, active }) => ({
  borderRadius: '20px',
  height:'auto',
  border: 'none',
  backgroundColor: active
    ? theme.palette.primary.main
    : '#fff',
  color: active
    ? '#fff'
    : '#8BA2B0',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.action.hover,
    cursor: 'pointer',
  },
  '& .MuiChip-label': {
    padding: '3px 8px'
  }
}));

const CourseTag: React.FC<CourseTagProps> = ({
  active = false,
  variant,
  ...rest
}) => {
  return (
    <StyledChip
      active={active}
      variant={active ? 'filled' : 'outlined'}
      {...rest}
    />
  );
};

CourseTag.displayName = 'CourseTag';

export default CourseTag;
