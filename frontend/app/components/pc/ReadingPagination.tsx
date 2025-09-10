'use client';
import { Box, Button, Stack } from '@mui/material';

interface ReadingPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function ReadingPagination({
  totalPages,
  currentPage,
  onPageChange,
}: ReadingPaginationProps) {
  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () =>
    onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => onPageChange(totalPages);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 4; // 最多显示4个页码

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor:
              i === currentPage ? 'rgba(130, 178, 232, 1)' : 'transparent',
            color: i === currentPage ? '#fff' : 'rgba(130, 178, 232, 0.7)',
            border:
              i === currentPage ? 'none' : '1px solid rgba(130, 178, 232, 0.3)',
            fontSize: 14,
            fontWeight: i === currentPage ? 600 : 400,
            boxShadow: 'none',
            '&:hover': {
              bgcolor:
                i === currentPage
                  ? 'rgba(130, 178, 232, 1)'
                  : 'rgba(130, 178, 232, 0.1)',
              border:
                i === currentPage
                  ? 'none'
                  : '1px solid rgba(130, 178, 232, 0.5)',
            },
          }}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
      <Stack direction='row' spacing={1.5} alignItems='center'>
        {/* 首页 */}
        <Button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'transparent',
            color: 'rgba(130, 178, 232, 0.7)',
            border: '1px solid rgba(130, 178, 232, 0.3)',
            fontSize: 14,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'rgba(130, 178, 232, 0.1)',
              border: '1px solid rgba(130, 178, 232, 0.5)',
            },
            '&:disabled': {
              opacity: 0.3,
            },
          }}
        >
          «
        </Button>

        {/* 上一页 */}
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'transparent',
            color: 'rgba(130, 178, 232, 0.7)',
            border: '1px solid rgba(130, 178, 232, 0.3)',
            fontSize: 14,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'rgba(130, 178, 232, 0.1)',
              border: '1px solid rgba(130, 178, 232, 0.5)',
            },
            '&:disabled': {
              opacity: 0.3,
            },
          }}
        >
          ‹
        </Button>

        {/* 页码 */}
        {renderPageNumbers()}

        {/* 下一页 */}
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'transparent',
            color: 'rgba(130, 178, 232, 0.7)',
            border: '1px solid rgba(130, 178, 232, 0.3)',
            fontSize: 14,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'rgba(130, 178, 232, 0.1)',
              border: '1px solid rgba(130, 178, 232, 0.5)',
            },
            '&:disabled': {
              opacity: 0.3,
            },
          }}
        >
          ›
        </Button>

        {/* 末页 */}
        <Button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'transparent',
            color: 'rgba(130, 178, 232, 0.7)',
            border: '1px solid rgba(130, 178, 232, 0.3)',
            fontSize: 14,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'rgba(130, 178, 232, 0.1)',
              border: '1px solid rgba(130, 178, 232, 0.5)',
            },
            '&:disabled': {
              opacity: 0.3,
            },
          }}
        >
          »
        </Button>
      </Stack>
    </Box>
  );
}
