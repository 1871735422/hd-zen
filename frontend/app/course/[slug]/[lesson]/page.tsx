import MobileLessonPage from '@/app/components/mobile/MobileLessonPage';
import AudioPage from '@/app/components/pc/AudioPage';
import MifaWarning from '@/app/components/pc/MifaWarning';
import ReadingPage from '@/app/components/pc/ReadingPage';
import VideoPage from '@/app/components/pc/VideoPage';
import { shouldShowEbookDownload } from '@/app/utils/courseUtils';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';
import {
  getCourses,
  getCourseTopicsByCourse,
  getTopicMediaByOrder,
} from '../../../api';
import LessonMeta from '../../../components/pc/LessonMeta';
import LessonSidebar from '../../../components/pc/LessonSidebar';
import { CourseTopic, SecretText } from '../../../types/models';
import { getDeviceTypeFromHeaders } from '../../../utils/serverDeviceUtils';

// 15分钟缓存
export const revalidate = 900;

// 生成静态参数 - 嵌套动态路由必须预生成
export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [];

  try {
    const { items: courses } = await getCourses();
    const allParams: { slug: string; lesson: string }[] = [];

    for (const course of courses) {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        const { items: topics } = (await Promise.race([
          getCourseTopicsByCourse(course.id),
          timeout,
        ])) as { items: CourseTopic[] };

        for (const topic of topics) {
          allParams.push({
            slug: course.displayOrder.toString(),
            lesson: `lesson${topic.ordering}`,
          });
        }
      } catch {
        allParams.push({
          slug: course.displayOrder.toString(),
          lesson: 'lesson1',
        });
      }
    }
    return allParams;
  } catch {
    return [];
  }
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}): Promise<Metadata | undefined> {
  const resolvedParams = await params;
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson?.replace('lesson', '');

  // 获取课程和课题信息
  const { items: courses } = await getCourses();
  const course = courses.find(c => c.displayOrder.toString() === courseOrder);

  const { items: topics } = (await getCourseTopicsByCourse(
    course?.id ?? ''
  )) || { items: [] };
  const topic = topics.find(
    t => `lesson${t.ordering}` === resolvedParams.lesson
  );

  const topicMedia = await getTopicMediaByOrder(courseOrder, lessonOrder);
  const media = topicMedia?.[0];

  if (!course || !topic || !media) return;

  const url = `/course/${courseOrder}/lesson${lessonOrder}`;
  const title = `${topic.title || media.title}`;
  const description =
    media.article_summary ||
    media.article_introtext ||
    topic.title ||
    course.title;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: media.created,
      authors: [media.author ?? ''],
    },
  };
}
interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LessonPage = async ({ params, searchParams }: LessonPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams =
    (await (searchParams ?? Promise.resolve({}))) ?? {};
  let { tab: selectedKey } = resolvedSearchParams as {
    tab?: keyof SecretText;
  };
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson?.replace('lesson', '');

  // 设备检测
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  // 总是需要获取 topicMedia 数据
  const topicMedia = await getTopicMediaByOrder(courseOrder, lessonOrder);
  // console.log('topicMedia', topicMedia);

  if (!topicMedia) {
    notFound();
  }
  const media = topicMedia[0];
  const topicTags = media?.tags;
  const excludeLabels: string[] = [];
  if (!media?.hasQa) {
    excludeLabels.push('问答');
  }
  if (!topicMedia.some(x => x?.url_hd) && !topicMedia.some(x => x?.url_sd)) {
    excludeLabels.push('视频');
  }
  if (!topicMedia.some(x => x?.url_mp3)) {
    excludeLabels.push('音频');
  }
  if (
    !topicMedia.some(x => x?.article_fulltext) &&
    !topicMedia.some(x => x?.article_introtext)
  ) {
    excludeLabels.push('文字');
  }

  const hasSecretWarn = media?.secret_level !== null;
  const description =
    selectedKey === 'article' ||
    (excludeLabels?.includes('视频') && excludeLabels?.includes('音频'))
      ? topicMedia[0]?.article_summary || topicMedia[0]?.media_summary || ''
      : topicMedia[0]?.media_summary || topicMedia[0]?.article_summary;

  const showEbookDownload = shouldShowEbookDownload(selectedKey, excludeLabels);

  // console.log(!selectedKey, excludeLabels?.includes('视频'), media?.url_mp3);
  const TabRender = () => {
    if (
      selectedKey === 'audio' ||
      (!selectedKey && excludeLabels?.includes('视频') && media?.url_mp3)
    ) {
      selectedKey = 'audio';
      return <AudioPage topicMedia={topicMedia} />;
    }

    if (
      selectedKey === 'article' ||
      (excludeLabels?.includes('视频') && !media?.mp3_duration)
    ) {
      selectedKey = 'article';
      const resolvedSearchParamsTyped = resolvedSearchParams as {
        [key: string]: string | string[] | undefined;
      };
      const isReadingMode = resolvedSearchParamsTyped.readingMode === 'true';
      return (
        <ReadingPage topicMediaX={topicMedia} isReadingMode={isReadingMode} />
      );
    }

    return <VideoPage topicMedia={topicMedia} />;
  };

  // 移动端渲染
  if (isMobile) {
    return (
      <MobileLessonPage
        hasSiderbar={excludeLabels.length < 3}
        title={topicMedia[0]?.article_title}
        author={topicMedia[0]?.author || '慈诚罗珠堪布'}
        date={media?.created || ''}
        description={description}
        courseOrder={courseOrder}
        lessonOrder={lessonOrder}
        pdfUrl={showEbookDownload ? media?.url_downpdf : undefined}
        epubUrl={showEbookDownload ? media?.url_downepub : undefined}
        excludeLabels={excludeLabels}
      >
        <Box
          sx={{
            px: pxToVw(15),
          }}
        >
          {hasSecretWarn && media.secret_level ? (
            <MifaWarning
              article_title={media.article_title}
              secret_level={media.secret_level[selectedKey ?? 'video']}
            >
              <TabRender />
            </MifaWarning>
          ) : (
            <TabRender />
          )}
        </Box>
      </MobileLessonPage>
    );
  }
  const PageContent = () => (
    <>
      <LessonMeta
        title={topicMedia[0]?.article_title}
        tags={
          topicTags?.length ? topicTags.map((tag: string) => tag.trim()) : []
        }
        description={description}
        author={topicMedia[0]?.author || '慈诚罗珠堪布'}
        date={topicMedia[0]?.created}
      />
      <TabRender />
    </>
  );

  // PC端渲染
  return (
    <>
      <LessonSidebar
        excludeLabels={excludeLabels}
        selectedKey={selectedKey?.toString()}
        path={`/course/${courseOrder}/lesson${lessonOrder}`}
      />

      <Box
        sx={{
          backgroundColor: 'white',
          ml: { lg: '50px', xl: '66px' },
          pl: { lg: 14, xl: selectedKey ? 18 : 21 },
          pr: { lg: 18, xl: selectedKey ? 24 : 26 },
          display: 'flex',
          flexDirection: 'column',
          pb: 5,
          borderRadius: '25px',
        }}
      >
        {hasSecretWarn && media.secret_level ? (
          <MifaWarning
            article_title={media.article_title}
            secret_level={media.secret_level[selectedKey ?? 'video']}
          >
            <PageContent />
          </MifaWarning>
        ) : (
          <PageContent />
        )}
      </Box>
    </>
  );
};

export default LessonPage;
