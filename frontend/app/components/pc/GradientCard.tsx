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
        px: { lg: 0.75, xlg: 0.9, xl: 1, xxl: 1.2 },
        mt: `${(1 - idx) * 10}px`,
        height: {
          lg: `${300 + idx * 15}px`,
          xlg: `${395 + idx * 20}px`,
          xl: `${420 + idx * 20}px`,
          xxl: `${540 + idx * 25}px`,
        },
        borderRadius: '30px 30px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        cursor: 'pointer',
        width: { lg: 190, xlg: 230, xl: 262, xxl: 360 },
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
            minHeight: idx === 3 ? 500 : 260 + idx * 12,
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
        fontSize={{ lg: 24, xlg: 26, xl: 28, xxl: 38 }}
        fontWeight={500}
        textAlign='center'
        my={{ lg: 2.5, xlg: 3, xl: 4, xxl: 4.5 }}
      >
        {title}
      </Typography>

      <Typography
        color='rgba(102, 102, 102, 1)'
        fontSize={{ lg: 14, xlg: 15, xl: 16, xxl: 22 }}
        textAlign='justify'
        sx={{
          m: 0,
          pt: { lg: 2, xlg: 2.75, xl: 3, xxl: 3.5 },
          px: { lg: 2, xlg: 2.25, xl: 2.5, xxl: 3 },
          pb: 0,
          height: {
            lg: idx === 3 ? 234 : 214 + idx * 18,
            xlg: idx === 3 ? 315 : 270 + idx * 20,
            xl: idx === 3 ? 330 : 300 + idx * 25,
            xxl: idx === 3 ? 418 : 370 + idx * 32,
          },
          background: '#fff',
          borderRadius: '30px 30px 0 0',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp:
            idx === 3
              ? { xlg: 12, xl: 11, lg: 11, xxl: 12 }
              : { xlg: 22, xl: 20, lg: 18 },
          overflow: 'hidden',
          wordBreak: 'break-word',
          textOverflow: 'ellipsis',
          lineHeight: {
            lg: '20px',
            xlg: '24px',
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
