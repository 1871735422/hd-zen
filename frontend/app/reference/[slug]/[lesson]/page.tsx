import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { getBookChapters } from '../../../api';
import LessonMeta from '../../../components/pc/LessonMeta';
import LessonSidebar from '../../../components/pc/LessonSidebar';

// 15分钟缓存
export const revalidate = 900;

// 生成静态参数 - 嵌套动态路由必须预生成

interface refPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const refPage = async ({ params, searchParams }: refPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { tab: selectedKey } = resolvedSearchParams;
  const bookOrder = resolvedParams.slug;
  const chapterOrder = resolvedParams.lesson?.replace('lesson', '');
  const bookMedia = await getBookChapters(bookOrder, chapterOrder);

  console.log('bookMedia', bookMedia);

  if (!bookMedia) {
    notFound();
  }
  const media = bookMedia[0];
  const bookTags = media?.tags;
  const excludeLabels = ['视频', '问答'];

  if (!media?.url_audio) {
    excludeLabels.push('音频');
  }
  if (!media?.article_introtext && media?.article_fulltext) {
    excludeLabels.push('文字');
  }

  const TabRender = () => {
    // if (selectedKey === 'article' || !media?.url_audio) {
    //   const isReadingMode = resolvedSearchParams.readingMode === 'true';
    //   return <ReadingPage topicMediaX={media} isReadingMode={isReadingMode} />;
    // }

    // // 默认视频 tab 组件
    // const downloadUrls = bookMedia
    //   .map(media => media?.url_downmp4)
    //   .filter(url => url !== undefined);

    return (
      <>
        {/* <MediaDownloadButton
          sx={{
            alignSelf: 'flex-end',
            my: -4,
          }}
          mediaType='video'
          downloadUrls={downloadUrls}
        /> */}
        {/* {bookMedia.map(media => (
          <Fragment key={media.id}>
            {media?.url_hd ? (
              <VideoPlayer
                poster={media?.url_image || media?.image1_url || ''}
                title={media?.title || ''}
                sources={[
                  {
                    src: media?.url_hd,
                    quality: 'HD',
                    label: '高清',
                  },
                  {
                    src: media?.url_sd || media?.url_hd,
                    quality: 'SD',
                    label: '标清',
                  },
                ]}
              />
            ) : (
              <Typography>视频资源不可用：{media?.title} </Typography>
            )}
          </Fragment>
        ))} */}
      </>
    );
  };

  return (
    <>
      <LessonSidebar
        excludeLabels={excludeLabels}
        selectedKey={selectedKey?.toString()}
        path={`/course/${bookOrder}/lesson${chapterOrder}`}
      />
      <Box
        sx={{
          backgroundColor: 'white',
          ml: '5%',
          pl: 14,
          pr: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 5,
          borderRadius: 5,
        }}
      >
        <LessonMeta
          title={bookMedia[0]?.title}
          tags={
            bookTags?.length ? bookTags.map((tag: string) => tag.trim()) : []
          }
          description={bookMedia[0]?.article_summary ?? ''}
          author='作者：慈诚罗珠堪布'
          date={bookMedia[0]?.created}
        />
        <TabRender />
      </Box>
    </>
  );
};

export default refPage;
