import { Box, Typography } from '@mui/material';
import React from 'react';

interface GradientCardProps {
  idx: number;
  gradient: string;
  title: string;
  description: string;
}

const GradientCard: React.FC<GradientCardProps> = ({
  gradient,
  idx,
  title,
  description,
}) => {
  return (
    <Box
      sx={{
        px: { xs: 0.5, sm: 1 },
        mt: `${(1 - idx) * 10}px`,
        height: {
          xs: `${200 + idx * 20}px`,
          sm: `${240 + idx * 30}px`,
          md: `${280 + idx * 40}px`
        },
        background: gradient,
        borderRadius: '30px 30px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        width: { xs: 160, sm: 180, md: 220, lg: 260 },
        flexShrink: 0,
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
          color='text.secondary'
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
    </Box>
  );
};

export default GradientCard;
