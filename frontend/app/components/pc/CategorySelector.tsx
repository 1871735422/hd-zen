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

  const getBtnPx = () => {
    if (categories.length > 10) return 'auto';
    else if (categories.length > 6) return 2;
    else return 4;
  };

  return (
    <>
      {!hideQaLayout && (
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={(_, value) => {
            const categoryIndex = categories.indexOf(value);

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
            px: categories.length > 6 ? 3 : 7,
            mx: 1,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            borderRadius: '80px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(300px)',
            mb: 2,
            '& .MuiToggleButtonGroup-grouped': {
              ...sharedButtonStyles,
              mx: categories.length > 10 ? 0.2 : 1,
              my: 0.4,
              px: getBtnPx(),
              py: 1,
              textWrap: 'nowrap',
              color: STANDARD_TEXT_COLOR,
              fontSize: 16,
              fontWeight: 700,
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
