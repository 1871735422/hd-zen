import { getContentWaitingForUpdateText } from '@/app/api';
import { pxToVw } from '@/app/utils/mobileUtils';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { TopicMediaX } from '../../types/models';
import ScrollTop from '../shared/ScrollTop';
import AudioPage from './AudioPage';
import ReadingContentWrapper from './ReadingContentWrapper';
import ReadingModePage from './ReadingModePage';
import { ReadingModeProvider } from './ReadingModeProvider';
import ReadingSidebar from './ReadingSidebar';

interface ReadingPageProps {
  topicMediaX: TopicMediaX[];
  isReadingMode?: boolean;
}

export default async function ReadingPage({
  topicMediaX,
  isReadingMode = false,
}: ReadingPageProps) {
  const topicMedia = topicMediaX[0];
  const topicTags = topicMedia?.tags;
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';
  const hasContent =
    topicMedia?.article_fulltext || topicMedia?.article_introtext;
  if (!hasContent) {
    const hintText = await getContentWaitingForUpdateText();
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          {hintText || '此课程暂无文字内容'}
        </Typography>
      </Paper>
    );
  }
  // console.log('topicMedia', topicMedia?.article_fulltext.slice(-100));
  // 如果是阅读模式，渲染专门的阅读模式组件
  if (isReadingMode) {
    const tags = topicTags ? topicTags.map(tag => tag.trim()) : [];
    const content = `${topicMedia.article_introtext || ''}${topicMedia.article_fulltext || ''}`;

    return (
      <ReadingModePage
        title={topicMedia.article_title || topicMedia.title}
        tags={tags}
        summary={topicMedia.article_summary}
        author={topicMedia?.author || ''}
        date={
          topicMedia.created
            ? new Date(topicMedia.created).toLocaleDateString('zh-CN')
            : ''
        }
        content={content}
        articleId={topicMedia.id}
      />
    );
  }

  // 默认的普通阅读模式
  return (
    <ReadingModeProvider>
      {/* 阅读内容区域 */}
      <Box
        sx={{
          position: 'relative',
        }}
        data-reading-container
      >
        {(topicMedia?.url_mp3 ||
          topicMedia?.ct_url_mp3 ||
          topicMedia?.url_downpdf ||
          topicMedia?.url_downepub) && (
          <AudioPage topicMedia={topicMediaX} showTitle={false} />
        )}
        <ReadingSidebar />
        {/* 客户端增强功能 - 包含分页和全文模式 */}
        <Stack px={isMobile ? pxToVw(10) : 0}>
          <ReadingContentWrapper
            introText={topicMedia.article_introtext}
            fullText={topicMedia.article_fulltext}
            articleId={topicMedia.id}
            articleTitle={topicMedia.article_title || topicMedia.title}
          />
        </Stack>
      </Box>
      <ScrollTop />
    </ReadingModeProvider>
  );
}
