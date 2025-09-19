import { Container, Grid } from '@mui/material';
import { getCourseImageUrl, getCourses } from '../api';
import BookCard from '../components/pc/BookCard';

// 15分钟缓存
export const revalidate = 900;

async function CoursePage() {
  const { items: courses } = await getCourses();

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        mx: 0,
        pt: 6,
        pb: 12,
        background: 'url(/images/course-bg.png)',
      }}
    >
      <Grid
        container
        spacing={6}
        justifyContent='center'
        alignItems='center'
        width={{
          lg: '60%',
        }}
      >
        {courses.map((course, idx) => (
          <BookCard
            key={course.id}
            idx={idx}
            title={course.title}
            description={course.description || ''}
            cover={getCourseImageUrl(course, true)}
          />
        ))}
      </Grid>
    </Container>
  );
}

export default CoursePage;
