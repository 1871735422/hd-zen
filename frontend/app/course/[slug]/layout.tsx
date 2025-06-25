import AppBreadcrumbs, {
  BreadcrumbProvider,
} from '@/app/components/pc/AppBreadcrumbs';
import CategorySelector from '@/app/components/pc/CategorySelector';
import { Container, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { pb } from '../../api';

export default async function CourseLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const { items: bookItems } = await pb.collection('courses').getList(1, 10);
  const categories = bookItems.map(item => item.title);

  const idx = parseInt(slug, 10);
  if (isNaN(idx) || idx < 1 || idx > categories.length) {
    notFound();
  }
  const selectedCategory = categories[idx - 1];

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '慧灯禅修课', href: '/course' },
    { label: selectedCategory, href: `/course/${slug}` },
  ];

  return (
    <BreadcrumbProvider>
      <Container
        maxWidth='lg'
        sx={{
          backgroundImage: 'url(/images/sun-bg@2x.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant='h1' fontWeight={600} fontSize={24} pt={5}>
          慧灯禅修课
        </Typography>
        <Typography variant='body1' color='rgba(127, 173, 235, 1)' p={2}>
          这里随便写一点，慧灯禅修课的简介，写的什么呢，就是。这里随便写一点，学修参考资料的简介
        </Typography>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
        />
        <AppBreadcrumbs items={breadcrumbItems} useContext={true} />
        {children}
      </Container>
    </BreadcrumbProvider>
  );
}
