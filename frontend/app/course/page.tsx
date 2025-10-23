import { Box, Container } from '@mui/material';
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
        flexGrow: 1,
        display: 'flex',
        inset: 0,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        mx: 0,
        pt: { sm: 3, md: 4, lg: 6, xl: 8, xxl: 10 },
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/course-bg.webp)',
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
      <Box
        sx={{
          width: { sm: 600, md: 800, lg: 1000, xl: 1300, xxl: 1600 },
          position: 'relative',
          zIndex: 2,
          mt: { sm: 1, md: 1.5, lg: 0, xl: 1.5, xxl: 2 },
        }}
      >
        {(() => {
          const rows = [];
          const itemsPerRow = 3; // 每行3个卡片

          for (let i = 0; i < courses.length; i += itemsPerRow) {
            const rowItems = courses.slice(i, i + itemsPerRow);
            rows.push(
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent:
                    rowItems.length === itemsPerRow
                      ? 'space-between'
                      : 'flex-start',
                  gap:
                    rowItems.length < itemsPerRow
                      ? { sm: 2, md: 3, lg: 5, xl: 6, xxl: 7 }
                      : 0,
                  mb: { sm: 2, md: 3, lg: 5, xl: 6, xxl: 7 },
                  px: { sm: 2, md: 3, lg: 14, xl: 15, xxl: 18 },
                }}
              >
                {rowItems.map((course, idx) => (
                  <BookCard
                    key={course.id}
                    idx={i + idx}
                    title={course.title}
                    description={course.description || ''}
                  />
                ))}
              </Box>
            );
          }
          return rows;
        })()}
      </Box>
    </Container>
  );
}

export default CoursePage;
