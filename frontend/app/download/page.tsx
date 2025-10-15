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

export const metadata = {
  title: '禅修课资料下载 | 慧灯禅修',
  description: '慧灯之光禅修网站 — 禅修课资料下载',
};

export default async function DownloadPage() {
  const downloadItems = await getDownloadResources();
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: {
          sm: 'calc(100vh - 92px)',
          md: 'calc(100vh - 98px)',
          lg: 'calc(100vh - 104px)',
          xl: 'calc(100vh - 121px)',
          xxl: 'calc(100vh - 142px)',
        },
        height: {
          sm: 'calc(100vh - 92px)',
          md: 'calc(100vh - 98px)',
          lg: 'calc(100vh - 104px)',
          xl: 'calc(100vh - 121px)',
          xxl: 'calc(100vh - 142px)',
        },
        backgroundImage: 'url(/images/course-bg-h.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.9,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      <Container
        maxWidth='xl'
        sx={{
          position: 'relative',
          zIndex: 1,
          pb: { sm: 3, md: 4, lg: 5, xl: 5, xxl: 6 },
        }}
      >
        <TitleBanner title='下载' />
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            mx: { sm: 2, md: 4, lg: 10, xl: 10, xxl: 12 },
            px: { sm: 1.5, md: 2, lg: 2, xl: 2.5, xxl: 3 },
            pt: { sm: 2, md: 2.5, lg: 3, xl: 3, xxl: 3.5 },
            pb: { sm: 4, md: 5, lg: 7, xl: 7, xxl: 8 },
            borderRadius: {
              sm: '15px',
              md: '20px',
              lg: '25px',
              xl: '25px',
              xxl: '30px',
            },
            backdropFilter: 'blur(10px)',
            '& .MuiTypography-root': {
              fontSize: { sm: 14, md: 16, lg: 18, xl: 20, xxl: 22 },
            },
            '& .MuiTypography-subtitle2': {
              fontSize: { sm: 10, md: 12, lg: 13, xl: 16, xxl: 18 },
            },
          }}
        >
          <Grid
            container
            spacing={{ sm: 1, md: 1.5, lg: 2, xl: 2, xxl: 2.5 }}
            alignItems='center'
            px={{ sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
            pb={{ sm: 1, md: 1.5, lg: 2, xl: 2, xxl: 2.5 }}
          >
            <Grid size={4}>
              <Typography
                align='left'
                sx={{
                  pl: { sm: 2, md: 4, lg: 12, xl: 12, xxl: 14 },
                  color: NAV_COLOR,
                  fontWeight: '700',
                }}
              >
                文件名
              </Typography>
            </Grid>
            <Grid size={8}>
              <Grid
                container
                spacing={{ sm: 0.5, md: 0.8, lg: 1, xl: 1, xxl: 1.2 }}
                textAlign='center'
              >
                {fileTypes.map(ft => (
                  <Grid key={ft.key} sx={{ flexGrow: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: '600',
                        width: { sm: 50, md: 60, lg: 70, xl: 70, xxl: 80 },
                        color: NAV_COLOR,
                      }}
                    >
                      {ft.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { sm: 1, md: 1.5, lg: 2, xl: 2, xxl: 2.5 },
            }}
          >
            {downloadItems.map((item, idx) => (
              <Grid
                key={item.id}
                container
                alignItems='center'
                spacing={{ sm: 1, md: 1.5, lg: 2, xl: 2, xxl: 2.5 }}
                bgcolor={'#fff'}
                borderRadius={{
                  sm: '10px',
                  md: '12px',
                  lg: '16px',
                  xl: '16px',
                  xxl: '20px',
                }}
                pl={{ sm: 2, md: 3, lg: 6, xl: 6, xxl: 7 }}
                pr={{ sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
                pt={{ sm: 1, md: 1.2, lg: 1.5, xl: 1.5, xxl: 2 }}
                pb={{ sm: 1, md: 1, lg: 1.2, xl: 1.2, xxl: 1.5 }}
              >
                <Grid
                  size={4}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { sm: 1, md: 1.5, lg: 2, xl: 2, xxl: 2.5 },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: MAIN_BLUE_COLOR,
                      width: { sm: 20, md: 24, lg: 26, xl: 32, xxl: 36 },
                      height: { sm: 20, md: 24, lg: 26, xl: 32, xxl: 36 },
                      display: { sm: 'flex' },
                    }}
                  >
                    <Typography
                      fontSize={{ sm: 12, md: 14, lg: 16, xl: 18, xxl: 20 }}
                    >
                      {idx + 1}
                    </Typography>
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
                  <Grid
                    container
                    spacing={{ sm: 0.5, md: 0.8, lg: 1, xl: 1, xxl: 1.2 }}
                    textAlign='center'
                  >
                    {fileTypes.map(ft => (
                      <Grid size={'auto'} key={ft.key} sx={{ flexGrow: 1 }}>
                        <FileIconContainer
                          sx={{
                            width: { sm: 40, md: 50, lg: 60, xl: 60, xxl: 70 },
                          }}
                          fontSize={{ sm: 18, md: 22, lg: 27, xl: 27, xxl: 32 }}
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
                          <Typography
                            variant='subtitle2'
                            pt={{
                              sm: 0.2,
                              md: 0.3,
                              lg: 0.3,
                              xl: 0.7,
                              xxl: 0.8,
                            }}
                          >
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
