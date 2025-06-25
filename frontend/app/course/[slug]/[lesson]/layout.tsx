'use client';
import { useBreadcrumb } from '@/app/components/pc/AppBreadcrumbs';
import LessonMeta from '@/app/components/pc/LessonMeta';
import LessonSidebar from '@/app/components/pc/LessonSidebar';
import { lessonItems } from '@/app/constants';
import { Box, Container } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

const LessonLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lesson: string }>;
}) => {
  const { setExtraBreadcrumb } = useBreadcrumb();
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);
  const tab = segments[3];
  const [selected, setSelected] = useState(tab);
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.lesson.replace('lesson', ''));
  const lessonTitle =
    lessonItems.find(item => item.id === lessonId)?.title || '';

  useEffect(() => {
    setExtraBreadcrumb({
      label: lessonTitle,
    });
  }, [lessonTitle]);

  useEffect(() => {
    if (selected === undefined) return;

    const segments = pathname.split('/').filter(Boolean);

    if (selected === 'qa') {
      return router.replace(`/qa/${segments[1]}/${segments[2]}`);
    }

    const basePath = `/${segments.slice(0, 3).join('/')}/${selected}`;
    router.replace(basePath);
  }, [selected]);

  return (
    <Container
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        p: '0 0 0 60px !important',
      }}
    >
      <LessonSidebar selected={selected} onSelect={setSelected} />
      <Box
        sx={{
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          px: '120px',
          pt: 2,
          pb: 5,
          mb: 5,
          borderRadius: 5,
        }}
      >
        <LessonMeta
          title={lessonTitle}
          tags={['tag1', 'tag2']}
          description='Lesson description goes here.'
          author='作者：慈诚罗珠堪布'
          date={'2016年5月01日'}
        />
        {children}
      </Box>
    </Container>
  );
};

export default LessonLayout;
