import { getBookChapters } from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import { Box, Container, Typography } from '@mui/material';
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
      <Box
        sx={{
          mt: 6,
          pb: 16,
        }}
      >
        {books?.length ? (
          (() => {
            const rows = [];
            for (let i = 0; i < books.length; i += 3) {
              const rowItems = books.slice(i, i + 3);
              rows.push(
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      rowItems.length === 3 ? 'space-between' : 'flex-start',
                    gap:
                      rowItems.length < 3
                        ? {
                            lg: `calc((100% - 330px * 3) / 2) `,
                            xl: `calc((100% - 437px * 3) / 2) `,
                            xxl: `calc((100% - 480px * 3) / 2) `,
                          }
                        : 0,
                    mb: 5,
                  }}
                >
                  {rowItems.map(item => (
                    <CourseCard
                      key={item.id}
                      courseOrder={item?.expand?.bookId?.displayOrder}
                      slug='reference'
                      item={{
                        idx: item.ordering,
                        title: item.article_title,
                        description: item.article_summary || '',
                      }}
                    />
                  ))}
                </Box>
              );
            }
            return rows;
          })()
        ) : (
          <Typography>即将推出</Typography>
        )}
      </Box>
    </Container>
  );
}
