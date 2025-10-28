'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { courseIntro } from '../../utils/content';
import { pxToVw } from '../../utils/mobileUtils';

/**
 * 移动端 Hero 模块
 * 根据设计稿实现蓝色渐变背景和标题
 */
const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: pxToVw(400),
        background: 'linear-gradient(180deg, #A8C8E8 0%, #D0E6F8 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingX: pxToVw(20),
        paddingY: pxToVw(60),
        overflow: 'hidden',
      }}
    >
      {/* 背景装饰元素 - 模拟设计稿中的山峦和太阳 */}
      <Box
        sx={{
          position: 'absolute',
          top: pxToVw(80),
          right: pxToVw(-20),
          width: pxToVw(120),
          height: pxToVw(120),
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.3)',
          opacity: 0.6,
        }}
      />

      {/* 山峦背景 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: pxToVw(150),
          background:
            'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%)',
          clipPath:
            'polygon(0% 100%, 0% 60%, 20% 40%, 40% 50%, 60% 30%, 80% 45%, 100% 35%, 100% 100%)',
        }}
      />

      {/* 标题内容 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: pxToVw(24),
            fontWeight: 600,
            color: '#2C4A6B',
            marginBottom: pxToVw(16),
            lineHeight: 1.3,
          }}
        >
          {courseIntro.title}
        </Typography>

        <Typography
          sx={{
            fontSize: pxToVw(14),
            color: '#4A6B8A',
            lineHeight: 1.6,
            textAlign: 'justify',
            maxWidth: pxToVw(320),
          }}
        >
          {courseIntro.paragraphs[0]}
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroSection;
