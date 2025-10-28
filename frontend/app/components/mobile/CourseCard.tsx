'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { pxToVw } from '../../utils/mobileUtils';

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
        borderRadius: pxToVw(12),
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        padding: pxToVw(16),
        marginBottom: pxToVw(16),
        display: 'flex',
        gap: pxToVw(16),
        alignItems: 'flex-start',
      }}
    >
      <Typography
        sx={{
          fontSize: pxToVw(18),
          fontWeight: 500,
          color: '#4A6B8A',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          lineHeight: 1.4,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: 'pointer' }}>
          <Collapse in={expanded} collapsedSize={pxToVw(58)} timeout='auto'>
            <Typography
              sx={{
                fontSize: pxToVw(14),
                color: '#4A6B8A',
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          </Collapse>
        </Box>

        <Box sx={{ textAlign: 'right', marginTop: pxToVw(4) }}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size='small'
            sx={{
              color: '#4A6B8A',
              transition: 'transform 0.3s',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: pxToVw(20) }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseCard;
