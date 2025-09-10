import { getCourseTopicById } from '@/app/api';
import { Box, Paper, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { TopicMedia } from '../../types/models';
import Article from '../shared/Article';
import ScrollTop from '../shared/ScrollTop';
import AudioPage from './AudioPage';
import ReadingContentWrapper from './ReadingContentWrapper';
import ReadingSidebar from './ReadingSidebar';

interface ReadingPageProps {
  topicMedia: TopicMedia[];
}

export default async function ReadingPage({ topicMedia }: ReadingPageProps) {
  const topic = await getCourseTopicById('m0e40evoc9p2c7z');

  if (!topic) {
    notFound();
  }

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
