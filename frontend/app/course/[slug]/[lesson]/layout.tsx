'use client';
import { useBreadcrumb } from '@/app/components/pc/AppBreadcrumbs';
import LessonMeta from '@/app/components/pc/LessonMeta';
import LessonSidebar from '@/app/components/pc/LessonSidebar';
import { getCourseTopicsByCourse, getCourseTopicById } from '@/app/api';
import { Box, Container } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

const LessonLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; lesson: string }>;
}) => {
  const { setExtraBreadcrumb } = useBreadcrumb();
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);
  const tab = segments[4]; // Adjusted for new route structure
  const [selected, setSelected] = useState(tab);
  const [currentTopic, setCurrentTopic] = useState<any>(null);
  const [courseTopics, setCourseTopics] = useState<any[]>([]);
  const resolvedParams = use(params);
  const courseId = resolvedParams.slug;
  const topicId = resolvedParams.lesson;

  // Load current topic and course topics
  useEffect(() => {
    const loadData = async () => {
      try {
        const [topic, topicsResult] = await Promise.all([
          getCourseTopicById(topicId),
          getCourseTopicsByCourse(courseId)
        ]);
        
        setCurrentTopic(topic);
        setCourseTopics(topicsResult.items);
      } catch (error) {
        // Handle error silently - user will see empty state
      }
    };

    loadData();
  }, [courseId, topicId]);

  useEffect(() => {
    if (currentTopic) {
      setExtraBreadcrumb({
        label: currentTopic.article_title || currentTopic.title,
      });
    }
  }, [currentTopic, setExtraBreadcrumb]);

  useEffect(() => {
    if (selected === undefined) return;

    const segments = pathname.split('/').filter(Boolean);

    if (selected === 'qa') {
      return router.replace(`/qa/${segments[1]}/${segments[2]}`);
    }

    const basePath = `/${segments.slice(0, 3).join('/')}/${selected}`;
    router.replace(basePath);
  }, [selected, pathname, router]);

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
          title={currentTopic?.article_title || currentTopic?.title || '课程'}
          tags={currentTopic?.tags ? currentTopic.tags.split(',').map((tag: string) => tag.trim()) : []}
          description={currentTopic?.article_introtext || currentTopic?.description || '课程描述'}
          author='作者：慈诚罗珠堪布'
          date={currentTopic?.created ? new Date(currentTopic.created).toLocaleDateString('zh-CN') : ''}
        />
        {children}
      </Box>
    </Container>
  );
};

export default LessonLayout;
