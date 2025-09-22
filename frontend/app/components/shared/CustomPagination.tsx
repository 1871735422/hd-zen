'use client';
import { Box, Button, Stack } from '@mui/material';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  size?: 'small' | 'medium' | 'large';
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisible = 4,
  size = 'medium',
}: PaginationProps) {
  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () =>
    onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => onPageChange(totalPages);

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { minWidth: 28, height: 28, fontSize: 12 };
      case 'large':
        return { minWidth: 44, height: 44, fontSize: 16 };
      default:
        return { minWidth: 36, height: 36, fontSize: 14 };
    }
  };

  const buttonSize = getButtonSize();

  const renderPageNumbers = () => {
    const pages = [];

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
            ...buttonSize,
            borderRadius: '50%',
            bgcolor:
              i === currentPage
                ? 'rgba(130, 178, 232, 1)'
                : 'rgba(230, 245, 255, 1)',
            color: i === currentPage ? '#fff' : 'rgba(86, 137, 204, 1)',
          }}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  const getButtonStyle = (_disabled: boolean) => ({
    ...buttonSize,
    borderRadius: '50%',
    bgcolor: 'transparent',
    color: 'rgba(86, 137, 204, 1)',
    border: '1px solid rgba(130, 178, 232, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      bgcolor: 'rgba(130, 178, 232, 0.1)',
      border: '1px solid rgba(130, 178, 232, 0.5)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
      <Stack
        direction='row'
        spacing={1.5}
        alignItems='center'
        sx={{
          '& .MuiButton-root span': {
            fontSize: 28,
            pb: '3px',
            color: 'rgba(86, 137, 204, 1)',
          },
        }}
      >
        {/* 首页 */}
        <Button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          sx={getButtonStyle(currentPage === 1)}
        >
          <span>«</span>
        </Button>

        {/* 上一页 */}
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          sx={getButtonStyle(currentPage === 1)}
        >
          <span>‹</span>
        </Button>

        {/* 页码 */}
        {renderPageNumbers()}

        {/* 下一页 */}
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={getButtonStyle(currentPage === totalPages)}
        >
          <span>›</span>
        </Button>

        {/* 末页 */}
        <Button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          sx={getButtonStyle(currentPage === totalPages)}
        >
          <span>»</span>
        </Button>
      </Stack>
    </Box>
  );
}
