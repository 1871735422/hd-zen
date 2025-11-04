'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { Course, CourseTopic } from '../../types/models';
import { pxToVw } from '../../utils/mobileUtils';
import { useDevice } from '../DeviceProvider';
import MobileVolumeNavigation from './MobileVolumeNavigation';

interface Chapter {
  id: number;
  title: string;
  displayOrder: number;
}

interface MobileCoursePageProps {
  // Reference book mode
  bookName?: string;
  chapters?: Chapter[];
  bookOrder?: string;
  // Course/Qa mode
  course?: Course | null;
  courseTopics?: CourseTopic[];
  courseOrder?: string;
  type?: 'course' | 'qa';
}

const MobileCoursePage: React.FC<MobileCoursePageProps> = ({
  bookName,
  chapters,
  bookOrder,
  course,
  courseTopics,
  courseOrder,
  type,
}) => {
  const { deviceType } = useDevice();

  // 判断是课程模式还是参考书模式
  const isCourseMode = !!course && !!courseTopics && !!courseOrder && !!type;

  // 只在移动端显示
  if (deviceType !== 'mobile') {
    return null;
  }

  // 生成渐变背景色（根据索引变化）
  const getGradientColor = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #E6D4DE 0%, #D4C6E6 50%, #C6D4E6 100%)',
      'linear-gradient(135deg, #F5E6D4 0%, #E6D4E6 50%, #D4C6E6 100%)',
      'linear-gradient(135deg, #E6F5D4 0%, #D4E6F5 50%, #C6E6F5 100%)',
      'linear-gradient(135deg, #F5E6F5 0%, #E6D4F5 50%, #D4C6F5 100%)',
      'linear-gradient(135deg, #E6F5F5 0%, #D4F5E6 50%, #C6F5E6 100%)',
      'linear-gradient(135deg, #F5F5E6 0%, #F5E6D4 50%, #E6D4C6 100%)',
    ];
    return gradients[index % gradients.length];
  };

  // 课程模式：显示描述和课程列表
  if (isCourseMode && course) {
    const courseDescription =
      course.description ||
      `${course.title}含${courseTopics?.length || 0}课内容。介绍佛教的因果、轮回等基础见解以及解脱的原理，了解如何做一个标准的居士，重新建立新的人生观。`;

    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          background: 'transparent',
        }}
      >
        {/* 导航按钮 */}
        {type && <MobileVolumeNavigation type={type} />}

        {/* 内容区域 */}
        <Box
          sx={{
            paddingBottom: pxToVw(20),
            paddingX: pxToVw(20),
          }}
        >
          {/* 描述文字块 */}
          <Box
            sx={{
              px: pxToVw(15),
              py: pxToVw(15),
              marginBottom: pxToVw(18),
              background:
                'linear-gradient(175.97deg, rgba(232, 247, 255, 1) 0%, rgba(224, 226, 255, 1) 99.94%) ',
              borderRadius: pxToVw(12),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToVw(16),
                color: 'rgba(67, 109, 186, 1)',
                lineHeight: 1.5,
              }}
            >
              {courseDescription}
            </Typography>
          </Box>

          {/* 课程主题列表 */}
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(16) }}
          >
            {courseTopics?.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/${type}/${courseOrder}/${topic.ordering}`}
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
                      background: getGradientColor(index),
                      marginRight: pxToVw(10),
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'url(https://img.js.design/assets/img/6899d986c3a1ea026434a985.png#6f0d27434bd79fb88cc95fc805e98472);',
                        backgroundSize: '100%',
                      },
                    }}
                  />

                  {/* 数字圆圈 */}
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
                    {topic.article_title || topic.title}
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
  }

  // 参考书模式：显示面包屑和章节列表
  if (!bookName || !chapters || !bookOrder) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F5F9FC 0%, #FFFFFF 100%)',
        paddingTop: pxToVw(20),
        paddingBottom: pxToVw(40),
        paddingX: pxToVw(20),
      }}
    >
      {/* Breadcrumb */}
      <Box
        sx={{
          marginBottom: pxToVw(32),
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: pxToVw(4),
        }}
      >
        <Link href='/' style={{ textDecoration: 'none' }}>
          <Typography
            sx={{
              fontSize: pxToVw(14),
              color: '#4A6B8A',
              cursor: 'pointer',
              '&:hover': { color: '#2E5A8A' },
            }}
          >
            首页
          </Typography>
        </Link>
        <Typography sx={{ fontSize: pxToVw(14), color: '#4A6B8A' }}>
          {' '}
          /{' '}
        </Typography>
        <Link href='/reference' style={{ textDecoration: 'none' }}>
          <Typography
            sx={{
              fontSize: pxToVw(14),
              color: '#4A6B8A',
              cursor: 'pointer',
              '&:hover': { color: '#2E5A8A' },
            }}
          >
            学修参考资料
          </Typography>
        </Link>
        <Typography sx={{ fontSize: pxToVw(14), color: '#4A6B8A' }}>
          {' '}
          /{' '}
        </Typography>
        <Typography
          sx={{
            fontSize: pxToVw(14),
            color: '#333',
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          《{bookName}》
        </Typography>
      </Box>

      {/* Chapter List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(20) }}>
        {chapters.map((chapter, index) => (
          <Link
            key={`chapter-${chapter.id}-${index}`}
            href={`/reference/${bookOrder}/${chapter.displayOrder}`}
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: pxToVw(20),
                backgroundColor: 'white',
                borderRadius: pxToVw(16),
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {/* Gradient Icon */}
              <Box
                sx={{
                  width: pxToVw(80),
                  height: pxToVw(60),
                  borderRadius: pxToVw(12),
                  background: getGradientColor(index),
                  marginRight: pxToVw(20),
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  },
                }}
              />

              {/* Chapter Title */}
              <Typography
                sx={{
                  fontSize: pxToVw(16),
                  color: '#333',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {chapter.title}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>

      {/* Empty State */}
      {chapters.length === 0 && (
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
            暂无章节内容
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MobileCoursePage;
export type { NavigationButton } from './MobileVolumeNavigation';
