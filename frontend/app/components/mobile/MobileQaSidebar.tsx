'use client';

import { MAIN_BLUE_COLOR, STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { clearCourseTitle } from '@/app/utils/courseUtils';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import ArrowTop from '../icons/ArrowTop';

interface MobileQaSidebarProps {
  items: { label: string; path?: string; displayOrder: number }[];
  selectedIdx: number;
  onSelect?: (index: number) => void;
  expanded?: boolean;
  onClose?: () => void;
}

const MobileQaSidebar: React.FC<MobileQaSidebarProps> = ({
  items,
  selectedIdx,
  onSelect,
  expanded = true,
  onClose,
}) => {
  return (
    <Box
      sx={{
        width: expanded ? pxToVw(128) : pxToVw(0),
        flexShrink: 0,
        background:
          'linear-gradient(175.97deg, rgba(232, 247, 255, 1) 0%, rgba(224, 226, 255, 1) 99.94%)',
        borderRadius: `0 ${pxToVw(20)} 0 0`,
        overflow: 'hidden',
        pt: pxToVw(40),
        transition: 'width 0.3s ease-in-out',
        '&:before': expanded
          ? {
              content: '""',
              position: 'absolute',
              top: pxToVw(-2),
              left: 0,
              borderRadius: `0 ${pxToVw(20)} 0 0`,
              width: `calc(100% + ${pxToVw(9)})`,
              height: `calc(100% + ${pxToVw(2)})`,
              background: '#fff',
              zIndex: -1,
            }
          : {},
      }}
    >
      {expanded && (
        <IconButton
          sx={{
            position: 'absolute',
            top: pxToVw(14),
            left: `calc(50% - ${pxToVw(27)} / 2)`,
            zIndex: 100,
            color: STANDARD_TEXT_COLOR,
            fontSize: pxToVw(11),
          }}
          onClick={onClose}
        >
          <ArrowTop />
        </IconButton>
      )}
      {items.map((item, idx) => {
        const isSelected = selectedIdx === idx;

        // 内容组件
        const content = (
          <Box
            sx={{
              minHeight: pxToVw(50),
              marginLeft: pxToVw(5),
              mb: pxToVw(10),
              background: isSelected ? 'white !important' : 'transparent',
              borderRadius: isSelected
                ? `${pxToVw(30)} 0 0 ${pxToVw(30)}`
                : 'none',
              borderRight: isSelected ? `${pxToVw(8)} solid #fff` : 'none',
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              pl: pxToVw(12),
              pr: pxToVw(8),
              cursor: 'pointer',
              textAlign: 'justify',
              '&:before': isSelected
                ? {
                    position: 'absolute',
                    top: pxToVw(-20),
                    right: pxToVw(-8),
                    content: '""',
                    background: '#fff',
                    height: pxToVw(20),
                    width: pxToVw(20),
                    WebkitMask:
                      'radial-gradient(100% 100% at 0% 0%, transparent 0 100%, white 100%)',
                    mask: 'radial-gradient(100% 100% at 0% 0%, transparent 0 100%, white 100%)',
                  }
                : {},
              '&:after': isSelected
                ? {
                    position: 'absolute',
                    bottom: pxToVw(-20),
                    right: pxToVw(-8),
                    content: '""',
                    background: '#fff',
                    height: pxToVw(20),
                    width: pxToVw(20),
                    WebkitMask:
                      'radial-gradient(100% 100% at 0% 100%, transparent 0 100%, white 100%)',
                    mask: 'radial-gradient(100% 100% at 0% 100%, transparent 0 100%, white 100%)',
                  }
                : {},
            }}
          >
            <Avatar
              sx={{
                color: !isSelected ? MAIN_BLUE_COLOR : '#fff',
                bgcolor: isSelected ? MAIN_BLUE_COLOR : '#fff',
                width: pxToVw(18),
                height: pxToVw(18),
                mr: pxToVw(6),
              }}
            >
              <Typography fontSize={pxToVw(12)} fontWeight={700}>
                {item.displayOrder}
              </Typography>
            </Avatar>
            <Typography
              fontWeight={isSelected ? 700 : 'inherit'}
              fontSize={pxToVw(12)}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
                color: isSelected
                  ? 'rgba(86, 137, 204, 1)'
                  : STANDARD_TEXT_COLOR,
              }}
            >
              {clearCourseTitle(item.label)}
            </Typography>
          </Box>
        );

        // 如果有 onSelect 回调，使用回调模式
        if (onSelect) {
          return (
            <Box
              key={idx}
              onClick={() => onSelect(idx)}
              sx={{ cursor: 'pointer' }}
            >
              {content}
            </Box>
          );
        }

        // 否则使用 Link 模式
        return (
          <Link
            key={idx}
            href={item.path || '#'}
            style={{ textDecoration: 'none' }}
          >
            {content}
          </Link>
        );
      })}
    </Box>
  );
};

export default MobileQaSidebar;
