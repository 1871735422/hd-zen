import MobileLessonPage from '@/app/components/mobile/MobileLessonPage';
import AudioPage from '@/app/components/pc/AudioPage';
import MifaWarning from '@/app/components/pc/MifaWarning';
import ReadingPage from '@/app/components/pc/ReadingPage';
import VideoPage from '@/app/components/pc/VideoPage';
import { pxToVw } from '@/app/utils/mobileUtils';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';
import { getBookChapters, getBookMediaByOrder } from '../../../api';
import LessonMeta from '../../../components/pc/LessonMeta';
import LessonSidebar from '../../../components/pc/LessonSidebar';
import { BookChapter, SecretText } from '../../../types/models';

// 15分钟缓存
export const revalidate = 900;

// 生成静态参数 - 嵌套动态路由必须预生成
export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [];

  try {
    const allParams: { slug: string; lesson: string }[] = [];
    // 获取所有书籍的章节数据
    // 假设书籍的 displayOrder 从 1 开始，最多到 10
    for (let bookOrder = 1; bookOrder <= 10; bookOrder++) {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        const chapters = (await Promise.race([
          getBookChapters(bookOrder.toString()),
          timeout,
        ])) as BookChapter[];

        for (const chapter of chapters) {
          allParams.push({
            slug: bookOrder.toString(),
            lesson: `lesson${chapter.ordering}`,
          });
        }
      } catch {
        // 如果获取失败，至少添加一个默认参数
        allParams.push({
          slug: bookOrder.toString(),
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
  const bookOrder = resolvedParams.slug;
  const chapterOrder = resolvedParams.lesson?.replace('lesson', '');

  // 获取书籍章节信息
  const chapters = await getBookChapters(bookOrder, chapterOrder);
  const chapter = chapters.find(
    c => `lesson${c.ordering}` === resolvedParams.lesson
  );

  const bookMedia = await getBookMediaByOrder(bookOrder, chapterOrder);
  // console.log('bookMedia', bookMedia);
  const media = bookMedia?.[0];

  if (!chapter || !media) return;

  const url = `/reference/${bookOrder}/lesson${chapterOrder}`;
  const title = `${media.title || chapter.article_title || '参考资料'} | 慧灯禅修`;
  const description =
    media.article_summary ||
    media.article_introtext ||
    chapter.article_title ||
    '慧灯禅修参考资料';

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
      authors: [media.author ?? '作者：慈诚罗珠堪布'],
    },
  };
}

interface refPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const refPage = async ({ params, searchParams }: refPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  let { tab: selectedKey } = resolvedSearchParams as {
    tab?: keyof SecretText;
  };

  const bookOrder = resolvedParams.slug;
  const chapterOrder = resolvedParams.lesson?.replace('lesson', '');
  const bookMedia = await getBookMediaByOrder(bookOrder, chapterOrder);
  // 设备检测
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';
  // console.log('bookMedia', bookMedia);

  if (!bookMedia) {
    notFound();
  }
  const media = bookMedia[0];
  const bookTags = media?.tags;
  const excludeLabels = ['问答'];
  // console.log(media);

  if (!media?.url_mp3) {
    excludeLabels.push('音频');
  }

  if (!media?.article_summary && !media?.article_fulltext) {
    excludeLabels.push('文字');
  }

  if (!media?.url_sd && !media?.url_hd) {
    excludeLabels.push('视频');
  }
  const hasSecretWarn = media?.secret_level !== null;

  const TabRender = () => {
    if (
      selectedKey === 'audio' ||
      (!selectedKey && excludeLabels?.includes('视频') && media?.url_mp3)
    )
      return <AudioPage topicMedia={bookMedia} />;
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
        <ReadingPage topicMediaX={bookMedia} isReadingMode={isReadingMode} />
      );
    }
    return <VideoPage topicMedia={bookMedia} />;
  };

  // 移动端渲染
  if (isMobile) {
    return (
      <MobileLessonPage
        hasSiderbar={excludeLabels.length <= 3}
        title={media?.article_title || media?.title || ''}
        author={bookMedia[0]?.author || '作者：慈诚罗珠堪布'}
        date={media?.created || ''}
        description={
          selectedKey === 'article'
            ? bookMedia[0]?.article_summary || bookMedia[0]?.media_summary || ''
            : bookMedia[0]?.media_summary
        }
        courseOrder={bookOrder}
        lessonOrder={chapterOrder}
        mp3Url={selectedKey === 'audio' ? media?.url_downmp3 : undefined}
        pdfUrl={selectedKey === 'article' ? media?.url_downpdf : undefined}
        epubUrl={selectedKey === 'article' ? media?.url_downepub : undefined}
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
        title={bookMedia[0]?.article_title}
        tags={bookTags?.length ? bookTags.map((tag: string) => tag.trim()) : []}
        description={
          selectedKey === 'article'
            ? bookMedia[0]?.article_summary || bookMedia[0]?.media_summary || ''
            : bookMedia[0]?.media_summary
        }
        author={bookMedia[0]?.author || '作者：慈诚罗珠堪布'}
        date={bookMedia[0]?.created}
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
        path={`/reference/${bookOrder}/lesson${chapterOrder}`}
      />
      <Box
        sx={{
          backgroundColor: 'white',
          ml: { lg: '50px', xl: '66px' },
          pl: 14,
          pr: 18,
          display: 'flex',
          flexDirection: 'column',
          pb: 5,
          borderRadius: 5,
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

export default refPage;
