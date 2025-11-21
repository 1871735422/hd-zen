'use client';

import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import { labelItemList, SiderbarKey } from '../pc/LessonSidebar';
import { MobileLessonMeta } from './MobileLessonMeta';
import MobileRelatedResources from './MobileRelatedResources';

interface MobileLessonPageProps {
  title: string;
  author: string;
  date: string;
  description?: string;
  children?: React.ReactNode;
  courseOrder: string;
  lessonOrder: string;
  mp3Url?: string;
  pdfUrl?: string;
  epubUrl?: string;
  excludeLabels: (typeof labelItemList)[number]['label'][];
  hasSiderbar?: boolean;
}

const MobileLessonPage: React.FC<MobileLessonPageProps> = ({
  title,
  author,
  date,
  description,
  children,
  courseOrder,
  lessonOrder,
  mp3Url,
  pdfUrl,
  epubUrl,
  excludeLabels,
  hasSiderbar,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 参数获取当前选中的资源类型
  const selectedResource = (searchParams.get('tab') as SiderbarKey) || 'video';

  // 处理资源点击，更新 URL 参数
  const handleResourceClick = useCallback(
    (type: SiderbarKey) => {
      const params = new URLSearchParams(searchParams?.toString());

      if (type === 'video') {
        // 视频是默认，移除 tab 参数
        params.delete('tab');
      } else if (type === 'qa') {
        return router.push(`/qa/${courseOrder}/lesson${lessonOrder}`);
      } else {
        params.set('tab', type);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : window.location.pathname;

      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        pb: pxToVw(80),
      }}
    >
      <MobileLessonMeta
        title={title}
        author={author}
        date={date}
        description={description}
        mp3Url={mp3Url}
        pdfUrl={pdfUrl}
        epubUrl={epubUrl}
        hasSiderbar={hasSiderbar}
      />

      {/* 相关资料侧边栏（可展开/收起）*/}
      <MobileRelatedResources
        excludeLabels={excludeLabels}
        onResourceClick={handleResourceClick}
        selectedResource={selectedResource ?? 'video'}
      />

      {/* 主内容区域 */}
      {children}
    </Box>
  );
};

export default MobileLessonPage;
