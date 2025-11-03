'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import ArrowTop from '../icons/ArrowTop';

interface CourseCardProps {
  title: string;
  description: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: pxToVw(13),
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: pxToVw(16),
        display: 'flex',
        gap: pxToVw(16),
        alignItems: 'flex-start',
      }}
    >
      <Typography
        sx={{
          fontSize: pxToVw(20),
          fontWeight: 500,
          color: 'rgba(26, 41, 76, 1)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          lineHeight: 1.5,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          flex: 1,
          backgroundColor: 'white',
          padding: pxToVw(16),
          position: 'relative',
          borderRadius: `0 ${pxToVw(13)} ${pxToVw(13)} 0 `,
        }}
      >
        <Typography
          sx={{
            fontSize: pxToVw(16),
            color: 'rgba(102, 102, 102, 1)',
            lineHeight: 1.5,
            overflow: expanded ? 'visible' : 'hidden',
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 3,
            WebkitBoxOrient: expanded ? 'unset' : 'vertical',
            wordBreak: 'break-word',
          }}
        >
          {description}
        </Typography>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            position: 'absolute',
            fontSize: pxToVw(13),
            backgroundColor: 'rgba(237, 246, 255, 1)',
            borderRadius: `0 0 ${pxToVw(13)} 0 `,
            bottom: 0,
            right: 0,
            color: 'rgba(70, 114, 166, 1)',
            transition: 'transform 0.3s',
            transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        >
          <ArrowTop />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CourseCard;
