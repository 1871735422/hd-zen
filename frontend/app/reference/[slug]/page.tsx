import { getBookChapters } from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import { Container, Grid, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: bookOrder } = await params;
  const books = await getBookChapters(bookOrder);
  // console.log(books);

  if (!books) {
    notFound();
  }
  if (Number(bookOrder) < 1) {
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
        {books?.length ? (
          books.map(item => (
            <Grid key={item.id} size={{ md: 4 }}>
              <CourseCard
                courseOrder={item?.expand?.bookId?.displayOrder}
                slug='reference'
                item={{
                  idx: item.ordering,
                  title: item.article_title,
                  description: item.article_summary || '',
                }}
              />
            </Grid>
          ))
        ) : (
          <Typography>即将推出</Typography>
        )}
      </Grid>
    </Container>
  );
}
