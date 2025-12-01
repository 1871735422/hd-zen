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
          minHeight: { lg: 550, xlg: 578, xl: 686, xxl: 686 },
          backgroundImage: {
            xxl: 'url(/images/hero-bg-xxl.jpg)',
            xl: 'url(/images/hero-bg-xxl.jpg)',
            lg: 'url(/images/hero-bg-xxl.jpg)',
            xlg: 'url(/images/hero-bg-xxl.jpg)',
          },
          backgroundPosition: 'top',
          // backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', // 宽、高度定了，只能用cover
          position: 'relative',
        }}
      >
        {/* hero 头图 */}
        <Box
          sx={{
            height: { xl: 681, lg: 542, xlg: 578 },
            width: { lg: 530, xlg: 565, xl: 722, xxl: 725 },
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
                xlg: '78px',
                xl: '101px',
                xxl: '101px',
              },
            },
            '& .MuiTypography-body1': {
              textAlign: 'justify',
              color: DESC_TEXT_COLOR,
              fontSize: { lg: 17, xlg: 17.5, xl: 22, xxl: 22 },
              lineHeight: 1.63,
            },
            '& .MuiTypography-body1:nth-child(3)': {
              py: { lg: 2.5, xlg: 2.5, xl: 3, xxl: 3 },
            },
          }}
        >
          <Typography
            variant='h2'
            fontSize={{ lg: 30, xlg: 31, xl: 39, xxl: 39 }}
            fontWeight={500}
            textAlign='center'
            lineHeight={1.5}
            color={TITLE_COLOR}
            mt={{ lg: '40px', xlg: '44px', xl: '51px', xxl: '40px' }}
            mb={{ lg: '10px', xlg: '12px', xl: '10px', xxl: '10px' }}
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
