import { getCategories } from '@/app/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { pxToVw } from '../../utils/mobileUtils';
import { MobileBaseLayout } from './MobileBaseLayout';
import MobileReferenceCard, {
  MobileReferenceCardProps,
} from './MobileReferenceCard';

/**
 * 移动端学修参考资料页面
 * 根据设计稿实现卡片网格布局
 */

interface MobileReferencePageProps {
  categories: MobileReferenceCardProps[];
}
async function MobileReferencePage({ categories }: MobileReferencePageProps) {
  const menuData = await getCategories('学修参考资料');
  const description = menuData[0]?.description;

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
          dangerouslySetInnerHTML={{ __html: description }}
        />
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
            key={category.bookOrder}
            cover={category.cover}
            title={category.title}
            bookOrder={category.bookOrder}
            chapterOrder={category.chapterOrder}
          />
        ))}
      </Box>
    </MobileBaseLayout>
  );
}

export default MobileReferencePage;
