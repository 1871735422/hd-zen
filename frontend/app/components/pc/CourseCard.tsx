import VideocamIcon from '@mui/icons-material/Videocam';
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from '@mui/material';
import { HELPER_TEXT_COLOR } from '../../constants/colors';

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
      href={`/course/${courseId}/${topicId}/lesson${item.id}`}
      sx={{
        textDecoration: 'none',
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          px: 1,
          zoom: item.isQa ? 0.8 : 1,
        }}
      >
        <Typography variant='h6' p={2} fontWeight='bold' pb={0}>
          {item.title}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            background:
              'linear-gradient(222.06deg, rgba(255, 168, 184, 1) 0%, rgba(255, 106, 114, 1) 69.37%)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderTopRightRadius: '16px',
            borderBottomLeftRadius: '16px',
          }}
        >
          {item.isQa ? <VideocamIcon /> : item.id}
        </Box>
        <CardContent
          sx={{
            textAlign: 'left',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
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
              pb: 2,
            }}
          >
            {item.description}
          </Typography>
          <Button
            variant='outlined'
            sx={{
              borderRadius: '20px',
              mx: 2,
              py: 0.5,
              px: 0,
              borderColor: 'rgba(154, 189, 230, 1)',
              color: 'rgba(154, 189, 230, 1)',
              '&:hover': {
                borderColor: '#0041ad',
                backgroundColor: 'rgba(0, 82, 217, 0.04)',
              },
            }}
          >
            {item.isQa ? '观看视频' : '点击进入'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
