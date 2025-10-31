import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { TitleBanner } from '../shared';
import CategorySelector from './CategorySelector';

interface BaseLayoutProps {
  title: string;
  categories?: string[];
  selectedCategory?: string;
  description?: string;
  children: React.ReactNode;
}

function BaseLayout({
  title,
  categories,
  selectedCategory,
  description,
  children,
}: BaseLayoutProps) {
  return (
    <Container
      maxWidth={'xxl'}
      sx={{
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        m: 0,
        p: '0 !important',
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(224, 241, 255, 0.05) 0%,      /* #E0F1FF 浅天蓝色, 70%不透明 - 页面顶部起始色 */

            rgba(217, 234, 252, 0.05) 0%,   /* #D9EAFC 淡蓝色, 70%不透明 - 中部蓝色调层 */

            rgba(241, 247, 254, 0.7) 63.87%,   /* #F1F7FE 冰蓝白色, 70%不透明 - 向底部过渡 */

            rgba(241, 247, 251, 1) 100%      /* #F5F7FB 灰蓝白色, 70%不透明 - 页面底部结束色 */
          ),
          url(/images/course-bg-h.webp),
          url(/images/course-lesson-bg.webp)
        `,
        // backgroundSize 控制背景图片尺寸显示方式:
        // 1. 第一个 'cover': 渐变主背景与第一张图片按容器完全覆盖显示
        // 2. 第二个 'cover': 第二张图片同样覆盖
        // 3. 第三个 'contain': 第三张图片自适应缩放以完整显示在容器内
        backgroundSize: 'cover, 100%, contain',
        // backgroundPosition 控制背景图像的位置:
        // 1. 第一个 'center': 主背景线性渐变和第一张图片居中位置。
        // 2. 第二个 'center': 第二张背景图同样居中。
        // 3. '0% -14%': 第三张背景图片沿X轴左对齐，Y轴往上偏移14%，实现顶部视觉效果渐变融合。
        backgroundPosition: 'top, top, 0% -15%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          minWidth: { lg: 1060, xlg: 1080, xl: 1400, xxl: 1420 },
          maxWidth: { lg: 1060, xlg: 1080, xl: 1400, xxl: 1420 },
        }}
      >
        <TitleBanner title={title} />
        {description && (
          <Typography
            fontSize={{ sm: 12, md: 14, lg: 14, xl: 18, xxl: 24 }}
            sx={{
              color: 'rgba(127, 173, 235, 1)',
              mt: { sm: -3, md: -4, lg: -4.3, xl: -6, xxl: -8 },
              mb: { sm: 3, md: 4, lg: 4.3, xl: 6, xxl: 8 },
              px: { sm: 1.5, md: 2, lg: 2.1, xl: 3, xxl: 4 },
            }}
          >
            {description?.split('\n')[0]}
            <br />
            {description?.split('\n')[1]}
          </Typography>
        )}
        {categories && (
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory || categories[0]}
          />
        )}
        {children}
      </Box>
    </Container>
  );
}

export default BaseLayout;
