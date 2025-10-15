import { clearCourseTitle } from '@/app/utils/courseUtils';
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
        width: isQa ? { lg: 255, xl: 308 } : { lg: 362, xl: 437 },
        height: isQa ? { lg: 174, xl: 210 } : { lg: 177, xl: 214 },
        borderRadius: { lg: '20px', xl: '25px' },
        position: 'relative',
        boxShadow: '0 4px 20px rgba(131, 181, 247, 0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: isQa ? 60 : 100,
          flex: 1,
          px: isQa ? { lg: 1, xl: 3 } : { lg: 2, xl: 5 },
          pt: { lg: 1, xl: 3 },
          pb: isQa ? '16px !important' : '',
        }}
      >
        <Typography
          sx={{
            mb: { lg: 1, xl: 1.5 },
            pr: isQa ? 4.5 : 7,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isQa ? 3 : 1,
            overflow: 'hidden',
            lineHeight: 1.5,
            textOverflow: 'ellipsis',
            fontWeight: 600,
            fontSize: isQa ? { lg: 16, xl: 18 } : { lg: 20, xl: 24 },
            minHeight: isQa ? 60 : 20,
          }}
        >
          {clearCourseTitle(item.title)}
        </Typography>
        <CornerBadge content={isQa ? undefined : item.idx} />
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
      </CardContent>
      <CourseActionButton
        sx={{
          m: '0 auto',
          mb: isQa ? { lg: 1.4, xl: 1.7 } : { lg: '22px', xl: '27px' },
          width: isQa ? { lg: 227, xl: 274 } : { lg: 282, xl: 340 },
        }}
      >
        {isQa ? '观看视频' : '点击进入'}
      </CourseActionButton>
    </Card>
  );
}
