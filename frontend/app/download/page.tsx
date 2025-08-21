'use client';

import {
  Avatar,
  Box,
  Container,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AudioDownIcon from '../components/icons/AudioDownIcon';
import EpubDownIcon from '../components/icons/EpubDownIcon';
import HeadphoneIcon from '../components/icons/HeadphoneIcon';
import PdfDownIcon from '../components/icons/PdfDownIcon';
import VideoDownIcon from '../components/icons/VideoDownIcon';
import { downloadItems, NAV_COLOR } from '../constants';
import { MAIN_BLUE_COLOR, STANDARD_TEXT_COLOR } from '../constants/colors';

const fileTypes = [
  { key: 'pdf', name: 'PDF', icon: <PdfDownIcon /> },
  { key: 'epub', name: 'EPUB', icon: <EpubDownIcon /> },
  { key: 'audiobook', name: '有声书', icon: <HeadphoneIcon /> },
  { key: 'audio', name: '音频', icon: <AudioDownIcon /> },
  { key: 'video', name: '视频', icon: <VideoDownIcon /> },
];

const FileIconContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 168, 184, 1)',
  '&:hover': {
    color: 'rgba(255, 94, 124, 1)',
  },
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
          <Typography variant='h3' color='rgba(102, 158, 222, 1)'>
            下载
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: '16px',
          }}
        >
          {!isMobile && (
            <Grid container spacing={2} alignItems='center' px={4} pb={1}>
              <Grid size={4}>
                <Typography
                  variant='subtitle1'
                  align='left'
                  sx={{ pl: 8, color: NAV_COLOR, fontWeight: '600' }}
                >
                  文件名
                </Typography>
              </Grid>
              <Grid size={8}>
                <Grid container spacing={1} textAlign='center'>
                  {fileTypes.map(ft => (
                    <Grid
                      size={{ xs: 'auto' }}
                      key={ft.key}
                      sx={{ flexGrow: 1, minWidth: 60 }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: '600', color: NAV_COLOR }}
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
              <Grid
                key={item.id}
                container
                alignItems='center'
                spacing={2}
                bgcolor={'#fff'}
                borderRadius={'20px'}
                px={4}
                pt={1.5}
                pb={1.2}
              >
                <Grid
                  size={4}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: MAIN_BLUE_COLOR,
                      width: 26,
                      height: 26,
                      display: { xs: 'none', sm: 'flex' },
                    }}
                  >
                    <Typography variant='body2'>{item.id}</Typography>
                  </Avatar>
                  <Box>
                    <Typography
                      variant='body1'
                      fontWeight='medium'
                      color={STANDARD_TEXT_COLOR}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={8}>
                  <Grid container spacing={1} textAlign='center'>
                    {fileTypes.map(ft => (
                      <Grid
                        size={'auto' }
                        key={ft.key}
                        sx={{ minWidth: 60, flexGrow: 1 }}
                      >
                        {isMobile && (
                          <Typography
                            variant='caption'
                            color='text.secondary'
                          >
                            {ft.name}
                          </Typography>
                        )}
                        <FileIconContainer>
                          {ft.icon}
                          <Typography variant='caption' pt={.3}>
                            {item.files[ft.key as keyof typeof item.files]}
                          </Typography>
                        </FileIconContainer>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default DownloadPage;
