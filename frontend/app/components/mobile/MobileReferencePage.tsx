import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import { MobileBaseLayout } from './MobileBaseLayout';
import MobileReferenceCard from './MobileReferenceCard';
interface MobileReferencePageProps {
  categories: Array<{
    id: number;
    name: string;
    displayOrder: number;
  }>;
}

/**
 * 移动端学修参考资料页面
 * 根据设计稿实现卡片网格布局
 */
const MobileReferencePage: React.FC<MobileReferencePageProps> = ({
  categories,
}) => {
  return (
    <MobileBaseLayout>
      {/* 说明文字区域 */}
      <Box
        sx={{
          marginBottom: pxToVw(15),
          paddingY: pxToVw(13),
          px: pxToVw(32),
          borderRadius: pxToVw(12),
          color: 'rgba(67, 109, 186, 1)',
        }}
      >
        <Typography
          sx={{
            fontSize: pxToVw(16),
            lineHeight: 1.5,
          }}
        >
          本栏目提供加行修法的必修资料：《大圆满前行引导文》
        </Typography>
        <Typography
          sx={{
            fontSize: pxToVw(16),
            lineHeight: 1.5,
          }}
        >
          辅助参考资料：《前行备忘录》《菩提道次第广论》《稻秆经》《大圆满心性休息》
        </Typography>
      </Box>

      {/* 卡片网格 */}
      <Box
        sx={{
          paddingX: pxToVw(17),
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          margin: '0 auto',
        }}
      >
        {categories.map(category => (
          <MobileReferenceCard
            key={category.id}
            title={category.name}
            bookOrder={category.displayOrder.toString()}
            chapterOrder={category.displayOrder}
          />
        ))}
      </Box>
    </MobileBaseLayout>
  );
};

export default MobileReferencePage;
