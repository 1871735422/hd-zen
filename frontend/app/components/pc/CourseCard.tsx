import { Box, Card, CardContent, Typography } from '@mui/material';
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
    <Card
      href={`/${slug}/${courseOrder}/lesson${item.idx}${questionOrder ? `?tab=question${questionOrder}` : ''}`}
      component={'a'}
      sx={{
        borderRadius: { lg: '20px', xl: '25px' },
        position: 'relative',
        boxShadow: '0 4px 20px rgba(131, 181, 247, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        px: { lg: 1, xl: 3 },
        pt: { lg: 1, xl: 3 },
      }}
    >
      <Typography
        sx={{
          pl: 2,
          pr: isQa ? 4.5 : 7,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isQa ? 3 : 1,
          overflow: 'hidden',
          lineHeight: 1.5,
          textOverflow: 'ellipsis',
          fontWeight: 500,
          fontSize: isQa ? { lg: 16, xl: 20 } : { lg: 20, xl: 24 },
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
              fontSize: { lg: 12, xl: 14 },
              lineHeight: '23px',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              width: '100%',
              mb: 3,
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
  );
}
