import { Box } from '@mui/material';

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
          borderRadius: { lg: '25px', xl: '30px' },
          width: { lg: 650, xl: 830 },
          py: 4,
          px: 9,
          mt: 12,
          mb: 16,
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
            maxWidth: { lg: 630, xl: 830 },
            display: 'block',
          }}
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
            <Box
              component={'img'}
              alt='参与方式：请扫描下方二维码或点击 问卷链接 填写您的问题。'
              src={'/images/join-way.png'}
              width={0}
              height={0}
              sx={{
                cursor: 'pointer',
                width: '100%',
                height: 'auto',
                maxWidth: { lg: 560, xl: 720 },
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

              width: { lg: 200, xl: 270 },
              margin: '0 auto',
              marginBottom: 4,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
