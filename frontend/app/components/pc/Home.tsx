import { Box, Typography } from '@mui/material';
import React from 'react';
import { getCourses } from '../../api';
import { courseIntro } from '../../utils/content';
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
  }));

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* 主内容区域 */}
      <Box
        sx={{
          minHeight: { lg: 480, xlg: 580, xl: 686, xxl: 900 },
          backgroundImage: {
            xxl: 'url(/images/hero-bg-xxl.jpg)',
            xl: 'url(/images/hero-bg.webp)',
            lg: 'url(/images/hero-bg.webp)',
          },
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', // 宽、高度定了，只能用cover
          position: 'relative',
        }}
      >
        {/* hero 头图 */}
        <Box
          sx={{
            height: { xl: '100%', lg: 479, xlg: 577 },
            width: { lg: 575, xlg: 680, xl: 722, xxl: 920 },
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
              mx: {
                lg: '67px',
                xlg: '85px',
                xl: '101px',
                xxl: '110px',
              },
            },
            '& .MuiTypography-body1': {
              textAlign: 'justify',
              color: DESC_TEXT_COLOR,
              fontSize: { lg: 18, xlg: 20, xl: 22, xxl: 24 },
              lineHeight: {
                lg: '24px',
                xlg: '28px',
                xl: '36px',
                xxl: '48px',
              },
            },
            '& .MuiTypography-body1:nth-child(3)': {
              py: { lg: 3, xlg: 4, xl: 3, xxl: 4 },
            },
          }}
        >
          <Typography
            variant='h2'
            fontSize={{ lg: 32, xlg: 36, xl: 39, xxl: 48 }}
            fontWeight={500}
            textAlign='center'
            lineHeight={{
              lg: '36px',
              xlg: '40px',
              xl: '57px',
              xxl: '64px',
            }}
            color={TITLE_COLOR}
            mt={{ lg: '40px', xlg: '50px', xl: '51px', xxl: '60px' }}
            mb={{ lg: '10px', xlg: '12px', xl: '10px', xxl: '12px' }}
          >
            {courseIntro.title}
          </Typography>
          {courseIntro.paragraphs.map((paragraph, index) => (
            <Typography key={index}>{paragraph}</Typography>
          ))}
        </Box>
      </Box>

      {/* 课程模块区域 */}
      <CourseCarousel cards={carouselData} />
    </Box>
  );
};

export default Home;
