'use client';
import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { formatDate } from '@/app/utils/courseUtils';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CustomPagination, SearchBox } from '../shared';

export interface RefCourse {
  topicTitle: string;
  topicUrl: string;
  courseName: string;
  courseUrl: string;
  date: string;
}

export interface TagRelationProps {
  tag: string;
  refCourses: RefCourse[];
}

export default function TagRelation({ tag, refCourses }: TagRelationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const totalPages = Math.ceil(refCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = refCourses.slice(startIndex, endIndex);
  const router = useRouter();

  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          inset: 0,
          // 渐变背景 - 从上到下的多层渐变效果
          background: `
            linear-gradient(
              180deg,
              rgba(224, 241, 255, 1) 0%,
              rgba(255, 255, 255, 0) 20.05%,
              rgba(217, 234, 252, 1) 33.35%,
              rgba(241, 247, 254, 1) 63.87%,
              rgba(245, 247, 251, 1) 100%
            ),
            url(/images/search-bg.webp) no-repeat center center / cover
          `,
          // 模糊效果 - 创建背景虚化
          filter: 'blur(40px)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '55%',
          mr: '30%',
          ml: '15%',
          px: 2,
        }}
      >
        <Stack spacing={2} mt={2} mb={2}>
          <SearchBox
            onSearch={(query: string) => {
              router.push(`/tags?tag=${encodeURIComponent(query || tag)}`);
            }}
          />
        </Stack>
        {/* 页面标题 */}
        <Typography
          sx={{
            fontSize: { lg: 18, xl: 26, xxl: 30 },
            fontWeight: 500,
            color: STANDARD_TEXT_COLOR,
            mb: 1,
            mt: 5,
            pl: 1,
          }}
        >
          标签: {tag}
        </Typography>
        <Card
          sx={{
            borderRadius: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            pb: totalPages > 1 ? 0 : 5,
          }}
        >
          <CardContent
            sx={{
              pt: 3,
              px: 5,
            }}
          >
            {/* 分页控制 */}
            <Box
              sx={{
                pb: 3,
                width: 300,
                float: 'right',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                '& .MuiTypography-root': {
                  fontSize: { lg: 13, xl: 16, xxl: 18 },
                },
                '& .MuiSelect-select': {
                  fontSize: { lg: 10, xl: 14, xxl: 16 },
                  color: STANDARD_TEXT_COLOR,
                  py: '2px',
                },
              }}
            >
              <Typography color='text.secondary'>
                第 {currentPage} 页 &nbsp; 共 {totalPages} 页
              </Typography>
              <Typography color='text.secondary'>每页显示条数</Typography>
              <FormControl size='small' sx={{ minWidth: 70 }}>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  displayEmpty
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* 内容表格 */}
            <TableContainer
              sx={{
                margin: '0 auto',
                fontSize: { lg: 13, xl: 18, xxl: 20 },
                '& .MuiTableCell-root': {
                  fontSize: { lg: 13, xl: 18, xxl: 20 },
                },
              }}
            >
              <Table
                sx={{
                  border: '1px solid rgba(194, 220, 242, 1)',
                  '& .MuiTableBody-root': {
                    '& .MuiTableRow-root:last-child': {
                      '& .MuiTableCell-root': {
                        borderBottom: '1px solid rgba(194, 220, 242, 1)',
                      },
                    },
                  },
                }}
              >
                <TableBody>
                  {currentBooks.map((book, index) => (
                    <TableRow
                      key={`${book.courseUrl}-${index}`}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(242, 248, 255, 1)',
                        },
                      }}
                    >
                      <TableCell>
                        <Link
                          href={book.topicUrl}
                          style={{
                            textDecoration: 'none',
                            color: STANDARD_TEXT_COLOR,
                            fontWeight: 500,
                          }}
                        >
                          {book.topicTitle}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        <Link
                          href={book.courseUrl}
                          style={{
                            textDecoration: 'none',
                            color: STANDARD_TEXT_COLOR,
                            fontWeight: 500,
                          }}
                        >
                          {/第\S册/?.test(book.courseName)
                            ? '慧灯禅修课 ' + book.courseName
                            : book.courseName}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        {formatDate(book.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 底部分页 */}
            {totalPages > 1 && (
              <CustomPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={page => setCurrentPage(page)}
                size='large'
                maxVisible={5}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
