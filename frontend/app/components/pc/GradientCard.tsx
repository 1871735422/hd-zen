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
          sm: `${300 + idx * 15}px`,
          md: `${350 + idx * 18}px`,
          lg: `${299 + idx * 14}px`,
          xl: `${420 + idx * 20}px`,
          xxl: `${500 + idx * 25}px`,
        },
        borderRadius: '30px 30px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        cursor: 'pointer',
        width: { sm: 150, md: 170, lg: 186, xl: 262, xxl: 320 },
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
        fontSize={{ sm: 14, md: 16, lg: 20, xl: 28, xxl: 32 }}
        fontWeight={500}
        textAlign='center'
        my={{ sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
      >
        {title}
      </Typography>

      <Typography
        color='rgba(102, 102, 102, 1)'
        fontSize={{ sm: 10, md: 12, lg: 11, xl: 16, xxl: 18 }}
        sx={{
          m: 0,
          pt: { sm: 1.5, md: 2, lg: 3, xl: 3, xxl: 3.5 },
          pl: { sm: 1.5, md: 2, lg: 2.5, xl: 2.5, xxl: 3 },
          pr: { sm: 1.2, md: 1.8, lg: 2.2, xl: 2.2, xxl: 2.5 },
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
          WebkitLineClamp: idx === 3 ? 11 : 20,
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
