import { Box } from '@mui/material';
import { pb } from '../api';
import { Dict } from '../types/models';
import QuestionCollectClient from './QuestionCollectClient';

export const metadata = {
  title: '不懂就问 | 慧灯禅修',
  description: '慧灯之光禅修网站 — 不懂就问',
};

export const revalidate = 3600; // 1 hour

export default async function QuestionCollectPage() {
  let result: Dict[] = [];

  try {
    const resultList = await pb.collection('dicts').getList(1, 50, {
      filter: 'key="qa_qrcode_url"||key="qa_link"',
    });
    result = resultList.items as unknown as Dict[];
  } catch (error) {
    console.error(error);
  }
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
          backgroundImage: 'url(/images/course-bg.webp)',
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
            lg: '26px',
            xl: '30px',
            xxl: '35px',
          },
          width: { lg: 700, xl: 830, xxl: 950 },
          py: { lg: 3.6, xlg: 4, xl: 4, xxl: 5 },
          px: { lg: 7.6, xlg: 8, xl: 9, xxl: 12 },
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
        <QuestionCollectClient
          qaLink={result?.find(item => item.key === 'qa_link')?.value || '#'}
          qrCodeUrl={
            result?.find(item => item.key === 'qa_qrcode_url')?.value ||
            '/images/join-way.png'
          }
        />
      </Box>
    </Box>
  );
}
