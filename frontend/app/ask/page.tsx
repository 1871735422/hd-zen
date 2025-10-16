import { Box } from '@mui/material';
import { pb } from '../api';
import { Dict } from '../types/models';

export const metadata = {
  title: '不懂就问 | 慧灯禅修',
  description: '慧灯之光禅修网站 — 不懂就问',
};
export default async function QuestionCollectPage() {
  const resultList = await pb.collection('dicts').getList(1, 50, {
    filter: 'key="qa_qrcode_url"||key="qa_link"',
  });
  let result: Dict[] = [];

  try {
    result = resultList.items as unknown as Dict[];
  } catch (error) {
    console.error(error);
  }
  // console.log(result);
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: {
          sm: 'calc(100vh - 92px)',
          md: 'calc(100vh - 98px)',
          lg: 'calc(100vh - 104px)',
          xl: 'calc(100vh - 121px)',
          xxl: 'calc(100vh - 142px)',
        }, // 减去 Header 和 Footer 的高度
        height: {
          sm: 'calc(100vh - 92px)',
          md: 'calc(100vh - 98px)',
          lg: 'calc(100vh - 104px)',
          xl: 'calc(100vh - 121px)',
          xxl: 'calc(100vh - 142px)',
        },
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/course-bg.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.5,
        },
      }}
    >
      <Box
        sx={{
          background:
            'linear-gradient(229.09deg, rgba(255, 255, 255, 1) 0.02%, rgba(255, 255, 255, 0.28) 100%)',
          borderRadius: {
            sm: '18px',
            md: '22px',
            lg: '26px',
            xl: '30px',
            xxl: '35px',
          },
          width: { sm: 500, md: 580, lg: 700, xl: 830, xxl: 950 },
          py: { sm: 2.4, md: 3.2, lg: 3.6, xl: 4, xxl: 5 },
          px: { sm: 5.4, md: 6.3, lg: 7.6, xl: 9, xxl: 12 },
          mt: { sm: 7.2, md: 8.4, lg: 10, xl: 12, xxl: 16 },
          mb: { sm: 9.6, md: 11.2, lg: 13.6, xl: 16, xxl: 20 },
          textAlign: 'left',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          component={'img'}
          alt='亲爱的朋友们：在学修佛法的过程中，如果您有疑惑，欢迎提出问题，一起探讨！'
          src='/images/dear-friend.png'
          width={0}
          height={0}
          sx={{
            width: '100%',
            height: 'auto',
            maxWidth: { sm: 500, md: 580, lg: 700, xl: 830, xxl: 950 },
            display: 'block',
          }}
        />
        <Box
          sx={{
            mx: { sm: 0.9, md: 1.05, lg: 1.275, xl: 1.5, xxl: 2 },
            my: { sm: 1.8, md: 2.1, lg: 2.55, xl: 3, xxl: 3.5 },
            background: 'rgba(255, 255, 255, 0.7)',
            position: 'relative',
            borderRadius: {
              sm: '15px',
              md: '18px',
              lg: '21px',
              xl: '25px',
              xxl: '30px',
            },
            px: { sm: 3, md: 3.5, lg: 4.25, xl: 5, xxl: 6 },
            py: { sm: 1.2, md: 1.4, lg: 1.7, xl: 2, xxl: 2.5 },
          }}
        >
          <a href={result?.find(item => item.key === 'qa_link')?.value || '#'}>
            <Box
              component={'img'}
              alt='参与方式：请扫描下方二维码或点击 问卷链接 填写您的问题。'
              src={
                result?.find(item => item.key === 'qa_qrcode_url')?.value ||
                '/images/join-way.png'
              }
              width={0}
              height={0}
              sx={{
                cursor: 'pointer',
                width: '100%',
                height: 'auto',
                maxWidth: {
                  sm: 432,
                  md: 504,
                  lg: 612,
                  xl: 720,
                  xxl: 850,
                },
                display: 'block',
              }}
            />
          </a>
          <Box
            component={'img'}
            src='https://img.js.design/assets/img/67dadfa407c4c2e4674d942a.png'
            alt='QR Code'
            sx={{
              display: 'flex',
              justifyContent: 'center',

              width: { sm: 162, md: 189, lg: 229, xl: 270, xxl: 300 },
              margin: '0 auto',
              marginBottom: { sm: 2.4, md: 2.8, lg: 3.4, xl: 4, xxl: 5 },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
