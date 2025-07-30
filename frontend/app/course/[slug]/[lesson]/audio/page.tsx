import { getCourseTopicById } from '@/app/api';
import { Box, Typography, Paper } from '@mui/material';
import { notFound } from 'next/navigation';

interface AudioPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

export default async function AudioPage({ params }: AudioPageProps) {
  const resolvedParams = await params;
  const topicId = resolvedParams.lesson;

  const topic = await getCourseTopicById(topicId);

  if (!topic) {
    notFound();
  }

  const audioUrl = topic.url_mp3;

  if (!audioUrl) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          此课程暂无音频内容
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' sx={{ mb: 3, fontWeight: 'bold' }}>
        {topic.article_title || topic.title}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <audio 
          controls 
          style={{ width: '100%' }}
          preload="metadata"
        >
          <source src={audioUrl} type="audio/mpeg" />
          <Typography color='error'>
            您的浏览器不支持音频播放。
          </Typography>
        </audio>
      </Paper>

      {topic.article_summary && (
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            内容简介
          </Typography>
          <Typography variant='body1' sx={{ lineHeight: 1.8 }}>
            {topic.article_summary}
          </Typography>
        </Paper>
      )}

      {/* Download links if available */}
      {(topic.url_downmp3 || topic.url_downpdf) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            下载资源
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
                  📥 下载音频 {topic.url_mp3size && `(${topic.url_mp3size})`}
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
