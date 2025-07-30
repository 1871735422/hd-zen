'use client';
import { CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { NAV_COLOR } from '../../constants';

interface BookCardProps {
  idx: number;
  title: string;
  description: string;
  cover: string;
  courseId?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  idx,
  title,
  description,
  cover,
  courseId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Card
      onClick={() => {
        // Use courseId if available, otherwise fall back to idx-based routing
        const targetPath = courseId 
          ? `/${pathname.split('/')[1]}/${courseId}` 
          : `/${pathname.split('/')[1]}/${idx + 1}`;
        router.push(targetPath);
      }}
      sx={{
        width: 200,
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        border: '1px solid #e3f2fd', // light blue
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
          fontSize: '14px',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 10,
          overflow: 'hidden',
          pb: 0,
        },
      }}
    >
      <CardMedia
        className='book-card-media'
        sx={{
          height: '192px',
          position: 'relative',
          overflow: 'hidden',
          transition:
            'max-height 0.4s ease-in-out, opacity 0.4s 0.2s ease-in-out, margin 0.4s ease-in-out',
        }}
      >
        <Image
          src={cover}
          alt={title}
          fill
          sizes='200px'
          style={{
            objectFit: 'cover',
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
            color: NAV_COLOR,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.3,
            fontSize: '16px',
          }}
        >
          {title}
        </Typography>
        <Typography
          className='description-normal'
          sx={{
            mt: 1.5,
            color: 'text.secondary',
            textAlign: 'left',
            fontSize: '14px',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
        <Typography className='description-hover'>{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;
