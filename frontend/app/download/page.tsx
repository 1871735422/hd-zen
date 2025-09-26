import { Avatar, Box, Container, Grid, Typography } from '@mui/material';
import { getDownloadResources } from '../api';
import AudioDownIcon from '../components/icons/AudioDownIcon';
import EpubDownIcon from '../components/icons/EpubDownIcon';
import HeadphoneIcon from '../components/icons/HeadphoneIcon';
import PdfDownIcon from '../components/icons/PdfDownIcon';
import VideoDownIcon from '../components/icons/VideoDownIcon';
import FileIconContainer from '../components/shared/FileIconContainer';
import TitleBanner from '../components/shared/TitleBanner';
import { NAV_COLOR } from '../constants';
import { MAIN_BLUE_COLOR, STANDARD_TEXT_COLOR } from '../constants/colors';

const fileTypes = [
  { key: 'pdf', name: 'PDF', icon: <PdfDownIcon /> },
  { key: 'epub', name: 'EPUB', icon: <EpubDownIcon /> },
  { key: 'audiobook', name: '有声书', icon: <HeadphoneIcon /> },
  { key: 'audio', name: '音频', icon: <AudioDownIcon /> },
  { key: 'video', name: '视频', icon: <VideoDownIcon /> },
];

export default async function DownloadPage() {
  const downloadItems = await getDownloadResources();
  return (
    <Box
      sx={{
        px: 2,
        mb: 5,
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/course-bg-h.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.9,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1, mb: 5 }}>
        <TitleBanner title='下载' />
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            px: 2,
            pt: 3,
            pb: 5,
            borderRadius: '25px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={2} alignItems='center' px={4} pb={1.5}>
            <Grid size={4}>
              <Typography
                variant='subtitle1'
                align='left'
                sx={{ pl: 8, color: NAV_COLOR, fontWeight: '700' }}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {downloadItems.map((item, idx) => (
              <Grid
                key={item.id}
                container
                alignItems='center'
                spacing={2}
                bgcolor={'#fff'}
                borderRadius={'16px'}
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
                    <Typography variant='body2'>{idx + 1}</Typography>
                  </Avatar>
                  <Box>
                    <Typography
                      variant='body1'
                      fontWeight='medium'
                      color={STANDARD_TEXT_COLOR}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={8}>
                  <Grid container spacing={1} textAlign='center'>
                    {fileTypes.map(ft => (
                      <Grid
                        size={'auto'}
                        key={ft.key}
                        sx={{ minWidth: 60, flexGrow: 1 }}
                      >
                        <FileIconContainer
                          target={
                            item[`url_down${ft.key}` as keyof typeof item]
                              ? '_blank'
                              : '_top'
                          }
                          href={
                            (item[
                              `url_down${ft.key}` as keyof typeof item
                            ] as string) || '#'
                          }
                        >
                          {ft.icon}
                          <Typography fontSize={13} pt={0.3} minWidth={40}>
                            {item[`${ft.key}_size` as keyof typeof item] ||
                              'N/A'}
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
