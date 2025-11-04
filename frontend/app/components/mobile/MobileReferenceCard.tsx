import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';

interface MobileReferenceCardProps {
  title: string;
  bookOrder: string;
  chapterOrder: number;
}

/**
 * 移动端参考资料卡片组件
 * 根据设计稿实现渐变色卡片布局
 */
const MobileReferenceCard: React.FC<MobileReferenceCardProps> = ({
  title,
  bookOrder,
}) => {
  return (
    <Link
      href={`/reference/${bookOrder}`}
      style={{
        marginBottom: pxToVw(30),
      }}
    >
      <Box
        sx={{
          width: pxToVw(110),
          height: pxToVw(137),
          borderRadius: pxToVw(16),
          background: `url(/images/mobile/refBook${bookOrder}.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mb: pxToVw(4),
        }}
      />
      <Typography
        sx={{
          fontSize: pxToVw(14),
          fontWeight: 400,
          color: STANDARD_TEXT_COLOR,
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
    </Link>
  );
};

export default MobileReferenceCard;
