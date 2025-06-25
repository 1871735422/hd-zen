import AppBreadcrumbs from '@/app/components/pc/AppBreadcrumbs';
import CategorySelector from '@/app/components/pc/CategorySelector';
import CourseCard from '@/app/components/pc/CourseCard';
import { Container, Grid, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

const categories = [
  '《大圆满前行引导文》',
  '《前行备忘录》',
  '《菩提道次第广论》',
  '《大圆满心性休息》',
  '《佛说稻秆经》',
];

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = parseInt(slug, 10);
  if (isNaN(idx) || idx < 1 || idx > categories.length) {
    notFound();
  }
  const selectedCategory = categories[idx - 1];

  const cardItems = [
    { id: 1, title: '介绍慧灯禅修' },
    { id: 2, title: '入坐与出坐' },
    { id: 3, title: '人身难得' },
    { id: 4, title: '寿命无常' },
    { id: 5, title: '轮回过患' },
    { id: 6, title: '因果不虚' },
    { id: 7, title: '解脱利益与依止上师' },
    { id: 8, title: '如何学密' },
    { id: 9, title: '金刚上师与灌顶' },
    { id: 10, title: '前行念诵仪轨 · 开显解脱道' },
  ];

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '学修参考资料', href: '/reference' },
    { label: selectedCategory },
  ];

  return (
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
        学修参考资料
      </Typography>
      <Typography variant='body1' color='rgba(127, 173, 235, 1)' p={2}>
        这里随便写一点，学修参考资料的简介，写的什么呢，就是。这里随便写一点，学修参考资料的简介
      </Typography>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
      />
      <AppBreadcrumbs items={breadcrumbItems} />
      <Grid container spacing={4}>
        {cardItems.map(item => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              item={{
                id: item.id,
                title: item.title,
                description: `三个差别是佛法的基础知识。本课介绍了学佛三个目标的差别，即外教和佛教的差别、世间法和出世间法的差别… `,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
