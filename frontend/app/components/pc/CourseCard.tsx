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
          ? { lg: 240, xl: 308, xxl: 420 }
          : { lg: 330, xl: 437, xxl: 480 },
        height: isQa
          ? { lg: 165, xl: 215, xxl: 240 }
          : { lg: 180, xl: 214, xxl: 255 },
        borderRadius: { lg: '20px', xl: '25px', xxl: '33px' },
        position: 'relative',
        boxShadow: '0 4px 20px rgba(131, 181, 247, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        color: '#444',
      }}
    >
      <CornerBadge content={isQa ? undefined : item.idx} />
      <CardContent
        sx={{
          textAlign: 'justify',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: isQa ? 60 : 100,
          flex: 1,
          px: isQa ? { lg: 2, xl: 3, xxl: 4 } : { lg: 3.3, xl: 5, xxl: 6 },
          pt: { lg: 2, xl: 3, xxl: 4 },
          pb: `5% !important`,
        }}
      >
        <Typography
          sx={{
            flex: isQa ? 3 : 1,
            pr: isQa ? { lg: 5, xl: 5.5, xxl: 6 } : 7,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isQa ? 3 : 1,
            overflow: 'hidden',
            lineHeight: 1.5,
            textOverflow: 'ellipsis',
            fontWeight: { lg: 500, xl: 600, xxl: 600 },
            fontSize: isQa
              ? { lg: 15, xl: 18, xxl: 20 }
              : { lg: 18, xl: 24, xxl: 26 },
            minHeight: isQa ? 70 : 30,
          }}
        >
          {clearCourseTitle(item.title)}
        </Typography>

        <Typography
          color={HELPER_TEXT_COLOR}
          sx={{
            flex: isQa ? 1 : 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isQa ? 1 : 2,
            overflow: 'hidden',
            fontSize: { lg: 13, xl: 15, xxl: 18 },
            lineHeight: { lg: 1.7, xl: '23px', xxl: '27px' },
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            width: '100%',
            my: isQa ? 1 : { lg: 2, xl: 2.65, xxl: 3.3 },
          }}
        >
          {item.description.replace(/<[^>]*>/g, '')}
        </Typography>
        <CourseActionButton
          sx={{
            flex: 1,
            width: isQa ? '90%' : '95%',
          }}
        >
          {isQa ? '观看视频' : '点击进入'}
        </CourseActionButton>
      </CardContent>
    </Card>
  );
}
