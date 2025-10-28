'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { pxToVw } from '../../utils/mobileUtils';

export interface ButtonNavItem {
  label: string;
  value: string;
  active?: boolean;
}

interface ButtonNavigationProps {
  items: ButtonNavItem[];
  onChange?: (value: string) => void;
}

/**
 * 移动端按钮导航组件
 * 用于课程详情页的二级导航（如：第一册、第二册等）
 *
 * 设计特点：
 * - 激活状态：蓝色背景 + 白色文字
 * - 非激活：白色背景 + 黑色文字 + 圆角边框
 */
export default function ButtonNavigation({
  items,
  onChange,
}: ButtonNavigationProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: pxToVw(12),
        px: pxToVw(20),
        py: pxToVw(16),
        backgroundColor: '#fff',
      }}
    >
      {items.map(item => (
        <Button
          key={item.value}
          onClick={() => onChange?.(item.value)}
          sx={{
            minWidth: 'auto',
            paddingX: pxToVw(16),
            paddingY: pxToVw(8),
            fontSize: pxToVw(14),
            fontWeight: item.active ? 500 : 400,
            color: item.active ? '#fff' : '#333',
            backgroundColor: item.active ? '#1976D2' : '#fff',
            border: item.active ? 'none' : `1px solid #E0E0E0`,
            borderRadius: pxToVw(8),
            textTransform: 'none',
            '&:hover': {
              backgroundColor: item.active ? '#1565C0' : '#F5F5F5',
            },
            transition: 'all 0.2s',
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
}
