import { clearCourseTitle } from '@/app/utils/courseUtils';
import { Card, CardContent, Typography } from '@mui/material';
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
        width: isQa
          ? { lg: 206, xl: 308, xxl: 350 }
          : { lg: 330, xl: 437, xxl: 480 },
        height: isQa
          ? { lg: 140, xl: 210, xxl: 240 }
          : { lg: 170, xl: 214, xxl: 250 },
        borderRadius: { lg: '20px', xl: '25px', xxl: '30px' },
        position: 'relative',
        boxShadow: '0 4px 20px rgba(131, 181, 247, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        color: '#444',
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
          px: isQa ? { lg: 2, xl: 3, xxl: 4 } : { lg: 3.3, xl: 5, xxl: 6 },
          pt: { lg: 2, xl: 3, xxl: 4 },
          pb: isQa ? '16px !important' : 0,
        }}
      >
        <Typography
          sx={{
            pr: isQa ? 4.5 : 7,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isQa ? 3 : 1,
            overflow: 'hidden',
            lineHeight: 1.5,
            textOverflow: 'ellipsis',
            fontWeight: { lg: 500, xl: 600, xxl: 600 },
            fontSize: isQa
              ? { lg: 12, xl: 18, xxl: 20 }
              : { lg: 20, xl: 24, xxl: 26 },
            minHeight: isQa ? 60 : 20,
          }}
        >
          {clearCourseTitle(item.title)}
        </Typography>
        <CornerBadge content={isQa ? undefined : item.idx} />

        <Typography
          color={HELPER_TEXT_COLOR}
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isQa ? 1 : 2,
            overflow: 'hidden',
            fontSize: { lg: 12, xl: 14, xxl: 16 },
            lineHeight: { lg: 1.7, xl: '23px', xxl: '27px' },
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            width: '100%',
            my: { lg: 1.75, xl: 2.65, xxl: 3 },
          }}
        >
          {item.description.replace(/<[^>]*>/g, '')}
        </Typography>
      </CardContent>
      <CourseActionButton
        sx={{
          m: '0 auto',
          mb: isQa
            ? { lg: 1.1, xl: 1.7, xxl: 2 }
            : { lg: '18px', xl: '27px', xxl: '32px' },
          width: isQa
            ? { lg: 183, xl: 274, xxl: 310 }
            : { lg: 228, xl: 340, xxl: 400 },
        }}
      >
        {isQa ? '观看视频' : '点击进入'}
      </CourseActionButton>
    </Card>
  );
}
