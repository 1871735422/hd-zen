'use client';

import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import HeadsetIcon from '@mui/icons-material/Headset';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideocamIcon from '@mui/icons-material/Videocam';
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { downloadItems, NAV_COLOR } from '../constants';

const fileTypes = [
  { key: 'pdf', name: 'PDF', icon: <PictureAsPdfIcon /> },
  { key: 'epub', name: 'EPUB', icon: <MenuBookIcon /> },
  { key: 'audiobook', name: '有声书', icon: <HeadsetIcon /> },
  { key: 'audio', name: '音频', icon: <AudiotrackIcon /> },
  { key: 'video', name: '视频', icon: <VideocamIcon /> },
];

const FileIconContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#E91E63', // A pink color similar to the screenshot
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  backgroundColor: 'rgba(233, 30, 99, 0.1)',
  borderRadius: '12px',
  marginBottom: 4,
});

function DownloadPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        py: 5,
        px: { xs: 2, sm: 3 },
        background: 'url(/images/sun-bg@2x.webp)',
        backgroundSize: 'contain',
      }}
    >
      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 4 }}>
          <Image
            src='/images/下载@2x.webp'
            alt='下载'
            width={220}
            height={88}
            priority
          />
        </Box>
        <Paper
          elevation={4}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: '16px',
          }}
        >
          {!isMobile && (
            <Grid
              container
              spacing={2}
              alignItems='center'
              sx={{ pb: 2, color: 'text.secondary' }}
            >
              <Grid size={{ md: 5 }}>
                <Typography
                  variant='subtitle1'
                  align='left'
                  sx={{ pl: 8, color: NAV_COLOR, fontWeight: '500' }}
                >
                  文件名
                </Typography>
              </Grid>
              <Grid size={{ md: 7 }} pr={2.5}>
                <Grid container spacing={1} textAlign='center'>
                  {fileTypes.map(ft => (
                    <Grid
                      size={{ xs: 'auto' }}
                      key={ft.key}
                      sx={{ flexGrow: 1, minWidth: 60 }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: '500', color: NAV_COLOR }}
                      >
                        {ft.name}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {downloadItems.map(item => (
              <Paper
                key={item.id}
                component='article'
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <Grid container alignItems='center' spacing={2}>
                  <Grid
                    size={{ xs: 12, md: 5 }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      {item.id}
                    </Avatar>
                    <Box>
                      <Typography variant='body1' fontWeight='medium'>
                        {item.title}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {item.date}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Grid container spacing={1} textAlign='center'>
                      {fileTypes.map(ft => (
                        <Grid
                          size={{ xs: 'auto' }}
                          key={ft.key}
                          sx={{ minWidth: 60, flexGrow: 1 }}
                        >
                          {isMobile && (
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              sx={{ display: 'block', mb: 0.5 }}
                            >
                              {ft.name}
                            </Typography>
                          )}
                          <FileIconContainer>
                            <IconWrapper>{ft.icon}</IconWrapper>
                            <Typography variant='caption'>
                              {item.files[ft.key as keyof typeof item.files]}
                            </Typography>
                          </FileIconContainer>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default DownloadPage;
