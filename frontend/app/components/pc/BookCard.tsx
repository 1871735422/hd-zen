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

const width = 230;
const BookCard: React.FC<BookCardProps> = ({ title, description, idx }) => {
  return (
    <Card
      component={'a'}
      href={`/course/${idx + 1}`}
      sx={{
        width,
        height: width * 1.5,
        mx: 1.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '24px',
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease-in-out',
        '&:hover': {
          background: 'linear-gradient(180deg, #f2f8ff 0%, #ffffff 100%)',
        },
        '&:hover .book-card-media': {
          maxHeight: 0,
          opacity: 0,
          marginTop: 0,
          marginBottom: 0,
          transition:
            'max-height 0.4s ease-in-out, opacity 0.2s ease-in-out, margin 0.4s ease-in-out',
        },
        '&:hover .MuiCardContent-root': {
          backgroundColor: 'transparent',
        },
        '& .description-normal': {
          display: '-webkit-box',
        },
        '& .description-hover': {
          display: 'none',
        },
        '&:hover .description-normal': {
          display: 'none',
        },
        '&:hover .description-hover': {
          display: '-webkit-box',
          mt: 1.5,
          color: 'text.secondary',
          textAlign: 'left',
          WebkitBoxOrient: 'vertical',
          // WebkitLineClamp: 10,·
          overflow: 'hidden',
          pb: 0,
        },
      }}
    >
      <CardMedia
        className='book-card-media'
        sx={{
          height: width,
          position: 'relative',
          overflow: 'hidden',
          transition:
            'max-height 0.4s ease-in-out, opacity 0.4s 0.2s ease-in-out, margin 0.4s ease-in-out',
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
          transition: 'background-color 0.3s ease-in-out',
          padding: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          sx={{
            color: 'rgba(70, 114, 166, 1)',
            fontSize: 20,
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {title.endsWith('册') && '慧灯禅修'}
          {title}
        </Typography>
        <Typography
          fontSize={11}
          className='description-normal'
          sx={{
            mt: 1.5,
            px: 1,
            color: 'text.secondary',
            textAlign: 'left',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            lineHeight: 2,
          }}
        >
          {description}
        </Typography>
        <Typography fontSize={11} className='description-hover'>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;
