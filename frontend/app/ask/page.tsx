import { Box } from '@mui/material';
import Image from 'next/image';

export const metadata = {
  title: '不懂就问 | 慧灯禅修',
  description: '慧灯之光禅修网站 — 不懂就问',
};
export default function QuestionCollectPage() {
  return (
    <Box
      sx={{
        display: 'flex',
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
          borderRadius: '25px',
          py: 4,
          px: 7,
          my: 10,
          textAlign: 'left',
          width: '650px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Image
          alt='亲爱的朋友们：在学修佛法的过程中，如果您有疑惑，欢迎提出问题，一起探讨！'
          src='/images/dear-friend.png'
          width={0}
          height={0}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: 630,
            display: 'block',
          }}
          sizes='100vw'
          priority
        />
        <Box
          sx={{
            mx: 1.5,
            my: 3,
            background: 'rgba(255, 255, 255, 0.7)',
            position: 'relative',
            borderRadius: '25px',
            px: 5,
            py: 2,
          }}
        >
          <a href='#'>
            <Image
              alt='参与方式：请扫描下方二维码或点击 问卷链接 填写您的问题。'
              src={'/images/join-way.png'}
              width={0}
              height={0}
              style={{
                cursor: 'pointer',
                width: '100%',
                height: 'auto',
                maxWidth: 560,
                display: 'block',
              }}
              sizes='100vw'
              priority
            />
          </a>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src='https://img.js.design/assets/img/67dadfa407c4c2e4674d942a.png'
              alt='QR Code'
              width={200}
              height={200}
              style={{
                width: '200px',
                height: '200px',
                marginBottom: '1.6rem',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
