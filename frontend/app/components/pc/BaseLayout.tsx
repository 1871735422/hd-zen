import { Container, Typography } from '@mui/material';
import React from 'react';
import { TitleBanner } from '../shared';
import CategorySelector from './CategorySelector';

interface BaseLayoutProps {
  title: string;
  categories?: string[];
  selectedCategory?: string;
  description?: string;
  children: React.ReactNode;
}

function BaseLayout({
  title,
  categories,
  selectedCategory,
  description,
  children,
}: BaseLayoutProps) {
  return (
    <Container
      maxWidth={false}
      sx={{
        position: 'relative',
        m: 0,
        px: { lg: 25, xl: 32 },
        backgroundImage: `
          linear-gradient(180deg, rgba(224, 241, 255, 0.7) 0%, rgba(255, 255, 255, 0) 20.05%, rgba(217, 234, 252, 0.7) 33.35%, rgba(241, 247, 254, 0.7) 63.87%, rgba(245, 247, 251, 0.7) 100%),
          url(/images/course-bg-h.png),
          url(/images/course-lesson-bg.jpg)
        `,
        backgroundSize: 'cover, cover, contain',
        backgroundPosition: 'center, center, 0% -14%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <TitleBanner title={title} />
      {description && (
        <Typography
          fontSize={{ lg: 16, xl: 18 }}
          sx={{
            color: 'rgba(127, 173, 235, 1)',
            mt: -6,
            mb: 6,
            px: 3,
          }}
        >
          {description?.split('\n')[0]}
          <br />
          {description?.split('\n')[1]}
        </Typography>
      )}
      {categories && (
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory || categories[0]}
        />
      )}
      {children}
    </Container>
  );
}

export default BaseLayout;
