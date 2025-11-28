'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { sharedButtonStyles } from '../shared/ButtonStyles';

type Category = {
  label: string;
  slug: string;
};
interface CategorySelectorProps {
  categories: Category[];
  selectedIdx: number;
}

export default function CategorySelector({
  categories,
  selectedIdx,
}: CategorySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isQaPage = /^\/qa\/\d+\/lesson\d+$/.test(pathname);
  const hideQaLayout =
    isQaPage && categories.length === 6 && categories[0]?.label === '第一册';

  const getBtnPx = (zoom = 1) => {
    if (categories.length > 10) return 'auto';
    else if (categories.length > 6 || pathname.startsWith('/reference'))
      return 3 * zoom;
    else return 4 * zoom;
  };

  return (
    <>
      {!hideQaLayout && (
        <ToggleButtonGroup
          value={categories[selectedIdx]?.slug}
          exclusive
          onChange={(_, cateValue) => {
            // console.log({ isQaPage, cateValue, categories });

            // 当点击已选中的按钮时，不进行跳转
            if (!cateValue) return;

            if (isQaPage) {
              router.push(pathname.replace(/lesson\d+/, cateValue));
            } else {
              router.push(`/${pathname.split('/')[1]}/${cateValue}`);
            }
          }}
          aria-label='reference categories'
          sx={{
            display: 'flex',
            px: {
              sm: categories.length > 6 ? 1 : 2,
              md: categories.length > 6 ? 2 : 4,
              lg: categories.length > 6 ? 2 : 5,
              xl: categories.length > 6 ? 3 : 7,
              xxl: categories.length > 6 ? 4 : 8,
            },
            flexWrap: 'nowrap',
            overflowX: 'auto',
            borderRadius: '80px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(300px)',
            mb: { sm: 1, md: 1.5, lg: 2, xl: 3, xxl: 3.5 },
            '& .MuiToggleButtonGroup-grouped': {
              ...sharedButtonStyles,
              mx: categories.length > 10 ? 0.2 : 1,
              my: {
                sm: '2px',
                md: '2.5px',
                lg: '3px',
                xl: '3.5px',
                xxl: '4px',
              },
              px: {
                sm: getBtnPx(0.5),
                md: getBtnPx(0.7),
                lg: getBtnPx(),
                xl: getBtnPx(1.3),
                xxl: getBtnPx(1.5),
              },
              py: { sm: 0.5, md: 0.7, lg: 1, xl: 1.3, xxl: 1.5 },
              borderRadius: '80px',
              textWrap: 'nowrap',
              color: STANDARD_TEXT_COLOR,
              fontSize: { sm: 12, md: 14, lg: 14, xl: 20, xxl: 22 },
              fontWeight: 500,
              border: 'none',
              '&.Mui-selected': {
                background:
                  'linear-gradient(90deg, rgb(70, 135, 207) 0%,rgb(169, 206, 250) 100%)',
                color: 'white',
              },
            },
          }}
        >
          {categories.map(category => (
            <ToggleButton
              key={category.slug}
              value={category.slug}
              aria-label={category.label}
            >
              {category.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </>
  );
}
