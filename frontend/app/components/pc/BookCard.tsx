import { CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import React from 'react';

interface BookCardProps {
  idx: number;
  title: string;
  description: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, description, idx }) => {
  return (
    <Card
      component={'a'}
      href={`/course/${idx + 1}`}
      sx={{
        width: { sm: 180, md: 200, lg: 223, xl: 286, xxl: 320 },
        height: {
          sm: 180 * 1.55,
          md: 200 * 1.55,
          lg: 203 * 1.55,
          xl: 286 * 1.55,
          xxl: 320 * 1.55,
        }, // 高度按比例
        mx: { sm: 0.5, md: 1, lg: 1.5, xl: 2.5, xxl: 3 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: {
          sm: '16px',
          md: '20px',
          lg: '24px',
          xl: '30px',
          xxl: '36px',
        },
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease-in-out',
        position: 'relative',
        '&:hover': {
          transition:
            'max-height 0.4s ease-in-out, opacity 0.2s ease-in-out, margin 0.4s ease-in-out',
          '&::before': {
            position: 'absolute',
            inset: 0,
            content: `"${title.endsWith('册') ? '慧灯禅修' + title : title}"`,
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(2px)',
            zIndex: 1,
            pointerEvents: 'none',
            textAlign: 'center',
            color: 'rgba(70, 114, 166, 1)',
            fontSize: { sm: 16, md: 18, lg: 20, xl: 24, xxl: 28 },
            fontWeight: '500',
            pt:
              idx === 3
                ? { lg: 1.5, xlg: 2, xl: 7, xxl: 8 }
                : { sm: 3, md: 4, lg: 4, xl: 9, xxl: 12 },
          },
          '&::after': {
            position: 'absolute',
            inset: 0,
            content: `'${description}'`,
            display: '-webkit-box',
            px: { sm: 2, md: 2.5, lg: 3, xl: 4.5, xxl: 5 },
            color: 'text.secondary',
            textAlign: 'justify',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize:
              idx === 3
                ? { lg: 12, xlg: 12, xl: 15.5, xxl: 17.5 }
                : { lg: 13, xlg: 13, xl: 16, xxl: 18 },
            fontWeight: '500',
            zIndex: 2,
            pointerEvents: 'none',
            pt:
              idx === 3
                ? { lg: 5.5, xlg: 6, xl: 14, xxl: 16 }
                : { lg: 9, xlg: 9, xl: 17, xxl: 22 },
            lineHeight: idx === 3 ? { lg: 1.5, xlg: 1.5, xl: 1.4 } : 1.7,
          },
        },
      }}
    >
      <CardMedia
        sx={{
          height: { sm: 180, md: 200, lg: 203, xl: 286, xxl: 320 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={`/images/book_cover${idx + 1}.webp`}
          alt={title}
          fill
          sizes='100vw'
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
          priority={false}
        />
      </CardMedia>
      <CardContent
        sx={{
          backgroundColor: '#fff',
          padding: { sm: 1.5, md: 1.8, lg: 2, xl: 2.5, xxl: 3 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'rgba(70, 114, 166, 1)',
            fontSize: { sm: 16, md: 18, lg: 20, xl: 24, xxl: 28 },
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {title.endsWith('册') && '慧灯禅修'}
          {title}
        </Typography>
        <Typography
          sx={{
            mt: { lg: 1.5, xl: 1.8, xxl: 2 },
            px: { lg: 1, xl: 1.2, xxl: 1.5 },
            color: 'text.secondary',
            textAlign: 'justify',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            lineHeight: 1.7,
            fontSize: { lg: 13, xlg: 13, xl: 16, xxl: 18 },
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;
