'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { sharedButtonStyles } from '../shared/ButtonStyles';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  courseIds?: string[]; // Add course IDs array
}

export default function CategorySelector({
  categories,
  selectedCategory,
  courseIds = [],
}: CategorySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <ToggleButtonGroup
      value={selectedCategory}
      exclusive
      onChange={(_, value) => {
        if (value) {
          const categoryIndex = categories.indexOf(value);
          const courseId = courseIds[categoryIndex];
          if (courseId) {
            router.push(`/${pathname.split('/')[1]}/${courseId}`);
          } else {
            // Fallback to index-based routing if courseId not available
            router.push(`/${pathname.split('/')[1]}/${categoryIndex + 1}`);
          }
        } else if (pathname.includes('lesson')) {
          router.push(pathname.slice(0, pathname.lastIndexOf('/')));
        }
      }}
      aria-label='reference categories'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        px: 6.5,
        mx: 3,
        flexWrap: 'wrap',
        borderRadius: '80px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(300px)',
        mb: 2,
        '& .MuiToggleButtonGroup-grouped': {
          ...sharedButtonStyles,
          mx: 1,
          my: 0.3,
          px: 4,
          py: 1.3,
          color: STANDARD_TEXT_COLOR,
          fontSize: 16,
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
  );
}
