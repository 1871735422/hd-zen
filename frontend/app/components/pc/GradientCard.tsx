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
          height: {
            xs: `${200 + idx * 20}px`,
            sm: `${240 + idx * 30}px`,
            md: `${280 + idx * 40}px`,
          },
          borderRadius: '30px 30px 0 0',
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'flex-start',
          cursor: 'pointer',
          width: { xs: 160, sm: 180, md: 200, lg: 210 },
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
          },
          zIndex: 10,
        }}
      >
        <Typography
          variant='h1'
          fontSize={{ xs: 16, sm: 18, md: 20 }}
          fontWeight={500}
          textAlign='center'
          my={{ xs: 1, sm: 1.5, md: 2 }}
        >
          {title}
        </Typography>
        <Box
          bgcolor='white'
          sx={{
            height: '100%',
            pb: { xs: 1, sm: 1.5, md: 2 },
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Typography
            fontSize={{ xs: 12, sm: 13, md: 14 }}
            sx={{
              m: 0,
              p: { xs: 1, sm: 1.5, md: 2 },
              pb: 0,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: { xs: 4 + idx, sm: 5 + idx, md: 6 + idx * 2 },
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
