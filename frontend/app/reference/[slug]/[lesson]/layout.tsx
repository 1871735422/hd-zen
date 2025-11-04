import AppBreadcrumbs, {
  BreadcrumbProvider,
} from '@/app/components/shared/AppBreadcrumbs';
import { Box, Container } from '@mui/material';
import { getBookChapters, getCategories } from '../../../api';

const LessonLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; lesson: string }>;
}) => {
  const resolvedParams = await params;
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson.replace('lesson', '');
  // console.log({courseOrder,lessonOrder});
  const bookChapters = await getBookChapters(courseOrder, lessonOrder);
  const lessonCrumbLabel = bookChapters[0]?.article_title ?? '';
  const menuData = await getCategories('学修参考资料');
  const courseName =
    menuData[0]?.subMenu?.find(item => item.slug === courseOrder)?.name ?? '';

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '学修参考资料', href: '/reference' },
    { label: courseName, href: `/reference/${courseOrder}` },
    {
      label: lessonCrumbLabel,
      href: `/reference/${courseOrder}/lesson${lessonOrder}`,
    },
  ];

  return (
    <BreadcrumbProvider>
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 !important',
          ml: 0,
        }}
      >
        <AppBreadcrumbs items={breadcrumbItems} useContext={true} />
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pb: 5,
            mb: 5,
            borderRadius: 5,
          }}
        >
          {children}
        </Box>
      </Container>
    </BreadcrumbProvider>
  );
};

export default LessonLayout;
