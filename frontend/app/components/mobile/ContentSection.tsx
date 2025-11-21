'use client';

import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { courseIntro } from '../../utils/content';
import { pxToVw } from '../../utils/mobileUtils';
import ArrowTop from '../icons/ArrowTop';
import CourseIntroSection from './CourseIntroSection';

/**
 * 移动端 Hero 模块
 * 根据设计稿实现蓝色渐变背景和标题
 */
const ContentSection: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  function handleToggleCollapse() {
    setIsCollapsed(prev => !prev);
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: pxToVw(700),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingX: pxToVw(17),
        mt: pxToVw(-40),
        overflow: 'hidden',
      }}
    >
      {/* 标题和描述 */}
      <Box
        onClick={handleToggleCollapse}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          px: pxToVw(16),
          pt: pxToVw(20),
          borderRadius: pxToVw(15),
          pb: pxToVw(isCollapsed ? 32 : 30),
          mb: pxToVw(16),
          background:
            'linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 42.54%, rgba(255, 255, 255, 0) 100%)',
          '& .MuiTypography-body1': {
            fontSize: pxToVw(16),
            color: 'rgba(26, 41, 76, 1)',
            lineHeight: 1.5,
            textAlign: 'justify',
            maxWidth: pxToVw(310),
          },
          '& .MuiTypography-body1:not(:first-child)': {
            marginTop: pxToVw(12),
          },
          '&::before': {
            zIndex: -1,
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            borderLeft: '1px solid transparent',
            borderRight: '1px solid transparent',
            borderImage:
              'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%) 1',
            width: '100%',
            height: isCollapsed ? '93%' : '97%',
          },
          '&::after': {
            zIndex: -1,
            content: '""',
            position: 'absolute',
            top: 0,
            left: '5%',
            borderBottom: '1px solid transparent',
            borderImage:
              'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%) 1',
            width: '90%',
            height: '100%',
          },
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontSize: pxToVw(24),
            fontWeight: 'bold',
            color: 'rgba(26, 41, 76, 1)',
            marginBottom: pxToVw(16),
            textAlign: 'left',
          }}
        >
          {courseIntro.title}
        </Typography>

        {/* 折叠时：仅展示第一段的前 4 行；展开时：展示全部段落 */}
        {isCollapsed ? (
          <Typography
            variant='body1'
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {courseIntro.paragraphs[0]}
          </Typography>
        ) : (
          <>
            <Typography variant='body1' sx={{}}>
              {courseIntro.paragraphs[0]}
            </Typography>
            <Typography variant='body1' sx={{}}>
              {courseIntro.paragraphs[1]}
            </Typography>
            <Typography variant='body1' sx={{}}>
              {courseIntro.paragraphs[2]}
            </Typography>
          </>
        )}

        <IconButton
          sx={{
            width: 'fit-content',
            position: 'absolute',
            bottom: pxToVw(1),
            left: `calc(50% - ${pxToVw(14)} / 2)`,
            color: 'rgba(130, 178, 232, 1)',
            fontSize: pxToVw(14),
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'transform 200ms ease',
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ArrowTop />
        </IconButton>
      </Box>
      {/* 课程介绍模块 */}
      <CourseIntroSection />
    </Box>
  );
};

export default ContentSection;
