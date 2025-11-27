import Box from '@mui/material/Box';
import Image from 'next/image';
import React from 'react';
import ContentSection from './ContentSection';

/**
 * 移动端首页
 * 根据设计稿重新设计，包含Hero模块和课程介绍模块
 */
const Home: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'linear-gradient(180deg, rgba(187, 218, 249, 1) 0%, rgba(187, 218, 249, 1) 73.89%, rgba(210, 230, 248, 1) 100%)',
      }}
    >
      {/* Hero 模块 */}
      {/* 让图片像普通块级元素一样参与文档流并占据空间：
          不使用 fill，改为宽度 100% + 高度自适应，配合 sizes 实现响应式。 */}
      <Image
        src='/images/mobile/home-sun.webp'
        alt='home-sun'
        width={0}
        height={0}
        sizes='100vw'
        priority
        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
      />
      <ContentSection />
    </Box>
  );
};

export default Home;
