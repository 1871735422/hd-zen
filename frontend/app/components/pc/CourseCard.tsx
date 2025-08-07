import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import { HELPER_TEXT_COLOR } from '../../constants/colors';
import { CourseActionButton } from './';
import CornerBadge from './CornerBadge';

interface ReferenceCardProps {
  item: {
    id: number;
    title: string;
    description: string;
    isQa?: boolean;
  };
  topicId?: string;
  courseId?: string;
}

export default function CourseCard({
  item,
  topicId,
  courseId,
}: ReferenceCardProps) {
  return (
    <Link
      href={item.isQa ? `/qa/${item.id}` : `/course/${courseId}/${topicId}/lesson${item.id}`}
      sx={{
        textDecoration: 'none',
      }}
    >
      <Card
        sx={{
          borderRadius: '25px',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          px: 1,
          zoom: item.isQa ? 0.8 : 1,
        }}
      >
        <Typography
          variant='h6'
          sx={{
            p: 2,
            pb: 0,
            pl: 6, // 为徽章留出空间
            pt: 3, // 调整顶部间距
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          {item.title}
        </Typography>
        <CornerBadge content={item.isQa ? undefined : item.id} />
        <CardContent
          sx={{
            textAlign: 'left',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              height: '30.8px',
              overflow: 'hidden',
              pb: 2,
            }}
          >
            <Typography
              color={HELPER_TEXT_COLOR}
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                fontSize: 11,
                lineHeight: 1.4,
                textOverflow: 'ellipsis',
                wordBreak: 'break-word',
                height: '100%',
              }}
            >
              {item.description.replace(/<[^>]*>/g, '')}
            </Typography>
          </Box>
          <CourseActionButton>
            {item.isQa ? '观看视频' : '点击进入'}
          </CourseActionButton>
        </CardContent>
      </Card>
    </Link>
  );
}
