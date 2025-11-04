'use client';

import { Box } from '@mui/material';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import { MobileLessonMeta } from './MobileLessonMeta';

interface MobileLessonPageProps {
  title: string;
  author: string;
  date: string;
  description?: string;
  children?: React.ReactNode;
}

const MobileLessonPage: React.FC<MobileLessonPageProps> = ({
  title,
  author,
  date,
  description,
  children,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        pb: pxToVw(80),
      }}
    >
      <MobileLessonMeta
        title={title}
        author={author}
        date={date}
        description={description}
      />

      {/* 相关资料侧边栏（可展开/收起）*/}

      {/* 主内容区域 */}
      <Box
        sx={{
          px: pxToVw(20),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MobileLessonPage;
