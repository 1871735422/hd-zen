import { pb } from '@/app/api';
import { Dict } from '@/app/types/models';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box } from '@mui/material';
import QuestionCollectClient from '../shared/QuestionCollectClient';

/**
 * 移动端Ask页面
 * 使用移动端优化的图片和布局
 */
export default async function MobileAskPage() {
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
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingX: pxToVw(18),
        paddingY: pxToVw(25),
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'url(/images/course-bg.webp), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.55) 100%)',
          backgroundSize: '470%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '38% 70%',
          opacity: 0.6,
          zIndex: -1,
        },
      }}
    >
      <Box
        sx={{
          background:
            'linear-gradient(229.09deg, rgba(255, 255, 255, 0.1) 0.02%, rgba(255, 255, 255, 0.28) 100%)',
          borderRadius: pxToVw(30),
          border: '2px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          pt: pxToVw(24),
          textAlign: 'left',
          backdropFilter: 'blur(10px)',
          zIndex: 1,
        }}
      >
        <Box
          component={'img'}
          alt='亲爱的朋友们：在学修佛法的过程中，如果您有疑惑，欢迎提出问题，一起探讨！'
          src='/images/mobile/dear-friend.webp'
          width={0}
          height={0}
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            marginBottom: pxToVw(20),
            marginTop: pxToVw(-5),
            paddingX: pxToVw(24),
          }}
        />
        <QuestionCollectClient
          qaLink={result?.find(item => item.key === 'qa_link')?.value || '#'}
          qrCodeUrl={
            result?.find(item => item.key === 'qa_qrcode_url')?.value ||
            '/images/mobile/join-way.webp'
          }
        />
      </Box>
    </Box>
  );
}
