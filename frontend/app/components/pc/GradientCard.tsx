import { INNER_TEXT_COLOR, STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Grid, Typography } from '@mui/material';
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
        px: { lg: 0.5, xl: 1 },
        mt: `${(1 - idx) * 10}px`,
        height: `${420 + idx * 20}px`,
        borderRadius: '30px 30px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        cursor: 'pointer',
        width: { lg: 200, xl: 262 },
        flexShrink: 0,
        position: 'relative',
        color: INNER_TEXT_COLOR,
        background: `linear-gradient(180deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.92) 95%, rgba(255,255,255,1) 100%), url(/images/card${idx + 1}.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.5s ease-in-out',
          '& .description-text': {
            minHeight: idx === 3 ? 484 : 280 + idx * 15,
            WebkitLineClamp: 99,
            color:
              idx <= 3
                ? HOVER_TEXT_COLOR
                : idx === 4
                  ? HOVER_TEXT_COLOR_2
                  : HOVER_TEXT_COLOR_3,
          },
        },
        zIndex: 10,
      }}
    >
      <Typography
        variant='h1'
        color={STANDARD_TEXT_COLOR}
        fontSize={{ lg: 20, xl: 32 }}
        fontWeight={500}
        textAlign='center'
        my={4}
      >
        {title}
      </Typography>

      <Typography
        color='rgba(102, 102, 102, 1)'
        fontSize={{ lg: 14, xl: 18 }}
        className='description-text'
        sx={{
          m: 0,
          pt: 3,
          pl: 2.5,
          pr: 2.2,
          pb: 0,
          height: idx === 3 ? 306 : 300 + idx * 25,
          background: '#fff',
          borderRadius: '30px 30px 0 0',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: idx === 3 ? 11 : 20,
          overflow: 'hidden',
          wordBreak: 'break-word',
          textOverflow: 'ellipsis',
          lineHeight: '28px',
        }}
      >
        {description}
      </Typography>
    </Grid>
  );
};

export default GradientCard;
