import { getBookChapters } from '@/app/api';
import { Container, Grid, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bookOrder = parseInt(slug, 10);

  const books = await getBookChapters(bookOrder);
  // console.log(books);

  if (!books) {
    notFound();
  }
  if (isNaN(bookOrder) || bookOrder < 1) {
    notFound();
  }

  return (
    <Container
      maxWidth='xl'
      sx={{
        paddingX: '0 !important',
      }}
    >
      <Grid
        container
        spacing={5}
        sx={{
          mt: 6,
          pb: 16,
        }}
      >
        {/* {cardItems.map(item => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              courseOrder={1}
              slug='reference'
              item={{
                idx: item.id,
                title: item.title,
              }}
            />
          </Grid>
        ))} */}
        <Typography>即将推出</Typography>
      </Grid>
    </Container>
  );
}
