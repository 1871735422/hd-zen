import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Link, Stack, Typography } from '@mui/material';
import { clearCourseTitle, formatDate } from '../../utils/courseUtils';
import LessonDescriptionBlock from './LessonDescriptionBlock';

export interface LessonMetaProps {
  title: string;
  tags?: string[];
  description?: string;
  author: string;
  date: string;
  refCourse?: string;
  refUrl?: string;
}

export default function LessonMeta({
  title,
  tags,
  description,
  author,
  date,
  refCourse,
  refUrl,
}: LessonMetaProps) {
  const isQuestion = /^\d+\./.test(title);

  return (
    <Stack
      display={'flex'}
      mb={refCourse ? 0 : 2}
      flexDirection={'column'}
      alignItems={isQuestion ? 'flex-start' : 'center'}
    >
      <Typography
        fontWeight={600}
        px={0}
        fontSize={{
          lg: 30,
          xl: isQuestion ? 32 : 36,
          xxl: isQuestion ? 36 : 40,
        }}
        color={STANDARD_TEXT_COLOR}
        mb={tags?.length || description ? { lg: 5.7, xl: 8, xxl: 10 } : 1}
        mt={isQuestion ? 0 : { lg: 6.4, xl: 9, xxl: 11 }}
      >
        {clearCourseTitle(title)}
      </Typography>
      <LessonDescriptionBlock
        isQuestion={isQuestion}
        description={description}
        tags={tags}
      />
      <Box
        mt={{ lg: 1, xl: 2 }}
        mb={2}
        ml={1}
        alignSelf={'start'}
        sx={{
          '& .MuiTypography-subtitle1': {
            ml: 1,
            fontSize: { lg: 16, xl: 18 },
            color: 'rgba(153, 153, 153, 1)',
          },
        }}
      >
        <Typography variant='subtitle1'>
          作者：{author?.replace('作者：', '')} &nbsp;&nbsp; {formatDate(date)}
        </Typography>
        {refCourse && (
          <Typography variant='subtitle1'>
            本问答属于：
            <Link href={refUrl} color='rgba(86, 137, 204, 1) !important'>
              {refCourse}
            </Link>
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
