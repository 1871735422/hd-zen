'use client';

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
        }
      }}
      aria-label='reference categories'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        px: 6,
        flexWrap: 'wrap',
        borderRadius: '80px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(300px)',
        mb: 2,
        '& .MuiToggleButtonGroup-grouped': {
          ...sharedButtonStyles,
          mx: 1,
          my: 1,
          padding: '5px 20px',
          color: '#333',
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
