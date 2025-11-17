'use client';

import { getCategories } from '@/app/api';
import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BookChapter, CourseTopic } from '../../types/models';
import { pxToVw } from '../../utils/mobileUtils';
import { Menu } from '../pc/MenuItem';
import AppBreadcrumbs from '../shared/AppBreadcrumbs';

interface MobileCoursePageProps {
  courseTopics?: (CourseTopic | BookChapter)[];
  courseOrder?: string;
  courseType?: 'course' | 'reference';
}

const MobileCoursePage: React.FC<MobileCoursePageProps> = ({
  courseTopics,
  courseOrder,
  courseType,
}) => {
  const pathname = usePathname();
  const slug = pathname.slice(pathname.lastIndexOf('/') + 1);
  const [menuData, setMenuData] = useState<Menu[]>();
  const isCourse = courseType === 'course';
  const isReference = courseType === 'reference';
  useEffect(() => {
    if (isReference) {
      getCategories('学修参考资料').then(res => {
        setMenuData(res);
      });
    }
  }, []);

  const courseName = menuData
    ? (menuData[0]?.subMenu?.find(item => item.slug === slug)?.name ?? '')
    : '';

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '学修参考资料', href: '/reference' },
    { label: courseName, href: `/reference/${slug}` },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'transparent',
      }}
    >
      {isReference && (
        <Stack py={pxToVw(8)} px={pxToVw(10)}>
          <AppBreadcrumbs items={breadcrumbItems} useContext={true} />
        </Stack>
      )}
      {/* 内容区域 */}
      <Box
        sx={{
          paddingBottom: pxToVw(20),
        }}
      >
        {/* 课程主题列表 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(12) }}>
          {courseTopics?.map(topic => (
            <Link
              key={topic.id}
              href={`/${isCourse ? 'course' : 'reference'}/${courseOrder}/${topic.ordering}`}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: pxToVw(5),
                  backgroundColor: 'white',
                  borderRadius: pxToVw(12),
                  cursor: 'pointer',
                  boxShadow: '0px 0px 10px  rgba(215, 228, 252, 1)',
                }}
              >
                {/* 渐变图片缩略图 */}
                <Box
                  sx={{
                    width: pxToVw(80),
                    height: pxToVw(56),
                    borderRadius: pxToVw(10),
                    marginRight: pxToVw(isCourse ? 10 : 15),
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${topic?.url_cover || 'https://img.js.design/assets/img/6899d986c3a1ea026434a985.png'})`,
                      backgroundSize: '100%',
                    },
                  }}
                />
                {/* 数字圆圈 */}
                {isCourse && (
                  <Box
                    sx={{
                      width: pxToVw(22),
                      height: pxToVw(20),
                      borderRadius: pxToVw(5),
                      background:
                        'linear-gradient(135deg, rgba(203, 227, 247, 1) 0%, rgba(182, 194, 250, 1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: pxToVw(10),
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToVw(12),
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    >
                      {topic.ordering}
                    </Typography>
                  </Box>
                )}
                {/* 标题文字 */}
                <Typography
                  sx={{
                    fontSize: pxToVw(16),
                    pr: pxToVw(25),
                    color: STANDARD_TEXT_COLOR,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {topic.article_title}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>

        {/* 空状态 */}
        {(!courseTopics || courseTopics.length === 0) && (
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
              暂无课程内容
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MobileCoursePage;
