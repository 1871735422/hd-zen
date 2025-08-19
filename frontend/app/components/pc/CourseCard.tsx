import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import { HELPER_TEXT_COLOR } from '../../constants/colors';
import { CourseActionButton } from './';
import CornerBadge from './CornerBadge';

interface ReferenceCardProps {
  item: {
    idx: number;
    title: string;
    description: string;
    isQa?: boolean;
  };
  topicId:string;
  courseOrder?: string;
}

export default function CourseCard({
  item,
  courseOrder,
  topicId
}: ReferenceCardProps) {

  return (
    <Link
      href={item.isQa ? `/qa/${item.idx}` : `/course/${courseOrder}/${topicId}`}
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
            px: 2,
            pt: 3,
            fontSize: 18,
            fontWeight: 500,
            minHeight: 60,
          }}
        >
          {item.title}
        </Typography>
        <CornerBadge content={item.isQa ? undefined : item.idx} />
        <CardContent
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            pt:0
          }}
        >
          <Box
            sx={{
              height: 30,
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
                lineHeight: 1.5,
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
