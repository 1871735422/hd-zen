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
        p: 1,
        pb: 0,
        height: `${280 + idx * 40}px`,
        background: gradient,
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        width: 220,
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
          color='text.secondary'
          sx={{
            m: 0,
            p: 2,
            pb: 0,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 6 + idx * 2, // 严格限制12行
            overflow: 'hidden',
            lineHeight: 1.8,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default GradientCard;
