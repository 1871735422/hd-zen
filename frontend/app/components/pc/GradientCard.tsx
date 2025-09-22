import { INNER_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

interface GradientCardProps {
  id: string;
  idx: number;
  title: string;
  description: string;
}

const HOVER_TEXT_COLOR = '#154399';
const HOVER_TEXT_COLOR_2 = '#2E2191';
const HOVER_TEXT_COLOR_3 = '#562999';

const GradientCard: React.FC<GradientCardProps> = ({
  id,
  idx,
  title,
  description,
}) => {
  return (
    <Link href={`/course/${id}`} style={{ textDecoration: 'none' }}>
      <Grid
        size={2}
        sx={{
          px: 0.5,
          mt: `${(1 - idx) * 10}px`,
          height: `${280 + idx * 40}px`,
          borderRadius: '30px 30px 0 0',
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'flex-start',
          cursor: 'pointer',
          width: 200,
          flexShrink: 0,
          color: INNER_TEXT_COLOR,
          background: `url(/images/card${idx + 1}.png) no-repeat center center`,
          backgroundSize: '100% 100%',
          '&:hover': {
            color:
              idx <= 3
                ? HOVER_TEXT_COLOR
                : idx === 4
                  ? HOVER_TEXT_COLOR_2
                  : HOVER_TEXT_COLOR_3,
            background: 'rgba(124, 134, 236, 0.3)',
            transform: 'scale(1.1)',
            transition: 'transform 0.5s ease-in-out',
            '& .description-text': {
              WebkitLineClamp: 'unset',
              overflow: 'visible',
            },
          },
          zIndex: 10,
        }}
      >
        <Typography
          variant='h1'
          fontSize={20}
          fontWeight={500}
          textAlign='center'
          my={2}
        >
          {title}
        </Typography>
        <Box
          bgcolor='white'
          sx={{
            height: '100%',
            pb: 2,
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Typography
            fontSize={14}
            className='description-text'
            sx={{
              m: 0,
              p: 2,
              pb: 0,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 6 + idx * 2,
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Grid>
    </Link>
  );
};

export default GradientCard;
