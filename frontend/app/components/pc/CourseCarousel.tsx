'use client';

import { Box, Grid } from '@mui/material';
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
        mb: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 1,
        width: '100%',
        minHeight: 30,
        overflow: 'hidden',
      }}
    >
      <Grid container spacing={2}>
        {cards.map((card, idx) => (
          <GradientCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            idx={idx}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default CourseCarousel;
