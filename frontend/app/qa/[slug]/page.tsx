import CategorySelector from '@/app/components/pc/CategorySelector';
import CourseCard from '@/app/components/pc/CourseCard';
import { Box, Container, Grid, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { pb } from '../../api';

export default async function QaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { items: questionItems } = await pb.collection('questions').getList(1, 10);
  const categories = questionItems.map(item => item.title);

  const idx = parseInt(slug, 10);
  if (isNaN(idx) || idx < 1 || idx > categories.length) {
    notFound();
  }
  const selectedCategory = categories[idx - 1];

  return (
    <Container maxWidth='lg'>
      <Box sx={{ pt: 5, pb: 8 }}>
        <Typography
          variant='h1'
          sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}
        >
          问答
        </Typography>
      </Box>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
      />
      <Grid container spacing={4}>
        {questionItems.map(item => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              item={{
                id: parseInt(item.id, 10),
                title: item.title,
                description: item.content,
                isQa: true,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
