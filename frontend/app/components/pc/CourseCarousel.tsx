'use client';

import { Box } from '@mui/material';
import React from 'react';
import GradientCard from './GradientCard';

export interface CardData {
  id: string;
  title: string;
  description: string;
  gradient?: string;
}

interface CourseCarouselProps {
  cards: CardData[];
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ cards }) => {
  return (
    <Box
      sx={{
        py: { xs: 2, sm: 4, md: 6 },
        mb: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        height: { xs: '300px', sm: '350px', md: '400px' },
        overflow: 'hidden',
      }}
    >
      {cards.map((card, idx) => (
        <GradientCard
          key={card.id}
          gradient={
            card.gradient ||
            'linear-gradient(180deg, rgba(124, 134, 236, 0.3) 0%, rgba(255, 255, 255, 0.6) 100%)'
          }
          title={card.title}
          description={card.description}
          idx={idx}
        />
      ))}
    </Box>
  );
};

export default CourseCarousel;
