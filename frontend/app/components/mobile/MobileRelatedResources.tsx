'use client';

import { MAIN_BLUE_COLOR } from '@/app/constants/colors';
import { Box, IconButton, Stack, SxProps, Typography } from '@mui/material';
import React, { useState } from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import ArrowTop from '../icons/ArrowTop';
import { labelItemList, SiderbarKey } from '../pc/LessonSidebar';

interface RelateResourceBtnProps {
  expanded: boolean;
  onClick: () => void;
}

interface MobileRelatedResourcesProps {
  onResourceClick?: (type: SiderbarKey) => void;
  selectedResource?: 'video' | 'audio' | 'article' | 'qa' | null;
  excludeLabels: (typeof labelItemList)[number]['label'][];
}

interface ResourceButtonProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  sx?: SxProps;
}

const btnPositions = [
  { left: pxToVw(8), top: pxToVw(0) },
  { left: pxToVw(52), top: pxToVw(42) },
  { left: pxToVw(52), bottom: pxToVw(42) },
  { left: pxToVw(8), bottom: pxToVw(0) },
];
// 相关资料按钮组件
const RelateResourceBtn: React.FC<RelateResourceBtnProps> = ({
  expanded,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: `${pxToVw(-46)}`,
        top: `calc(50% - ${pxToVw(34)})`,
        width: pxToVw(90),
        height: pxToVw(90),
        borderRadius: '50%',
        background: expanded
          ? '#fff'
          : 'linear-gradient(175.97deg, rgba(165, 209, 240, 1) 0%, rgba(173, 178, 247, 1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        paddingRight: pxToVw(7),
        gap: pxToVw(2),
        zIndex: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: pxToVw(14),
          fontWeight: 700,
          color: expanded ? 'rgba(86, 137, 204, 1)' : '#fff',
          writingMode: 'vertical-rl',
        }}
      >
        相关资料
      </Typography>
      <Stack
        sx={{
          transform: `rotate(${expanded ? '270deg' : '90deg'})`,
          color: expanded ? MAIN_BLUE_COLOR : '#fff',
          fontSize: pxToVw(10),
        }}
      >
        <ArrowTop />
      </Stack>
    </Box>
  );
};

// 资源按钮公共组件
const ResourceButton: React.FC<ResourceButtonProps> = ({
  icon,
  label,
  isSelected,
  onClick,
  sx,
}) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        width: pxToVw(55),
        height: pxToVw(55),
        borderRadius: '50%',
        background: isSelected
          ? 'linear-gradient(0deg, rgba(165, 209, 240, 1) 0%, rgba(173, 178, 247, 1) 100%)' // 选中时的深蓝色背景
          : '#fff', // 默认浅色背景
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected
          ? '0px 2px 20px  rgba(131, 181, 247, 0.3)'
          : '0px -10px 15px  rgba(255, 255, 255, 1)',
        transition: 'all 0.3s ease',
        color: '#fff',
        fontSize: pxToVw(22),
        '--icon-btn-stop1': isSelected ? '#fff' : 'rgba(120, 160, 210, 1)',
        '--icon-btn-stop2': isSelected ? '#fff' : 'rgba(180, 220, 255, 1)',
        ...sx,
      }}
    >
      {icon}
      <Typography
        sx={{
          fontSize: pxToVw(14),
          fontWeight: 700,
          mt: pxToVw(-1),
          color: isSelected
            ? 'rgba(255, 255, 255, 1)'
            : 'rgba(67, 109, 186, 1)',
        }}
      >
        {label}
      </Typography>
    </IconButton>
  );
};

const MobileRelatedResources: React.FC<MobileRelatedResourcesProps> = ({
  onResourceClick,
  selectedResource,
  excludeLabels,
}) => {
  const [expanded, setExpanded] = useState(false);
  const labelItems = labelItemList.filter(
    item => !excludeLabels.includes(item.label)
  );

  const defaultSelected = (
    labelItems.find(item => item.key === selectedResource) || labelItems[0]
  )?.key;

  // console.log({ labelItems });

  const handleResourceClick = (type: SiderbarKey) => {
    onResourceClick?.(type);
  };

  if (labelItems.length <= 1) {
    return null; // 如果没有按钮可显示，直接返回null
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0, // 改为左侧
        width: pxToVw(80),
        height: pxToVw(200),
        top: expanded ? pxToVw(210) : pxToVw(170),
        transform: 'translateY(-50%)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: 'rgba(247 250 254, 0.3)',
        borderRadius: '50%',
      }}
    >
      {/* 半圆按钮吸附在左侧 */}
      <RelateResourceBtn
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      />

      {/* 展开状态 */}
      {expanded && (
        <>
          {/* 四个按钮围绕半圆排列 */}
          {labelItems.map((item, idx) => {
            const isSelected = defaultSelected === item.key;
            return (
              <ResourceButton
                key={idx}
                icon={item.icon}
                label={item.label}
                isSelected={isSelected}
                onClick={() => handleResourceClick(item.key as SiderbarKey)}
                sx={btnPositions[idx]}
              />
            );
          })}
        </>
      )}
    </Box>
  );
};

export default MobileRelatedResources;
