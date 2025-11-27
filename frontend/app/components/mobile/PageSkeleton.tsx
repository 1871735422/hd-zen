'use client';

import Box from '@mui/material/Box';
import Skeleton from './Skeleton';
import { pxToVw } from '../../utils/mobileUtils';

interface PageSkeletonProps {
  type?:
    | 'home'
    | 'course'
    | 'qa'
    | 'reference'
    | 'download'
    | 'ask'
    | 'default';
}

export default function PageSkeleton({ type = 'home' }: PageSkeletonProps) {
  const renderHomeSkeleton = () => (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'linear-gradient(180deg, rgba(187, 218, 249, 1) 0%, rgba(187, 218, 249, 1) 73.89%, rgba(210, 230, 248, 1) 100%)',
      }}
    >
      {/* Hero 图片骨架 */}
      <Skeleton
        width='100%'
        height={pxToVw(300)}
        variant='rectangular'
        animation='wave'
        sx={{ objectFit: 'contain' }}
      />

      {/* 内容区域骨架 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingX: pxToVw(17),
          mt: pxToVw(-40),
        }}
      >
        {/* 标题骨架 */}
        <Box
          sx={{
            width: '100%',
            maxWidth: pxToVw(310),
            mb: pxToVw(16),
          }}
        >
          <Skeleton
            width='80%'
            height={pxToVw(24)}
            variant='text'
            animation='pulse'
            sx={{ mb: pxToVw(16) }}
          />

          {/* 描述文本骨架 */}
          <Skeleton
            width='100%'
            height={pxToVw(16)}
            variant='text'
            animation='wave'
            sx={{ mb: pxToVw(4) }}
          />
          <Skeleton
            width='95%'
            height={pxToVw(16)}
            variant='text'
            animation='wave'
            sx={{ mb: pxToVw(4) }}
          />
          <Skeleton
            width='90%'
            height={pxToVw(16)}
            variant='text'
            animation='wave'
            sx={{ mb: pxToVw(4) }}
          />
          <Skeleton
            width='85%'
            height={pxToVw(16)}
            variant='text'
            animation='wave'
          />
        </Box>

        {/* 课程介绍卡片骨架 */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: pxToVw(12),
            mt: pxToVw(20),
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: pxToVw(12),
                padding: pxToVw(16),
                backdropFilter: 'blur(10px)',
              }}
            >
              <Skeleton
                width='70%'
                height={pxToVw(18)}
                variant='text'
                animation='pulse'
                sx={{ mb: pxToVw(8) }}
              />
              <Skeleton
                width='100%'
                height={pxToVw(14)}
                variant='text'
                animation='wave'
                sx={{ mb: pxToVw(4) }}
              />
              <Skeleton
                width='95%'
                height={pxToVw(14)}
                variant='text'
                animation='wave'
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderCourseSkeleton = () => (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: pxToVw(16),
      }}
    >
      {/* 课程标题骨架 */}
      <Skeleton
        width='80%'
        height={pxToVw(28)}
        variant='text'
        animation='pulse'
        sx={{ mb: pxToVw(20) }}
      />

      {/* 课程列表骨架 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(12) }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              background: '#fff',
              borderRadius: pxToVw(8),
              padding: pxToVw(16),
              display: 'flex',
              alignItems: 'center',
              gap: pxToVw(12),
            }}
          >
            <Skeleton
              width={pxToVw(60)}
              height={pxToVw(60)}
              variant='rectangular'
              animation='wave'
              sx={{ borderRadius: pxToVw(8) }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                width='90%'
                height={pxToVw(16)}
                variant='text'
                animation='pulse'
                sx={{ mb: pxToVw(4) }}
              />
              <Skeleton
                width='70%'
                height={pxToVw(12)}
                variant='text'
                animation='wave'
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderQaSkeleton = () => (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: pxToVw(16),
      }}
    >
      {/* QA 标题骨架 */}
      <Skeleton
        width='75%'
        height={pxToVw(28)}
        variant='text'
        animation='pulse'
        sx={{ mb: pxToVw(20) }}
      />

      {/* QA 列表骨架 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(12) }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              background: '#fff',
              borderRadius: pxToVw(8),
              padding: pxToVw(16),
            }}
          >
            {/* 问题骨架 */}
            <Skeleton
              width='95%'
              height={pxToVw(16)}
              variant='text'
              animation='pulse'
              sx={{ mb: pxToVw(8) }}
            />
            {/* 答案骨架 */}
            <Skeleton
              width='100%'
              height={pxToVw(14)}
              variant='text'
              animation='wave'
              sx={{ mb: pxToVw(4) }}
            />
            <Skeleton
              width='90%'
              height={pxToVw(14)}
              variant='text'
              animation='wave'
              sx={{ mb: pxToVw(4) }}
            />
            <Skeleton
              width='85%'
              height={pxToVw(14)}
              variant='text'
              animation='wave'
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderDownloadSkeleton = () => (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: pxToVw(16),
      }}
    >
      {/* 下载标题骨架 */}
      <Skeleton
        width='60%'
        height={pxToVw(28)}
        variant='text'
        animation='pulse'
        sx={{ mb: pxToVw(20) }}
      />

      {/* 下载列表骨架 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(12) }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              background: '#fff',
              borderRadius: pxToVw(8),
              padding: pxToVw(16),
              display: 'flex',
              alignItems: 'center',
              gap: pxToVw(12),
            }}
          >
            {/* 序号骨架 */}
            <Skeleton
              width={pxToVw(24)}
              height={pxToVw(24)}
              variant='circular'
              animation='pulse'
            />
            {/* 文件名骨架 */}
            <Box sx={{ flex: 1 }}>
              <Skeleton
                width='80%'
                height={pxToVw(16)}
                variant='text'
                animation='pulse'
              />
            </Box>
            {/* 下载按钮骨架 */}
            <Box sx={{ display: 'flex', gap: pxToVw(8) }}>
              {['PDF', 'EPUB', 'Audio'].map(type => (
                <Skeleton
                  key={type}
                  width={pxToVw(40)}
                  height={pxToVw(32)}
                  variant='rectangular'
                  animation='wave'
                  sx={{ borderRadius: pxToVw(4) }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderReferenceSkeleton = () => (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: pxToVw(16),
      }}
    >
      {/* 参考标题骨架 */}
      <Skeleton
        width='70%'
        height={pxToVw(28)}
        variant='text'
        animation='pulse'
        sx={{ mb: pxToVw(20) }}
      />

      {/* 参考卡片网格骨架 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: pxToVw(12),
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              background: '#fff',
              borderRadius: pxToVw(8),
              padding: pxToVw(12),
              display: 'flex',
              flexDirection: 'column',
              gap: pxToVw(8),
            }}
          >
            <Skeleton
              width='100%'
              height={pxToVw(80)}
              variant='rectangular'
              animation='wave'
              sx={{ borderRadius: pxToVw(4) }}
            />
            <Skeleton
              width='90%'
              height={pxToVw(14)}
              variant='text'
              animation='pulse'
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderAskSkeleton = () => (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: pxToVw(16),
      }}
    >
      {/* 提问标题骨架 */}
      <Skeleton
        width='65%'
        height={pxToVw(28)}
        variant='text'
        animation='pulse'
        sx={{ mb: pxToVw(20) }}
      />

      {/* 提问表单骨架 */}
      <Box
        sx={{
          background: '#fff',
          borderRadius: pxToVw(8),
          padding: pxToVw(16),
          mb: pxToVw(20),
        }}
      >
        <Skeleton
          width='100%'
          height={pxToVw(120)}
          variant='rectangular'
          animation='wave'
          sx={{ borderRadius: pxToVw(4), mb: pxToVw(12) }}
        />
        <Skeleton
          width='80%'
          height={pxToVw(40)}
          variant='rectangular'
          animation='pulse'
          sx={{ borderRadius: pxToVw(20) }}
        />
      </Box>

      {/* 历史问题骨架 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(12) }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              background: '#fff',
              borderRadius: pxToVw(8),
              padding: pxToVw(16),
            }}
          >
            <Skeleton
              width='95%'
              height={pxToVw(16)}
              variant='text'
              animation='pulse'
              sx={{ mb: pxToVw(8) }}
            />
            <Skeleton
              width='100%'
              height={pxToVw(14)}
              variant='text'
              animation='wave'
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderDefaultSkeleton = () => (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: pxToVw(16),
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToVw(16) }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            width='100%'
            height={pxToVw(80)}
            variant='rectangular'
            animation='wave'
            sx={{ borderRadius: pxToVw(8) }}
          />
        ))}
      </Box>
    </Box>
  );

  switch (type) {
    case 'home':
      return renderHomeSkeleton();
    case 'course':
      return renderCourseSkeleton();
    case 'qa':
      return renderQaSkeleton();
    case 'download':
      return renderDownloadSkeleton();
    case 'reference':
      return renderReferenceSkeleton();
    case 'ask':
      return renderAskSkeleton();
    default:
      return renderDefaultSkeleton();
  }
}
