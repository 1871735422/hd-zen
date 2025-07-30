import { getCourseTopicById } from '@/app/api';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { notFound } from 'next/navigation';

interface ReadingPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

export default async function ReadingPage({ params }: ReadingPageProps) {
  const resolvedParams = await params;
  const topicId = resolvedParams.lesson;

  const topic = await getCourseTopicById(topicId);

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
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        {topic.article_title || topic.title}
      </Typography>

      {topic.article_introtext && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
          <Typography variant='h6' sx={{ mb: 2, color: '#1976d2' }}>
            课程简介
          </Typography>
          <Typography 
            variant='body1' 
            sx={{ 
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: '#333'
            }}
          >
            {topic.article_introtext}
          </Typography>
        </Paper>
      )}

      {topic.article_fulltext && (
        <Paper sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ mb: 3, color: '#1976d2' }}>
            课程内容
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography 
            variant='body1' 
            sx={{ 
              lineHeight: 2,
              fontSize: '1rem',
              color: '#444',
              whiteSpace: 'pre-line' // Preserve line breaks
            }}
          >
            {topic.article_fulltext}
          </Typography>
        </Paper>
      )}

      {topic.article_summary && topic.article_summary !== topic.article_introtext && (
        <Paper sx={{ p: 3, mt: 3, bgcolor: '#fff3e0' }}>
          <Typography variant='h6' sx={{ mb: 2, color: '#f57c00' }}>
            内容总结
          </Typography>
          <Typography 
            variant='body1' 
            sx={{ 
              lineHeight: 1.8,
              fontSize: '1rem',
              color: '#333'
            }}
          >
            {topic.article_summary}
          </Typography>
        </Paper>
      )}

      {/* Tags */}
      {topic.tags && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            相关标签
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {topic.tags.split(',').map((tag, index) => (
              <Box
                key={index}
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                }}
              >
                {tag.trim()}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Download links if available */}
      {(topic.url_downmp3 || topic.url_downpdf) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            相关下载
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {topic.url_downmp3 && (
              <Box>
                <a 
                  href={topic.url_downmp3} 
                  download
                  style={{ 
                    textDecoration: 'none',
                    color: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🎵 下载音频 {topic.url_mp3size && `(${topic.url_mp3size})`}
                </a>
              </Box>
            )}
            {topic.url_downpdf && (
              <Box>
                <a 
                  href={topic.url_downpdf} 
                  download
                  style={{ 
                    textDecoration: 'none',
                    color: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📄 下载PDF {topic.url_pdfsize && `(${topic.url_pdfsize})`}
                </a>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
