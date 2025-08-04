import { Box, Typography } from '@mui/material';
import React from 'react';
import { getCourses } from '../../api';
import CourseCarousel, { CardData } from './CourseCarousel';

const TITLE_COLOR = 'rgba(64, 90, 133, 1)';
const DESC_TEXT_COLOR = 'rgba(59, 77, 115, 1)';

const Home: React.FC = async () => {
  const { items: courses } = await getCourses();

  // Transform courses to CardData format for the carousel
  const carouselData: CardData[] = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description || '探索佛法智慧，开启心灵之旅',
    imageUrl: course.cover
      ? `https://zen.huidengzg.com/api/files/courses/${course.id}/${course.cover}`
      : '/images/default-course.jpg',
  }));

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* 主内容区域 */}
      <Box
        sx={{
          height: { xs: '50vh', sm: '55vh', md: '680px' },
          width: '100%',
          backgroundImage: 'url(/images/hero-bg.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto 100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: 10,
            height: '100%',
            width: { xs: '80%', sm: '60%', md: '50%', lg: '35.5%' },
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage:
              'url(/images/hero-mask.png), linear-gradient(229.09deg, rgba(255, 255, 255, 0.5) 0.02%, rgba(255, 255, 255, 0.28) 100%)',
            backgroundSize: '100% auto, 100% 100%',
            backgroundRepeat: 'no-repeat, no-repeat',
            backdropFilter: 'blur(30px)',
            opacity: 1,
          }}
        >
          <Typography
            variant='h1'
            fontWeight={500}
            fontSize={{ xs: 20, sm: 22, md: 24, lg: 38 }}
            py={2}
            mt={4}
            color={TITLE_COLOR}
          >
            慧灯禅修课简介
          </Typography>
          <Typography
            variant='body1'
            color={DESC_TEXT_COLOR}
            fontSize={{ xs: 14, sm: 16, md: 18, lg: 22 }}
            sx={{ lineHeight: '36px' }}
          >
            慧灯禅修课是一套专为现代人定制的佛法学修系列课程。先介绍佛法的基本见解、解脱原理等，然后结合理论逐级实修，从基础的四外加行和五内加行开始，再经寂止的训练，最后达到证悟空性的境界。
          </Typography>
          <Typography
            variant='body1'
            color={DESC_TEXT_COLOR}
            fontSize={{ xs: 14, sm: 16, md: 18, lg: 22 }}
            sx={{ lineHeight: '36px', mt: 3 }}
          >
            这是一条通往解脱的最便捷且最稳妥之路。古往今来，无数人依此修行而获得了最高成就。导师慈诚罗珠堪布，更是一位当代公认兼具智慧与慈悲的大善知识，擅于以深入浅出的方式，将博大精深的佛法教义传递给大众，力求让每一个普通人都能理解并掌握修行的正确方法，真正获益。
          </Typography>
          <Typography
            variant='body1'
            color={DESC_TEXT_COLOR}
            fontSize={{ xs: 14, sm: 16, md: 18, lg: 22 }}
            sx={{ lineHeight: '36px', mt: 3 }}
          >
            愿慧灯禅修系列课程能帮助大家探索、发现心中永恒的光明！
          </Typography>
        </Box>
      </Box>

      {/* 课程模块区域 */}
      <CourseCarousel cards={carouselData} />
    </Box>
  );
};

export default Home;
