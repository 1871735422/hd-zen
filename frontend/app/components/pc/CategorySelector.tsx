'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

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
        justifyContent: 'center',
        flexWrap: 'wrap',
        borderRadius: '80px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(300px)',
        mb: 2,
        '& .MuiToggleButtonGroup-grouped': {
          borderRadius: '20px !important',
          mx: 1,
          my: 1,
          border: 'none',
          textTransform: 'none',
          padding: '5px 20px',
          color: '#333',
          '&.Mui-selected': {
            background:
              'linear-gradient(90deg, rgba(70, 134, 207, 1) 0%, rgba(170, 207, 250, 1) 100%)',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0041ad',
            },
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
