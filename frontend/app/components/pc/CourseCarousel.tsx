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
        py: { lg: 8, xl: 10, xxl: 12 },
        mb: { lg: 10, xl: 12, xxl: 14 },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: { lg: 1, xl: 1.2, xxl: 1.5 },
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid
        container
        spacing={{ sm: 1, md: 1.5, lg: 2, xl: 2.5, xxl: 3 }}
        pb={{ sm: 6, md: 8, lg: 12, xl: 14, xxl: 16 }}
      >
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
