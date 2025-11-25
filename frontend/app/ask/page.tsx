import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { pb } from '../api';
import QuestionCollectClient from '../components/shared/QuestionCollectClient';
import { ASK_DEAD_FRIENDS1, ASK_DEAD_FRIENDS2 } from '../constants';
import { Dict } from '../types/models';
import { getDeviceTypeFromHeaders } from '../utils/serverDeviceUtils';

export const metadata = {
  title: '不懂就问 | 慧灯禅修',
  description: '慧灯之光禅修网站 — 不懂就问',
};

export const revalidate = 3600; // 1 hour

// PC端Ask页面组件
async function PCAskPage() {
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
          width: { lg: 700, xlg: 780, xl: 1000, xxl: 950 },
          py: { lg: 3.6, xlg: 4, xl: 4, xxl: 5 },
          pl: { lg: 7.6, xlg: 8, xl: 8, xxl: 12 },
          pr: { lg: 7.6, xlg: 8, xl: 6, xxl: 12 },
          textAlign: 'left',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography
          className='fz-qiti'
          sx={{
            color: 'rgba(42, 130, 228, 1)',
            fontSize: 30,
            lineHeight: 2,
          }}
        >
          {ASK_DEAD_FRIENDS1}
        </Typography>
        <Typography
          className='fz-qiti'
          sx={{
            color: 'rgba(42, 130, 228, 1)',
            fontSize: 30,
            lineHeight: 1.2,
          }}
        >
          {ASK_DEAD_FRIENDS2}
        </Typography>
        <QuestionCollectClient
          qaLink={result?.find(item => item.key === 'qa_link')?.value || '#'}
        />
      </Box>
    </Box>
  );
}

export default async function QuestionCollectPage() {
  const deviceType = await getDeviceTypeFromHeaders();

  const MobileAskPage = dynamic(() => import('../components/mobile/AskPage'), {
    ssr: true,
  });
  // 根据设备类型返回对应的组件
  if (deviceType === 'mobile') {
    return <MobileAskPage />;
  }

  return <PCAskPage />;
}
