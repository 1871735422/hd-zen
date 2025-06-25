import { Box, Container } from '@mui/material';
import { pb } from '../api';
import BookCard from '../components/pc/BookCard';

async function CoursePage() {
  const { items: bookItems } = await pb.collection('courses').getList(1, 10);
  const siteFileUrl =
    process.env.NEXT_PUBLIC_SITE_URL + '/api/files/pbc_955655590';

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
        {bookItems.map((item, idx) => (
          <BookCard
            key={idx}
            idx={idx}
            title={item.title}
            description={item.description}
            cover={`${siteFileUrl}/${item.id}/${item.cover}?thumb=100x0`}
          />
        ))}
      </Box>
    </Container>
  );
}

export default CoursePage;
