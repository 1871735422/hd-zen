import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import Link from 'next/link';

interface MobileReferenceCardProps {
  title: string;
  bookOrder: string;
  chapterOrder: number;
  gradientColor: string;
}

/**
 * 移动端参考资料卡片组件
 * 根据设计稿实现渐变色卡片布局
 */
const MobileReferenceCard: React.FC<MobileReferenceCardProps> = ({
  title,
  bookOrder,
  gradientColor,
}) => {
  return (
    <Link href={`/reference/${bookOrder}`} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          width: pxToVw(160),
          height: pxToVw(200),
          borderRadius: pxToVw(16),
          background: gradientColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: pxToVw(16),
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          // 添加装饰性图案（可选）
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            opacity: 0.5,
          },
        }}
      >
        {/* 标题文字 */}
        <Typography
          sx={{
            fontSize: pxToVw(20),
            fontWeight: 600,
            color: '#2C4A6B',
            textAlign: 'center',
            lineHeight: 1.4,
            zIndex: 1,
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            letterSpacing: pxToVw(4),
          }}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  );
};

export default MobileReferenceCard;
