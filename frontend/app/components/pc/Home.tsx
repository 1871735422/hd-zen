import { Box, Typography } from '@mui/material';
import React from 'react';
import { pb } from '../../api';
import CourseCarousel, { CardData } from './CourseCarousel';

const TITLE_COLOR = 'rgba(64, 90, 133, 1)';
const DESC_TEXT_COLOR = 'rgba(59, 77, 115, 1)';

const Home: React.FC = async () => {
  const { items: cards } = await pb.collection('courses').getList(1, 10);

  return (
    <Box>
      <Box
        sx={{
          height: '60vh',
          width: '100%',
          backgroundImage: 'url(/images/sun-bg@2x.webp)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto 100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            width: '35%',
            backgroundImage: 'url(/images/sun-bg-mask@2x.webp)',
            backgroundSize: '100% auto',
            backgroundRepeat: 'no-repeat',
            // backdropFilter: 'blur(30px)',
          }}
        >
          <Typography
            variant='h1'
            fontWeight={600}
            fontSize={24}
            py={4}
            color={TITLE_COLOR}
          >
            慧灯禅修课简介
          </Typography>
          <Typography variant='body1' color={DESC_TEXT_COLOR} fontSize={18}>
            慧灯禅修课程简介
          </Typography>
        </Box>
      </Box>
      <CourseCarousel cards={cards as unknown as CardData[]} />
    </Box>
  );
};

export default Home;
