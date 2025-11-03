'use client';

import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { getCourses } from '../../api';
import CourseCard from './CourseCard';

/**
 * 移动端课程介绍模块
 * 包含三个课程册子的详细介绍
 */
const CourseIntroSection: React.FC = () => {
  interface MobileCardItem {
    title: string;
    description: string;
  }

  const [courseBooks, setCourseBooks] = useState<MobileCardItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async function loadCourses() {
      try {
        const { items } = await getCourses();
        if (!isMounted) return;
        const mapped: MobileCardItem[] = items.map(course => ({
          title: course.title,
          description: course.description || '',
        }));
        setCourseBooks(mapped);
      } catch (error) {
        console.error('Failed to load courses for mobile section:', error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        background: 'transparent',
      }}
    >
      {courseBooks.map((book, index) => (
        <CourseCard
          key={index}
          title={book.title}
          description={book.description}
        />
      ))}
    </Box>
  );
};

export default CourseIntroSection;
