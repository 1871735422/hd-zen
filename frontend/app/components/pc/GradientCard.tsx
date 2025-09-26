import { INNER_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Grid, Typography } from '@mui/material';
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
    <Grid
      size={2}
      component={'a'}
      href={`/course/${id}`}
      sx={{
        px: 0.5,
        mt: `${(1 - idx) * 10}px`,
        height: `${320 + idx * 20}px`,
        borderRadius: '30px 30px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        cursor: 'pointer',
        width: 200,
        flexShrink: 0,
        position: 'relative',
        color: INNER_TEXT_COLOR,
        backgroundImage: `url(/images/card${idx + 1}.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
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
        sx={{
          height: '100%',
          pb: 2,
          borderRadius: '16px 16px 0 0',
          background:
            'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 77.5%, rgba(255,255,255,0) 100%)',
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
  );
};

export default GradientCard;
