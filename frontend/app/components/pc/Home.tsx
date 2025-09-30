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
          height: { lg: 480, xl: 686 },
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
            width: { lg: 522, xl: 722 },
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
              ml: '97px',
              mr: '101px',
            },
            '& .MuiTypography-body1': {
              color: DESC_TEXT_COLOR,
              fontSize: { lg: 20, xl: 22 },
              lineHeight: '36px',
            },
            '& .MuiTypography-body1:nth-child(3)': {
              py: 3,
            },
          }}
        >
          <Typography
            fontSize={{ lg: 28, xl: 39 }}
            fontWeight={500}
            lineHeight={'57px'}
            color={TITLE_COLOR}
            textAlign='center'
            mt={'51px'}
            mb={'10px'}
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
