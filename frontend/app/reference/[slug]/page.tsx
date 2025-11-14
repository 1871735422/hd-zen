import { getBookChapters } from '@/app/api';
import MobileCoursePage from '@/app/components/mobile/MobileCoursePage';
import CourseCard from '@/app/components/pc/CourseCard';
import { BookChapter } from '@/app/types/models';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Box, Container, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

// PC端参考资料页面组件
async function PCReferencePage({ books }: { books: BookChapter[] }) {
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
                        description:
                          item.article_summary || item.article_introtext || '',
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

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: bookOrder } = await params;

  if (Number(bookOrder) < 1) {
    notFound();
  }

  // 检测设备类型
  const deviceType = await getDeviceTypeFromHeaders();

  // 获取书籍章节数据
  const books = await getBookChapters(bookOrder);
  // console.log({ books });

  if (!books) {
    notFound();
  }

  // 根据设备类型返回对应的组件
  if (deviceType === 'mobile') {
    return (
      <MobileCoursePage
        courseTopics={books}
        courseOrder={bookOrder}
        courseType='reference'
      />
    );
  }

  return <PCReferencePage books={books} />;
}
