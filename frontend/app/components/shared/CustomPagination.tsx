'use client';
import { Box, Button, Stack, Typography } from '@mui/material';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  size?: 'small' | 'medium' | 'large';
  mode?: 'paged' | 'full';
  onModeChange?: (mode: 'paged' | 'full') => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisible = 4,
  size = 'medium',
  mode = 'full',
  onModeChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const handleFirstPage = () => handlePageClick(1);
  const handlePrevPage = () => handlePageClick(Math.max(1, currentPage - 1));
  const handleNextPage = () =>
    handlePageClick(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => handlePageClick(totalPages);

  const handleFullTextClick = () => {
    if (onModeChange) {
      onModeChange('full');
    }
  };

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

  const handlePageClick = (page: number) => {
    // 点击页码时切换为分页模式
    if (mode === 'full' && onModeChange) {
      onModeChange('paged');
    }
    onPageChange(page);
  };

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
          onClick={() => handlePageClick(i)}
          sx={{
            ...buttonSize,
            borderRadius: '50%',
            bgcolor:
              i === currentPage && mode === 'paged'
                ? 'rgba(130, 178, 232, 1)'
                : 'rgba(230, 245, 255, 1)',
            color:
              i === currentPage && mode === 'paged'
                ? '#fff'
                : 'rgba(86, 137, 204, 1)',
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
            fontSize: 24,
            pb: { lg: '3px', xl: '5px', xxl: '6px' },
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

        {/* 切换阅读全文 */}
        <Button
          onClick={handleFullTextClick}
          sx={{
            ...buttonSize,
            borderRadius: '50%',
            bgcolor:
              mode === 'full'
                ? 'rgba(130, 178, 232, 1)'
                : 'rgba(230, 245, 255, 1)',
            color: mode === 'full' ? '#fff' : 'rgba(86, 137, 204, 1)',
            border:
              mode === 'full' ? 'none' : '1px solid rgba(130, 178, 232, 1)',
            '&:hover': {
              bgcolor:
                mode === 'full'
                  ? 'rgba(130, 178, 232, 0.9)'
                  : 'rgba(130, 178, 232, 0.1)',
              border:
                mode === 'full' ? 'none' : '1px solid rgba(130, 178, 232, 0.5)',
            },
          }}
        >
          <Typography fontSize={12} px={1}>
            全文
          </Typography>
        </Button>

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
