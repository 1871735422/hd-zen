'use client';
import { useDeviceType } from '@/app/utils/deviceUtils';
import { Box, Button, Stack, Typography } from '@mui/material';
import PrevPage from '../icons/PrevPage';
import { FirstPage, LastPage } from '@mui/icons-material';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  size?: 'small' | 'medium' | 'large';
  mode?: 'paged' | 'full' | 'pagination';
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
  const isMobile = useDeviceType() === 'mobile';

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
              i === currentPage && mode !== 'full'
                ? 'rgba(130, 178, 232, 1)'
                : 'rgba(230, 245, 255, 1)',
            color:
              i === currentPage && mode !== 'full'
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
          '& .MuiButton-root': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiButton-root .MuiSvgIcon-root': {
            color: 'rgba(86, 137, 204, 1)',
          },
        }}
      >
        {/* 首页 */}

        {!isMobile && (
          <Button
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            sx={{ ...getButtonStyle(currentPage === 1), fontSize: 18 }}
          >
            <FirstPage />
          </Button>
        )}

        {/* 上一页 */}
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          sx={{ ...getButtonStyle(currentPage === 1), fontSize: 10 }}
        >
          <PrevPage />
        </Button>

        {/* 页码 */}
        {renderPageNumbers()}

        {/* 切换阅读全文 */}
        {mode !== 'pagination' && (
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
                  mode === 'full'
                    ? 'none'
                    : '1px solid rgba(130, 178, 232, 0.5)',
              },
            }}
          >
            <Typography fontSize={12} px={0}>
              全文
            </Typography>
          </Button>
        )}

        {/* 下一页 */}
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={{
            ...getButtonStyle(currentPage === totalPages),
            fontSize: 10,
            transform: 'rotate(180deg)',
          }}
        >
          <PrevPage />
        </Button>

        {/* 末页 */}
        {!isMobile && (
          <Button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            sx={{ ...getButtonStyle(currentPage === 1), fontSize: 18 }}
          >
            <LastPage />
          </Button>
        )}
      </Stack>
    </Box>
  );
}
