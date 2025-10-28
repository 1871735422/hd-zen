import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import MobileReferenceCard from './MobileReferenceCard';
interface MobileReferencePageProps {
  categories: Array<{
    id: number;
    name: string;
    displayOrder: number;
  }>;
}

// 定义不同卡片的渐变色
const gradientColors = [
  'linear-gradient(135deg, #FFE5F0 0%, #E8D5FF 100%)', // 粉紫色
  'linear-gradient(135deg, #D5E8FF 0%, #B8D9FF 100%)', // 浅蓝色
  'linear-gradient(135deg, #C8F0F0 0%, #A8E6E6 100%)', // 青色
  'linear-gradient(135deg, #C8E6FF 0%, #A8D8FF 100%)', // 蓝色
  'linear-gradient(135deg, #FFE8D5 0%, #FFD5B8 100%)', // 橙色
];

/**
 * 移动端学修参考资料页面
 * 根据设计稿实现卡片网格布局
 */
const MobileReferencePage: React.FC<MobileReferencePageProps> = ({
  categories,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F5F9FC 0%, #FFFFFF 100%)',
        paddingBottom: pxToVw(40),
      }}
    >
      {/* 说明文字区域 */}
      <Box
        sx={{
          marginBottom: pxToVw(24),
          backgroundColor: 'rgba(208, 230, 248, 0.3)',
          paddingY: pxToVw(16),
          borderRadius: pxToVw(12),
          marginX: pxToVw(16),
        }}
      >
        <Typography
          sx={{
            fontSize: pxToVw(14),
            color: '#4A6B8A',
            lineHeight: 1.6,
            marginBottom: pxToVw(12),
          }}
        >
          本栏目提供加行修法的必修资料：《大圆满前行引导文》
        </Typography>
        <Typography
          sx={{
            fontSize: pxToVw(14),
            color: '#4A6B8A',
            lineHeight: 1.6,
          }}
        >
          辅助参考资料：《前行备忘录》《菩提道次第广论》《稻秆经》《大圆满心性休息》
        </Typography>
      </Box>

      {/* 卡片网格 */}
      <Box
        sx={{
          paddingX: pxToVw(20),
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: pxToVw(16),
          maxWidth: pxToVw(375),
          margin: '0 auto',
        }}
      >
        {categories.map((category, index) => (
          <MobileReferenceCard
            key={category.id}
            title={category.name}
            bookOrder={category.displayOrder.toString()}
            chapterOrder={category.displayOrder}
            gradientColor={gradientColors[index % gradientColors.length]}
          />
        ))}
      </Box>

      {/* 如果没有数据 */}
      {categories.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            paddingY: pxToVw(60),
          }}
        >
          <Typography
            sx={{
              fontSize: pxToVw(16),
              color: '#999',
            }}
          >
            即将推出
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MobileReferencePage;
