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
        pt: 6,
        pb: 12,
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
        width={'60%'}
        px={{ lg: 0, xl: 3.5 }}
        sx={{ position: 'relative', zIndex: 2 }}
        gap={5}
        marginTop={{ lg: 0, xl: 1.25 }}
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
