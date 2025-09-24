import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import { HELPER_TEXT_COLOR } from '../../constants/colors';
import { CourseActionButton } from './';
import CornerBadge from './CornerBadge';

interface ReferenceCardProps {
  item: {
    idx: number;
    title: string;
    description: string;
  };
  slug: 'course' | 'qa' | 'reference';
  courseOrder?: number;
  questionOrder?: number;
}

export default function CourseCard({
  item,
  courseOrder,
  slug,
  questionOrder,
}: ReferenceCardProps) {
  const isQa = slug === 'qa';
  return (
    <Link
      href={`/${slug}/${courseOrder}/lesson${item.idx}${questionOrder ? `?tab=question${questionOrder}` : ''}`}
      sx={{
        textDecoration: 'none',
      }}
    >
      <Card
        sx={{
          borderRadius: '20px',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(131, 181, 247, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          px: 1,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pt: 2,
            pr: 7,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isQa ? 3 : 1,
            overflow: 'hidden',
            lineHeight: 1.5,
            textOverflow: 'ellipsis',
            fontWeight: 500,
            fontSize: isQa ? 16 : 20,
            minHeight: isQa ? 60 : 20,
          }}
        >
          {item.title?.replace(/(慧灯禅修课\d+ )|(｜慧灯禅修课问答)/, '')}
        </Typography>
        <CornerBadge content={isQa ? undefined : item.idx} />
        <CardContent
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: isQa ? 60 : 100,
            flex: 1,
            pb: isQa ? '16px !important' : '',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-start',
              overflow: 'hidden',
            }}
          >
            <Typography
              color={HELPER_TEXT_COLOR}
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: isQa ? 1 : 2,
                overflow: 'hidden',
                fontSize: 12,
                lineHeight: 1.5,
                textOverflow: 'ellipsis',
                wordBreak: 'break-word',
                width: '100%',
              }}
            >
              {item.description.replace(/<[^>]*>/g, '')}
            </Typography>
          </Box>
          <CourseActionButton>
            {isQa ? '观看视频' : '点击进入'}
          </CourseActionButton>
        </CardContent>
      </Card>
    </Link>
  );
}
