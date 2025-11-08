import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography
          variant='h1'
          sx={{
            fontSize: { xs: '4rem', sm: '6rem' },
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          404
        </Typography>
        <Typography
          variant='h4'
          sx={{ fontWeight: 500, color: 'text.primary' }}
        >
          页面未找到
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary', mb: 2 }}>
          您访问的页面不存在。
        </Typography>
        <Button
          component={Link}
          href='/'
          variant='contained'
          size='large'
          sx={{ px: 2, py: 0.5 }}
        >
          返回首页
        </Button>
      </Box>
    </Container>
  );
}
