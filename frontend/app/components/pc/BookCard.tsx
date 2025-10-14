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
        width: { lg: 230, xl: 286 },
        height: { lg: 230 * 1.55, xl: 286 * 1.55 }, // 高度按比例
        mx: { lg: 1.5, xl: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: { lg: '24px', xl: '30px' },
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
            fontSize: { lg: 20, xl: 24 },
            fontWeight: '500',
            pt: idx === 3 ? { xl: 7, lg: 5 } : 12,
          },
          '&::after': {
            position: 'absolute',
            inset: 0,
            content: `'${description}'`,
            display: '-webkit-box',
            px: { lg: 3, xl: 4.5 },
            color: 'text.secondary',
            textAlign: 'left',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: { lg: 12, xl: 14 },
            fontWeight: '500',
            zIndex: 2,
            pointerEvents: 'none',
            pt: idx === 3 ? { xl: 14, lg: 10 } : 20,
            lineHeight: 1.8,
          },
        },
      }}
    >
      <CardMedia
        sx={{
          height: { lg: 230, xl: 286 },
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
          padding: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'rgba(70, 114, 166, 1)',
            fontSize: { lg: 20, xl: 24 },
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {title.endsWith('册') && '慧灯禅修'}
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            px: 1,
            color: 'text.secondary',
            textAlign: 'left',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            lineHeight: 2,
            fontSize: { lg: 11, xl: 14 },
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;
