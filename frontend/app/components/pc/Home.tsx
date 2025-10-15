import { Box, Typography } from '@mui/material';
import React from 'react';
import { getCourses } from '../../api';
import CourseCarousel, { CardData } from './CourseCarousel';

const TITLE_COLOR = 'rgba(64, 90, 133, 1)';
const DESC_TEXT_COLOR = 'rgba(59, 77, 115, 1)';

const Home: React.FC = async () => {
  const { items: courses } = await getCourses();

  // Transform courses to CardData format for the carousel
  const carouselData: CardData[] = courses.map((course, idx) => ({
    id: (idx + 1).toString(),
    title: course.title,
    description: course.description || '',
    imageUrl: course.cover
      ? `https://zen.huidengzg.com/api/files/courses/${course.id}/${course.cover}`
      : '',
  }));

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* 主内容区域 */}
      <Box
        sx={{
          height: { sm: 300, md: 380, lg: 480, xl: 686, xxl: 800 },
          width: '100%',
          backgroundImage: 'url(/images/hero-bg.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        {/* hero 头图 */}
        <Box
          sx={{
            height: '100%',
            width: { sm: '90%', md: '85%', lg: 522, xl: 722, xxl: 900 },
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: 'url(/images/hero-mask.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(20px)',
            // 使用 clip-path 排除右下角底边很长、高度很小的三角形区域
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 83.5%, 0% 100%)',
            '& .MuiTypography-root': {
              ml: {
                sm: '20px',
                md: '40px',
                lg: '97px',
                xl: '101px',
                xxl: '120px',
              },
              mr: {
                sm: '20px',
                md: '40px',
                lg: '101px',
                xl: '101px',
                xxl: '120px',
              },
            },
            '& .MuiTypography-body1': {
              color: DESC_TEXT_COLOR,
              fontSize: { sm: 12, md: 14, lg: 16, xl: 22, xxl: 24 },
              lineHeight: {
                sm: 1.3,
                md: 1.25,
                lg: 1.2,
                xl: '36px',
                xxl: '40px',
              },
            },
            '& .MuiTypography-body1:nth-child(3)': {
              py: { sm: 1.5, md: 2, lg: 3, xl: 3, xxl: 4 },
            },
          }}
        >
          <Typography
            fontSize={{ sm: 20, md: 24, lg: 28, xl: 39, xxl: 44 }}
            fontWeight={500}
            lineHeight={{
              sm: '28px',
              md: '32px',
              lg: '40px',
              xl: '57px',
              xxl: '64px',
            }}
            color={TITLE_COLOR}
            textAlign='center'
            mt={{ sm: '20px', md: '30px', lg: '51px', xl: '51px', xxl: '60px' }}
            mb={{ sm: '5px', md: '8px', lg: '10px', xl: '10px', xxl: '12px' }}
            variant='h2'
          >
            慧灯禅修课简介
          </Typography>
          <Typography>
            慧灯禅修课是一套专为现代人定制的佛法学修系列课程。先介绍佛法的基本见解、解脱原理等，然后结合理论逐级实修，从基础的四外加行和五内加行开始，再经寂止的训练，最后达到证悟空性的境界。
          </Typography>

          <Typography>
            这是一条通往解脱的最便捷且最稳妥之路。古往今来，无数人依此修行而获得了最高成就。导师慈诚罗珠堪布，更是一位当代公认兼具智慧与慈悲的大善知识，擅于以深入浅出的方式，将博大精深的佛法教义传递给大众，力求让每一个普通人都能理解并掌握修行的正确方法，真正获益。
          </Typography>

          <Typography>
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
