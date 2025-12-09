'use client';

import { trackDownload } from '@/app/utils/clarityAnalytics';
import { Link, LinkProps, styled } from '@mui/material';
import React from 'react';

const StyledLink = styled(Link)({
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

interface FileIconContainerProps extends LinkProps {
  fileType?: string;
  fileName?: string;
}

const FileIconContainer: React.FC<FileIconContainerProps> = ({
  fileType,
  fileName,
  href,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 下载统计
    if (href && href !== '#' && fileType) {
      trackDownload(fileType, fileName, href);
    }
    onClick?.(e);
  };

  return <StyledLink href={href} onClick={handleClick} {...props} />;
};

export default FileIconContainer;
