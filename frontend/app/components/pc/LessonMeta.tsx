import { Box, Chip, Stack, Typography } from '@mui/material';

export interface LessonMetaProps {
  title: string;
  tags: string[];
  description: string;
  author: string;
  date: string;
}

export default function LessonMeta({
  title,
  tags,
  description,
  author,
  date,
}: LessonMetaProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant='h4'
        fontWeight={500}
        fontSize={24}
        align='center'
        color='#333'
        m={3}
      >
        {title}
      </Typography>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f5faff 0%, #eaf3ff 100%)',
          borderRadius: 6,
          p: { xs: 2, sm: 4 },
          mb: 3,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
          position: 'relative',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          overflow: 'hidden',
          border: '1px solid #e3eaf2',
        }}
      >
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          mb={1}
          flexWrap='wrap'
        >
          <Typography
            variant='subtitle1'
            color='#6b7a90'
            fontWeight={600}
            sx={{ fontSize: 18 }}
          >
            标签：
          </Typography>
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              color='info'
              variant='outlined'
              sx={{
                fontWeight: 500,
                fontSize: 16,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                background: tag === tags[0] ? 'rgba(165, 201, 242, 1)' : '#fff',
                color: tag === tags[0] ? '#fff' : 'rgba(139, 162, 176, 1)',
                border: 'none',
              }}
            />
          ))}
        </Stack>
        <Box display='flex' alignItems='flex-start'>
          <Typography
            variant='subtitle1'
            color='#6b7a90'
            fontWeight={600}
            sx={{ fontSize: 18, minWidth: 60 }}
          >
            问题：
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ fontSize: 18, lineHeight: 1.7 }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
      <Box mt={1} mb={2}>
        <Typography variant='subtitle2' color='#8a99a8' sx={{ fontSize: 16 }}>
          作者：{author} &nbsp;&nbsp; {date}
        </Typography>
      </Box>
    </Box>
  );
}
