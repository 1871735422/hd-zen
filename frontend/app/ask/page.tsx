import { Box, Link, Typography } from '@mui/material';
import Image from 'next/image';
import { LINK_COLOR, NAV_COLOR } from '../constants';

export default function QuestionCollectPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
        url(/images/course-bg.jpg),
        linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          p: 4,
          my: 12,
          textAlign: 'left',
          maxWidth: '600px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Typography
          variant='h6'
          component='p'
          sx={{ mb: 2, color: LINK_COLOR }}
        >
          亲爱的朋友们：
          <br />
          在学修佛法的过程中，如果您有疑惑，欢迎提出问题，一起探讨！
        </Typography>
        <Box sx={{ my: 3 }}>
          <Typography
            variant='subtitle1'
            component='p'
            sx={{ color: 'rgba(255, 94, 124, 1)', fontWeight: 'bold' }}
          >
            参与方式：
          </Typography>
          <Typography
            variant='body1'
            component='p'
            sx={{ mt: 1, color: NAV_COLOR }}
          >
            请扫描下方二维码或点击
            <Link
              href='#'
              style={{
                margin: '0 4px',
                color: LINK_COLOR,
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              问卷链接
            </Link>
            填写您的问题。
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src='https://img.js.design/assets/img/67dadfa407c4c2e4674d942a.png'
            alt='QR Code'
            style={{ width: '200px', height: '200px', marginTop: '16px' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
