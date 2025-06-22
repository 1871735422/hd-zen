'use client';

import AppBreadcrumbs from '@/app/components/pc/AppBreadcrumbs';
import CategorySelector from '@/app/components/pc/CategorySelector';
import CourseCard from '@/app/components/pc/CourseCard';
import Sidebar from '@/app/components/pc/Sidebar';
import { Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';

const sidebarItems = [
  { id: 1, title: '三个差别' },
  { id: 2, title: '三殊胜', subtitle: '——行善修心的究竟方法' },
  { id: 3, title: '生存的方式和生存的意义' },
  { id: 4, title: '佛教徒的生活模式' },
  { id: 5, title: '如何做一个标准居士' },
  { id: 6, title: '浅谈因果关系' },
  { id: 7, title: '佛法融入生活' },
  { id: 8, title: '佛教的定义' },
  { id: 9, title: '解脱的原理' },
  { id: 10, title: '对初学者的教诲' },
];
const categories = [
  '《大圆满前行引导文》',
  '《前行备忘录》',
  '《菩提道次第广论》',
  '《大圆满心性休息》',
  '《佛说稻秆经》',
];
export default function QaPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [activeSidebarItem, setActiveSidebarItem] = useState(
    sidebarItems[0].id
  );

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

  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

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
        onCategoryChange={handleCategoryChange}
      />
      <AppBreadcrumbs items={breadcrumbItems} />
      <Grid
        container
        spacing={4}
        sx={{ mt: 2, background: 'rgba(255, 255, 255, 0.7)', py: 2 }}
      >
        <Grid size={{ md: 3 }}>
          <Sidebar
            items={sidebarItems}
            activeItemId={activeSidebarItem}
            onItemClick={id => setActiveSidebarItem(id)}
          />
        </Grid>
        <Grid size={{ md: 9 }} p={2}>
          <Grid container spacing={2}>
            {cardItems.map(item => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CourseCard
                  item={{
                    ...item,
                    isQa: true,
                    description: `三个差别是佛法的基础知识。本课介绍了学佛三个目标的差别，即外教和佛教的差别、世间法和出世间法的差别… `,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
