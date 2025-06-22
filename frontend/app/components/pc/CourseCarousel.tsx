'use client';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { LINK_COLOR } from '../../constants';
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
  const [startIndex, setStartIndex] = useState(0);
  const cardsToShow = 5;

  const handleNext = () => {
    setStartIndex(prev => Math.min(prev + 1, cards.length - cardsToShow));
  };

  const handlePrev = () => {
    setStartIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          height: '400px',
          alignItems: 'flex-end',
        }}
      >
        {cards.slice(startIndex, startIndex + cardsToShow).map((card, idx) => (
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
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          width: '100%',
          mr: 24,
        }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={startIndex === 0}
          sx={{
            backgroundColor: LINK_COLOR,
            color: 'white',
            '&:hover': {
              backgroundColor: LINK_COLOR,
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(229, 231, 235, 1)',
              color: 'rgba(55, 65, 81, 1)',
            },
          }}
        >
          <ArrowBackIosNewIcon fontSize='small' />
        </IconButton>
        <IconButton
          onClick={handleNext}
          disabled={startIndex >= cards.length - cardsToShow}
          sx={{
            backgroundColor: LINK_COLOR,
            color: 'white',
            '&:hover': {
              backgroundColor: LINK_COLOR,
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(229, 231, 235, 1)',
              color: 'rgba(55, 65, 81, 1)',
            },
          }}
        >
          <ArrowForwardIosIcon fontSize='small' />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CourseCarousel;
