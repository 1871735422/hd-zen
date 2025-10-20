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
        px: { sm: 0.2, md: 0.3, lg: 0.71, xl: 1, xxl: 1.2 },
        mt: `${(1 - idx) * 10}px`,
        height: {
          lg: `${300 + idx * 15}px`,
          xl: `${420 + idx * 20}px`,
          xxl: `${540 + idx * 25}px`,
        },
        borderRadius: '30px 30px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        cursor: 'pointer',
        width: { sm: 150, md: 170, lg: 206, xl: 262, xxl: 360 },
        flexShrink: 0,
        position: 'relative',
        color: INNER_TEXT_COLOR,
        background: `linear-gradient(180deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.92) 95%, rgba(255,255,255,1) 100%), url(/images/card${idx + 1}.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.5s ease-in-out',
          '& .MuiTypography-root:last-child': {
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
        color={STANDARD_TEXT_COLOR}
        fontSize={{ sm: 14, md: 16, lg: 24, xl: 28, xxl: 38 }}
        fontWeight={500}
        textAlign='center'
        my={{ sm: 2, md: 2, lg: 3, xl: 4, xxl: 4.5 }}
      >
        {title}
      </Typography>

      <Typography
        color='rgba(102, 102, 102, 1)'
        fontSize={{ sm: 10, md: 12, lg: 13, xl: 16, xxl: 22 }}
        textAlign='justify'
        sx={{
          m: 0,
          pt: { sm: 1.5, md: 2, lg: 2, xl: 3, xxl: 3.5 },
          px: { sm: 1.5, md: 2, lg: 2, xl: 2.5, xxl: 3 },
          pb: 0,
          height: {
            sm: idx === 3 ? 200 : 180 + idx * 15,
            md: idx === 3 ? 250 : 220 + idx * 18,
            lg: idx === 3 ? 218 : 214 + idx * 18,
            xl: idx === 3 ? 306 : 300 + idx * 25,
            xxl: idx === 3 ? 380 : 370 + idx * 32,
          },
          background: '#fff',
          borderRadius: '30px 30px 0 0',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: idx === 3 ? { xl: 11, lg: 10 } : { xl: 20, lg: 18 },
          overflow: 'hidden',
          wordBreak: 'break-word',
          textOverflow: 'ellipsis',
          lineHeight: {
            sm: '18px',
            md: '22px',
            lg: '20px',
            xl: '28px',
            xxl: '32px',
          },
        }}
      >
        {description}
      </Typography>
    </Grid>
  );
};

export default GradientCard;
