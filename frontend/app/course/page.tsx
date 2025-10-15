import { Container, Grid } from '@mui/material';
import { getCourses } from '../api';
import BookCard from '../components/pc/BookCard';

export const metadata = {
  title: '慧灯禅修课', // 可选：在这里定义默认 metadata，页面会覆盖
  description: '慧灯禅修网站课程',
};

async function CoursePage() {
  const { items: courses } = await getCourses();

  return (
    <Container
      maxWidth={false}
      sx={{
        position: 'relative',
        display: 'flex',
        inset: 0,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        mx: 0,
        pt: { sm: 3, md: 4, lg: 6, xl: 6, xxl: 8 },
        pb: { sm: 6, md: 8, lg: 12, xl: 12, xxl: 16 },
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/course-bg.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(130,178,232,0.1)', // 半透明叠层
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          zIndex: 1,
          pointerEvents: 'none',
        },
      }}
    >
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        width={{ sm: 600, md: 800, lg: 1000, xl: 1200, xxl: 1400 }}
        px={{ sm: 2, md: 3, lg: 0, xl: 3.5, xxl: 4 }}
        sx={{ position: 'relative', zIndex: 2 }}
        gap={{ sm: 2, md: 3, lg: 5, xl: 5, xxl: 6 }}
        marginTop={{ sm: 1, md: 1.5, lg: 0, xl: 1.25, xxl: 2 }}
      >
        {courses.map((course, idx) => (
          <BookCard
            key={course.id}
            idx={idx}
            title={course.title}
            description={course.description || ''}
          />
        ))}
      </Grid>
    </Container>
  );
}

export default CoursePage;
