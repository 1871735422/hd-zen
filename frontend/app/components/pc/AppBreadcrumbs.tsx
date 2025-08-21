'use client';
import { Breadcrumbs, Link } from '@mui/material';
import NextLink from 'next/link';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  useContext?: boolean;
}

// 创建 Context 用于动态面包屑
const BreadcrumbContext = createContext<{
  extraBreadcrumb: BreadcrumbItem | null;
  setExtraBreadcrumb: (item: BreadcrumbItem | null) => void;
}>({
  extraBreadcrumb: null,
  setExtraBreadcrumb: () => {},
});

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}

export default function AppBreadcrumbs({
  items,
  useContext = false,
}: AppBreadcrumbsProps) {
  const { extraBreadcrumb } = useBreadcrumb();

  // 如果启用 Context 且有额外的面包屑，则合并
  const finalItems =
    useContext && extraBreadcrumb ? [...items, extraBreadcrumb] : items;
  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      sx={{
        color: 'rgba(42, 130, 228, 1)',
        mb: 1,
        pl: { xs: 2, sm: 0 },
        '& .MuiBreadcrumbs-separator': {
          mx: 1,
        },
      }}
    >
      {finalItems.map((item, index) => {
        return (
          <Link
            variant='subtitle2'
            key={index}
            component={NextLink}
            href={item.href || ''}
            underline='hover'
            color='inherit'
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

// 导出 Context Provider 组件
export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [extraBreadcrumb, setExtraBreadcrumbState] =
    useState<BreadcrumbItem | null>(null);

  const setExtraBreadcrumb = useCallback((item: BreadcrumbItem | null) => {
    setExtraBreadcrumbState(item);
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ extraBreadcrumb, setExtraBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
