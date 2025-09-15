import { Box, Paper, Typography } from '@mui/material';
import { CourseTopic, TopicMedia } from '../../types/models';
import Article from '../shared/Article';
import ScrollTop from '../shared/ScrollTop';
import AudioPage from './AudioPage';
import ReadingContentWrapper from './ReadingContentWrapper';
import ReadingModePage from './ReadingModePage';
import ReadingSidebar from './ReadingSidebar';

interface ReadingPageProps {
  topic: CourseTopic;
  topicMedia: TopicMedia[];
  isReadingMode?: boolean;
}

export default async function ReadingPage({
  topic,
  topicMedia,
  isReadingMode = false,
}: ReadingPageProps) {
  const topicTags = topicMedia[0]?.media?.tags;

  const hasContent = topic.article_fulltext || topic.article_introtext;

  if (!hasContent) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          此课程暂无文字内容
        </Typography>
      </Paper>
    );
  }

  // 如果是阅读模式，渲染专门的阅读模式组件
  if (isReadingMode) {
    const tags = topicTags ? topicTags.map(tag => tag.trim()) : [];
    const content = `${topic.article_introtext || ''}${topic.article_fulltext || ''}`;

    return (
      <ReadingModePage
        title={topic.article_title || topic.title}
        tags={tags}
        summary={topic.article_summary}
        author='慈诚罗珠堪布'
        date={
          topic.created
            ? new Date(topic.created).toLocaleDateString('zh-CN')
            : ''
        }
        content={content}
      />
    );
  }

  // 默认的普通阅读模式
  return (
    <Box>
      <AudioPage topicMedia={topicMedia} courseTopic={topic} />

      {/* 服务端渲染的完整内容 - SEO 友好 */}
      <Box sx={{ position: 'relative' }} data-reading-container>
        <ReadingSidebar />

        {/* 默认显示完整内容 */}
        {topic.article_introtext && (
          <Typography
            className='reading-content'
            variant='body1'
            sx={{
              lineHeight: 1.8,
              color: 'rgba(68, 68, 68, 1)',
              mb: 5,
            }}
          >
            {topic.article_introtext}
          </Typography>
        )}
        {topic.article_fulltext && <Article html={topic.article_fulltext} />}

        {/* 客户端增强功能 */}
        <ReadingContentWrapper
          introText={topic.article_introtext}
          fullText={topic.article_fulltext}
        />
      </Box>

      <ScrollTop />
    </Box>
  );
}
