import { Avatar, Box, Container, Grid, Typography } from '@mui/material';
import { getDownloadResources } from '../api';
import AudioDownIcon from '../components/icons/AudioDownIcon';
import EpubDownIcon from '../components/icons/EpubDownIcon';
import HeadphoneIcon from '../components/icons/HeadphoneIcon';
import PdfDownIcon from '../components/icons/PdfDownIcon';
import VideoDownIcon from '../components/icons/VideoDownIcon';
import MobileDownloadPage from '../components/mobile/MobileDownloadPage';
import FileIconContainer from '../components/shared/FileIconContainer';
import TitleBanner from '../components/shared/TitleBanner';
import { NAV_COLOR } from '../constants';
import { MAIN_BLUE_COLOR, STANDARD_TEXT_COLOR } from '../constants/colors';
import { DownloadResource } from '../types/models';
import { getDeviceTypeFromHeaders } from '../utils/serverDeviceUtils';

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

// 启用 SSG 静态生成，数据在构建时预生成
// 设置 1 小时的 ISR 重新验证时间，平衡性能和数据新鲜度
export const revalidate = 3600; // 1 hour

// PC端下载页面组件
async function PCDownloadPage() {
  // 在 SSG 构建时获取下载资源数据
  // 如果获取失败，返回空数组避免构建失败
  let downloadItems: DownloadResource[];
  try {
    downloadItems = await getDownloadResources();
  } catch (error) {
    console.warn('Failed to fetch download resources during build:', error);
    downloadItems = [];
  }
  return (
    <Box
      sx={{
        width: '100%',
        backgroundImage: 'url(/images/course-bg-h.webp)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.9,
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: { lg: 1360, xl: 1400 },
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
      >
        <TitleBanner title='下载' />
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            mx: { lg: 12, xl: 12 },
            my: { lg: 7, xl: 7 },
            px: { lg: 2, xl: 2.5 },
            pt: { lg: 3, xl: 3 },
            pb: { lg: 3, xl: 3 },
            borderRadius: {
              lg: '25px',
              xl: '25px',
            },
            backdropFilter: 'blur(10px)',
            '& .MuiTypography-root': {
              fontSize: { lg: 18, xl: 20 },
            },
            '& .MuiTypography-subtitle2': {
              fontSize: { lg: 13, xl: 16 },
            },
          }}
        >
          <Grid
            container
            spacing={{ lg: 2, xl: 2 }}
            alignItems='center'
            px={{ lg: 4, xl: 4 }}
            pb={{ lg: 2, xl: 2 }}
          >
            <Grid size={4}>
              <Typography
                align='left'
                sx={{
                  pl: { lg: 12, xl: 12 },
                  color: NAV_COLOR,
                  fontWeight: '700',
                }}
              >
                文件名
              </Typography>
            </Grid>
            <Grid size={8}>
              <Grid container spacing={{ lg: 1, xl: 1 }} textAlign='center'>
                {fileTypes.map(ft => (
                  <Grid key={ft.key} sx={{ flexGrow: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: '600',
                        width: { lg: 70, xl: 70 },
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
              gap: { lg: 2, xl: 2 },
            }}
          >
            {downloadItems.map((item, idx) => (
              <Grid
                key={item.id}
                container
                alignItems='center'
                spacing={{ lg: 2, xl: 2 }}
                bgcolor={'#fff'}
                borderRadius={{
                  lg: '16px',
                  xl: '16px',
                }}
                pl={{ lg: 6, xl: 6 }}
                pr={{ lg: 4, xl: 4 }}
                pt={{ lg: 1.5, xl: 1.5 }}
                pb={{ lg: 1.2, xl: 1.2 }}
              >
                <Grid
                  size={4}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { lg: 2, xl: 2 },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: MAIN_BLUE_COLOR,
                      width: { lg: 26, xl: 32 },
                      height: { lg: 26, xl: 32 },
                      display: 'flex',
                    }}
                  >
                    <Typography fontSize={{ lg: 16, xl: 18 }}>
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
                  <Grid container spacing={{ lg: 1, xl: 1 }} textAlign='center'>
                    {fileTypes.map(ft => (
                      <Grid size={'auto'} key={ft.key} sx={{ flexGrow: 1 }}>
                        <FileIconContainer
                          sx={{
                            width: { lg: 60, xl: 60 },
                          }}
                          fontSize={{ lg: 27, xl: 27 }}
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
                              lg: 0.3,
                              xl: 0.7,
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

export default async function DownloadPage() {
  const deviceType = await getDeviceTypeFromHeaders();

  // 根据设备类型返回对应的组件
  if (deviceType === 'mobile') {
    return <MobileDownloadPage />;
  }

  return <PCDownloadPage />;
}
