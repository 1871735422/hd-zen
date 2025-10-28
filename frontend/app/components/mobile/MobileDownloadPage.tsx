import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { getDownloadResources } from '../../api';
import { pxToVw } from '../../utils/mobileUtils';
import MobileDownloadCard from './MobileDownloadCard';

/**
 * 移动端下载页面
 * 根据设计稿实现卡片式布局
 */
const MobileDownloadPage: React.FC = async () => {
  const downloadItems = (await getDownloadResources())?.filter(
    item => item.url_downpdf || item.url_downepub
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url(https://img.js.design/assets/img/67d3a3b8cf31bff6774f8c69.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(50px)',
          transform: 'scale(1.1)',
          zIndex: -1,
        },
      }}
    >
      {/* 页面标题 */}
      <Box
        sx={{
          paddingLeft: pxToVw(20),
          paddingY: pxToVw(14),
        }}
      >
        <Typography
          sx={{
            fontSize: pxToVw(16),
            fontWeight: 500,
            color: 'rgba(67, 109, 186, 1)',
          }}
        >
          这里提供书籍文字下载
        </Typography>
      </Box>

      {/* 下载列表 */}
      {downloadItems.map((item, index) => (
        <MobileDownloadCard key={item.id} item={item} index={index} />
      ))}
    </Box>
  );
};

export default MobileDownloadPage;
