'use client';

import Box from '@mui/material/Box';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import CourseCard from './CourseCard';

/**
 * 移动端课程介绍模块
 * 包含三个课程册子的详细介绍
 */
const CourseIntroSection: React.FC = () => {
  const courseBooks = [
    {
      title: '第一册',
      description:
        '第一册含10课内容。介绍佛教的因果、轮回等基础见解以及解脱的原理，了解如何做一个标准的居士。主要内容包括：人身难得、寿命无常、轮回痛苦、因果不虚等四外加行的修法。',
    },
    {
      title: '第二册',
      description:
        '第二册含16课内容。介绍佛教的二谛、四谛、十二缘起等核心理念，以及皈依、发心、素食的意义，教授金刚萨埵除障法、供曼茶罗、上师瑜伽等五内加行的具体修法。',
    },
    {
      title: '第三册',
      description:
        '第三册含9课内容。本册开始进入实修阶段，介绍了出坐与入坐的方法以及四个外加行——人身难得、寿命无常、轮回痛苦、因果不虚的具体修法。',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        paddingX: pxToVw(20),
        paddingY: pxToVw(32),
        background:
          'linear-gradient(180deg, #D0E6F8 0%, rgba(208, 230, 248, 0.3) 100%)',
      }}
    >
      {courseBooks.map((book, index) => (
        <CourseCard
          key={index}
          title={book.title}
          description={book.description}
        />
      ))}
    </Box>
  );
};

export default CourseIntroSection;
