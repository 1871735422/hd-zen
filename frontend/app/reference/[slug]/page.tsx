import CategorySelector from '@/app/components/pc/CategorySelector';
import CourseCard from '@/app/components/pc/CourseCard';
import TitleBanner from '@/app/components/shared/TitleBanner';
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

  return (
    <Container maxWidth='lg'>
      <TitleBanner title='学修参考资料' />
      <Typography
        sx={{
          color: 'rgba(127, 173, 235, 1)',
          mt: -6,
          mb: 6,
          px: 2,
        }}
      >
        本栏目提供加行修法的必修资料：《大圆满前行引导文》
        <br />
        辅助参考资料：《前行备忘录》《菩提道次第广论》《稻杆经》《大圆满心性修息》
      </Typography>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
      />
      <Grid
        container
        spacing={4}
        sx={{
          mt: 6,
          mb: 16,
        }}
      >
        {cardItems.map(item => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              courseOrder={1}
              slug='reference'
              item={{
                idx: item.id,
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
