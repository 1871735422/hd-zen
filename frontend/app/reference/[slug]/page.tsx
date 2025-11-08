import { getBookChapters, getCategories } from '@/app/api';
import MobileCoursePage from '@/app/components/mobile/MobileCoursePage';
import MobileReferencePage from '@/app/components/mobile/MobileReferencePage';
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
  if (!books) {
    notFound();
  }

  // 根据设备类型返回对应的组件
  if (deviceType === 'mobile') {
    if (books.length === 0) {
      // 如果没有章节数据，返回参考资料首页
      const menuData = await getCategories('学修参考资料');
      const subMenu = menuData[0]?.subMenu || [];
      const categories = subMenu.map(item => ({
        id: parseInt(item.slug, 10),
        name: item.name,
        displayOrder: parseInt(item.slug, 10),
      }));
      return <MobileReferencePage categories={categories} />;
    }

    // 获取书籍名称
    const menuData = await getCategories('学修参考资料');
    const subMenu = menuData[0]?.subMenu || [];
    const currentBook = subMenu.find(item => item.slug === bookOrder);
    const bookName = currentBook?.name || '参考资料';

    // 转换章节数据格式，使用唯一的key
    const chapters = books.map((book, index) => ({
      id: parseInt(book.id, 10),
      title: book.article_title,
      displayOrder: book.ordering || index + 1, // 如果ordering为空，使用index+1
    }));

    return (
      <MobileCoursePage
        bookName={bookName}
        chapters={chapters}
        bookOrder={bookOrder}
      />
    );
  }

  return <PCReferencePage books={books} />;
}
