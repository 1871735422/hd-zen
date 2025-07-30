import { Box, Container } from '@mui/material';
import { getCourses, getCourseImageUrl } from '../api';
import BookCard from '../components/pc/BookCard';

async function CoursePage() {
  const { items: courses } = await getCourses();

  return (
    <Container
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '62%',
        }}
      >
        {courses.map((course, idx) => (
          <BookCard
            key={course.id}
            idx={idx}
            title={course.title}
            description={course.description || ''}
            cover={getCourseImageUrl(course, true)}
            courseId={course.id}
          />
        ))}
      </Box>
    </Container>
  );
}

export default CoursePage;
