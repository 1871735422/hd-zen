import { Box, Container, Typography } from '@mui/material';
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
      maxWidth={'xxl'}
      sx={{
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        m: 0,
        p: '0 !important',
        backgroundImage: `
          linear-gradient(180deg, rgba(224, 241, 255, 0.7) 0%, rgba(255, 255, 255, 0) 20.05%, rgba(217, 234, 252, 0.7) 33.35%, rgba(241, 247, 254, 0.7) 63.87%, rgba(245, 247, 251, 0.7) 100%),
          url(/images/course-bg-h.webp),
          url(/images/course-lesson-bg.webp)
        `,
        backgroundSize: 'cover, cover, contain',
        backgroundPosition: 'center, center, 0% -14%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          minWidth: { lg: 1060, xlg: 1080, xl: 1400, xxl: 1420 },
          maxWidth: { lg: 1060, xlg: 1080, xl: 1400, xxl: 1420 },
        }}
      >
        <TitleBanner title={title} />
        {description && (
          <Typography
            fontSize={{ sm: 12, md: 14, lg: 14, xl: 18, xxl: 24 }}
            sx={{
              color: 'rgba(127, 173, 235, 1)',
              mt: { sm: -3, md: -4, lg: -4.3, xl: -6, xxl: -8 },
              mb: { sm: 3, md: 4, lg: 4.3, xl: 6, xxl: 8 },
              px: { sm: 1.5, md: 2, lg: 2.1, xl: 3, xxl: 4 },
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
      </Box>
    </Container>
  );
}

export default BaseLayout;
