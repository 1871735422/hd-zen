import Box from '@mui/material/Box';
import React from 'react';
import HeroSection from './HeroSection';
import CourseIntroSection from './CourseIntroSection';

/**
 * 移动端首页
 * 根据设计稿重新设计，包含Hero模块和课程介绍模块
 */
const Home: React.FC = async () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero 模块 */}
      <HeroSection />

      {/* 课程介绍模块 */}
      <CourseIntroSection />
    </Box>
  );
};

export default Home;
