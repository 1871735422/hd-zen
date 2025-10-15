'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { sharedButtonStyles } from '../shared/ButtonStyles';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
}

export default function CategorySelector({
  categories,
  selectedCategory,
}: CategorySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isLessonPage = pathname?.startsWith('/qa/1/lesson');
  const hideQaLayout =
    isLessonPage && categories.length === 6 && categories[0] === '第一册';

  const getBtnPx = (zoom = 1) => {
    if (categories.length > 10) return 'auto';
    else if (categories.length > 6 || pathname.startsWith('/reference'))
      return 2 * zoom;
    else return 4 * zoom;
  };

  return (
    <>
      {!hideQaLayout && (
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={(_, value) => {
            if (!value) return;
            const categoryIndex = categories.indexOf(value);
            // console.log({ categoryIndex, isLessonPage, value, categories });

            if (isLessonPage) {
              router.push(
                pathname.replace(
                  /lesson\d+/,
                  `lesson${Math.max(1, categoryIndex + 1)}`
                )
              );
            } else if (pathname.includes('lesson')) {
              router.push(pathname.slice(0, pathname.lastIndexOf('/')));
            } else {
              router.push(`/${pathname.split('/')[1]}/${categoryIndex + 1}`);
            }
          }}
          aria-label='reference categories'
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: {
              sm: categories.length > 6 ? 1 : 2,
              md: categories.length > 6 ? 2 : 4,
              lg: categories.length > 6 ? 3 : 7,
              xl: categories.length > 6 ? 3 : 7,
              xxl: categories.length > 6 ? 4 : 8,
            },
            mx: { sm: 0.5, md: 0.8, lg: 1, xl: 1, xxl: 1.2 },
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
              fontSize: { sm: 12, md: 14, lg: 16, xl: 20, xxl: 22 },
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
            <ToggleButton key={category} value={category} aria-label={category}>
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </>
  );
}
