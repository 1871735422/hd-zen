import CourseCard from '@/app/components/pc/CourseCard';
import { lessonItems as cardItems } from '@/app/constants';
import { Container, Grid } from '@mui/material';

export default function CoursePage() {
  return (
    <Container
      maxWidth='lg'
      sx={{
        backgroundImage: 'url(/images/sun-bg@2x.webp)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Grid container spacing={4}>
        {cardItems.map(item => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              item={{
                id: item.id,
                title: item.title,
                description: `三个差别是佛法的基础知识。本课介绍了学佛三个目标的差别，即外教和佛教的差别、世间法和出世间法的差别… `,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
