'use client';

import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { pxToVw } from '../../utils/mobileUtils';
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
}

const MobileLessonPage: React.FC<MobileLessonPageProps> = ({
  title,
  author,
  date,
  description,
  children,
  courseOrder,
  lessonOrder,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 参数获取当前选中的资源类型
  const selectedResource =
    (searchParams.get('tab') as 'video' | 'audio' | 'article' | 'qa') ||
    'video';

  // 处理资源点击，更新 URL 参数
  const handleResourceClick = useCallback(
    (type: 'video' | 'audio' | 'article' | 'qa') => {
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
      />

      {/* 相关资料侧边栏（可展开/收起）*/}
      <MobileRelatedResources
        onResourceClick={handleResourceClick}
        selectedResource={selectedResource ?? 'video'}
      />

      {/* 主内容区域 */}
      {children}
    </Box>
  );
};

export default MobileLessonPage;
