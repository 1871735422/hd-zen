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
        py: { lg: 8, xl: 10 },
        mb: { lg: 10, xl: 12 },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: { lg: 1, xl: 1.2 },
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid container spacing={{ lg: 2, xl: 2.5 }} pb={{ lg: 12, xl: 14 }}>
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
