'use client';

import { clearCourseTitle } from '@/app/utils/courseUtils';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { QuestionResult } from '../../types/models';
import { pxToVw } from '../../utils/mobileUtils';
import { useDevice } from '../DeviceProvider';
import { CornerBadge } from '../pc';
import MobileQaSidebar from './MobileQaSidebar';
import MobileVolumeNavigation from './MobileVolumeNavigation';

interface MobileQaPageProps {
  courseOrder: string;
  sidebarData: { label: string; path: string; displayOrder: number }[];
  questions: QuestionResult[];
  selectedLessonOrder: string;
  showComingSoon?: boolean;
}

const MobileQaPage: React.FC<MobileQaPageProps> = ({
  courseOrder,
  sidebarData,
  questions,
  selectedLessonOrder,
  showComingSoon = false,
}) => {
  const { deviceType } = useDevice();

  // 只在移动端显示
  if (deviceType !== 'mobile') {
    return null;
  }

  const selectedIdx = sidebarData.findIndex(
    item => item.displayOrder === Number(selectedLessonOrder)
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'transparent',
      }}
    >
      {/* 册别导航 */}
      <MobileVolumeNavigation type='qa' />

      {/* 主内容区域 - 左右布局 */}
      <Box
        sx={{
          display: 'flex',
          gap: pxToVw(7),
          paddingBottom: pxToVw(20),
          pr: pxToVw(16),
          // minHeight: `calc(100vh - ${pxToVw(80)})`,
        }}
      >
        {/* 左侧：课程主题侧边栏 */}
        {sidebarData.length > 0 ? (
          <MobileQaSidebar items={sidebarData} selectedIdx={selectedIdx} />
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              paddingY: pxToVw(60),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToVw(14),
              }}
            >
              本册暂无问答
            </Typography>
          </Box>
        )}

        {/* 右侧：问题列表 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: pxToVw(8),
          }}
        >
          {questions.map((question, idx) => (
            <Link
              key={idx}
              href={`/qa/${courseOrder}/lesson${selectedLessonOrder}?tab=question${idx + 1}`}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  padding: pxToVw(16),
                  backgroundColor: 'white',
                  borderRadius: pxToVw(15),
                  cursor: 'pointer',
                  boxShadow: '0px 2px 10px 0px rgba(131, 181, 247, 0.3)',
                  transition: 'all 0.2s',
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                {/* 标题 */}
                <Typography
                  sx={{
                    fontSize: pxToVw(15),
                    color: 'rgba(102, 102, 102, 1)',
                    fontWeight: 400,
                    lineHeight: 1.33,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    zIndex: 2,
                  }}
                >
                  {clearCourseTitle(
                    question.questionTitle || question.topicTitle
                  )}
                </Typography>

                {/* 右侧视频图标 */}
                <CornerBadge isMobile={true} />
              </Box>
            </Link>
          ))}
          {showComingSoon && (
            <Box
              sx={{
                padding: pxToVw(16),
                backgroundColor: 'white',
                borderRadius: pxToVw(15),
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: pxToVw(15),
                  color: 'rgba(102, 102, 102, 1)',
                }}
              >
                即将推出
              </Typography>
            </Box>
          )}

          {/* 空状态 */}
          {questions.length === 0 && !showComingSoon && (
            <Box
              sx={{
                textAlign: 'center',
                paddingY: pxToVw(60),
              }}
            >
              <Typography
                sx={{
                  fontSize: pxToVw(14),
                }}
              >
                暂无问答
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MobileQaPage;
