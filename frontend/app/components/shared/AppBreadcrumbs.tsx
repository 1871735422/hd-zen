'use client';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Breadcrumbs, Link } from '@mui/material';
import NextLink from 'next/link';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDevice } from '../DeviceProvider';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  useContext?: boolean;
  color?: string;
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
  color = 'rgba(42, 130, 228, 1)',
}: AppBreadcrumbsProps) {
  const { extraBreadcrumb } = useBreadcrumb();
  const { deviceType } = useDevice();
  const finalItems =
    useContext && extraBreadcrumb ? [...items, extraBreadcrumb] : items;

  const [shouldAddMargin, setShouldAddMargin] = useState(false);
  const breadcrumbsRef = useRef<HTMLOListElement>(null);

  // 检测最后一个面包屑项是否换行（第二行）
  useEffect(() => {
    const checkIfWrapped = () => {
      if (!breadcrumbsRef.current || !items || items.length <= 3) {
        setShouldAddMargin(false);
        return;
      }

      const container = breadcrumbsRef.current;

      // 获取第一个和最后一个列表项的位置
      const listItems = container.querySelectorAll('.MuiBreadcrumbs-li');
      const firstItem = listItems[0] as HTMLElement;
      const lastItem = listItems[listItems.length - 1] as HTMLElement;

      if (!firstItem || !lastItem) {
        setShouldAddMargin(false);
        return;
      }

      const firstItemTop = firstItem.offsetTop;
      const lastItemTop = lastItem.offsetTop;

      // 如果最后一个项目与第一个项目不在同一行（top 位置不同），说明换行了
      const isWrapped = lastItemTop > firstItemTop;
      setShouldAddMargin(isWrapped);
    };

    // 延迟检查，确保 DOM 已渲染
    const timer = setTimeout(checkIfWrapped, 0);
    checkIfWrapped();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIfWrapped);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkIfWrapped);
    };
  }, [items]);

  const isMobile = deviceType === 'mobile';

  return (
    <Breadcrumbs
      ref={breadcrumbsRef}
      className='breadcrum'
      aria-label='breadcrumb'
      sx={{
        color,
        mb: 1,
        mx: 1,
        // 如果最后一个面包屑项换行了（第二行），给第二行添加左边距（仅移动端）
        ...(isMobile && shouldAddMargin
          ? {
              '& .MuiBreadcrumbs-li:last-child a': {
                paddingLeft: pxToVw(23),
              },
            }
          : {}),
      }}
    >
      {finalItems.map((item, index) => (
        <Link
          variant='subtitle2'
          key={index}
          component={NextLink}
          href={item.href || ''}
          underline='hover'
          color='inherit'
          fontSize={isMobile ? pxToVw(13) : { lg: 13, xl: 16, xxl: 18 }}
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
