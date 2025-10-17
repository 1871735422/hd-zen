'use client';
import { Breadcrumbs, Link } from '@mui/material';
import NextLink from 'next/link';
import React, { createContext, useContext, useState } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  useContext?: boolean;
}

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
  const finalItems =
    useContext && extraBreadcrumb ? [...items, extraBreadcrumb] : items;

  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      sx={{ color: 'rgba(42, 130, 228, 1)', mb: 1, mx: 1 }}
    >
      {finalItems.map((item, index) => (
        <Link
          variant='subtitle2'
          key={index}
          component={NextLink}
          href={item.href || ''}
          underline='hover'
          color='inherit'
          fontSize={{ lg: 11, xl: 16, xxl: 18 }}
        >
          {item.label}
        </Link>
      ))}
    </Breadcrumbs>
  );
}

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [extraBreadcrumb, setExtraBreadcrumb] = useState<BreadcrumbItem | null>(
    null
  );

  return (
    <BreadcrumbContext.Provider value={{ extraBreadcrumb, setExtraBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
