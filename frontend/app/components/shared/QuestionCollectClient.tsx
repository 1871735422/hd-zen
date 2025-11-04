'use client';

import {
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Modal,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';

interface QuestionCollectClientProps {
  qaLink: string;
  qrCodeUrl: string;
}

const QuestionCollectClient: React.FC<QuestionCollectClientProps> = ({
  qaLink,
  qrCodeUrl,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenInNewWindow = () => {
    window.open(qaLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Box
        sx={{
          mx: { lg: 1.5, xl: 1.5, xxl: 2 },
          my: { lg: 2.55, xl: 3, xxl: 3.5 },
          background: 'rgba(255, 255, 255, 0.9)',
          position: 'relative',
          borderRadius: {
            lg: '25px',
            xl: '25px',
            xxl: '30px',
          },
          px: { lg: '32px', xl: 5, xxl: 6 },
          py: { lg: '22px', xl: 2, xxl: 2.5 },
        }}
      >
        <Box
          component={'img'}
          alt='参与方式：请扫描下方二维码或点击 问卷链接 填写您的问题。'
          src={qrCodeUrl}
          width={0}
          height={0}
          onClick={handleOpenModal}
          sx={{
            cursor: 'pointer',
            width: '100%',
            height: 'auto',
            maxWidth: {
              lg: 612,
              xl: 720,
              xxl: 850,
            },
            display: 'block',
          }}
        />
        <Box
          component={'img'}
          src='/images/join-qr.png'
          alt='QR Code'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: { lg: 229, xl: 270, xxl: 300 },
            margin: '0 auto',
            ...(isMobile && { mt: 2.5 }),
          }}
        />
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby='qa-modal-title'
        aria-describedby='qa-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
            height: { xs: '90%', sm: '85%', md: '80%', lg: '80%' },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              top: 8,
              zIndex: 1000,
              display: 'flex',
              gap: 1,
            }}
          >
            <Tooltip title='在新窗口打开'>
              <IconButton
                onClick={handleOpenInNewWindow}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='关闭'>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            component='iframe'
            src={
              qaLink +
              '?background=transparent&banner=show&embedded=true&inner_redirect=true'
            }
            sandbox='allow-scripts allow-forms allow-same-origin allow-top-navigation allow-popups'
            sx={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 2,
            }}
            title='问卷链接'
          />
        </Box>
      </Modal>
    </>
  );
};

export default QuestionCollectClient;
