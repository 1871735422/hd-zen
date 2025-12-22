'use client';

import { useDevice } from '@/app/components/DeviceProvider';
import { pxToVw } from '@/app/utils/mobileUtils';
import {
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Box, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

interface QuestionCollectClientProps {
  qaLink: string;
}

const QuestionCollectClient: React.FC<QuestionCollectClientProps> = ({
  qaLink,
}) => {
  const { deviceType } = useDevice();
  const isMobile = deviceType === 'mobile';
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
          ml: { lg: 1.33, xlg: 1.6, xl: 2, xxl: 2.67 },
          mr: { lg: 2.67, xlg: 3.2, xl: 4, xxl: 5.33 },
          my: { lg: 2.67, xlg: 3.2, xl: 4, xxl: 5.33 },
          background: 'rgba(255, 255, 255, 0.9)',
          position: 'relative',
          borderRadius: {
            lg: '16.67px',
            xlg: '20px',
            xl: '25px',
            xxl: '33.33px',
          },
          px: { lg: 3.33, xlg: 4, xl: 5, xxl: 6.67 },
          py: { lg: 1.33, xlg: 1.6, xl: 2, xxl: 2.67 },
        }}
      >
        <Typography
          className='fz-qiti'
          sx={{
            color: 'rgba(255, 94, 124, 1)',
            fontSize: isMobile ? pxToVw(30) : '30px',
            lineHeight: 1.25,
          }}
        >
          参与方式：
        </Typography>
        <Typography
          className='fz-qiti'
          sx={{
            color: 'rgba(70, 114, 166, 1)',
            fontSize: isMobile
              ? pxToVw(22)
              : { lg: 16, xlg: 19.2, xl: 24, xxl: 32 },
            lineHeight: 1.7,
          }}
        >
          请扫描下方二维码或点击
          <span
            className='fz-qiti'
            style={{
              color: 'rgba(42, 130, 228, 1)',
              textDecoration: 'underline',
              textUnderlineOffset: 6,
              textDecorationThickness: 1.5,
              cursor: 'pointer',
            }}
            onClick={handleOpenModal}
          >
            问卷链接
          </span>
          填写您的问题。
        </Typography>
        <Box
          component={'img'}
          src='/images/join-qr.png'
          alt='QR Code'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: { lg: 180, xlg: 216, xl: 270, xxl: 360 },
            margin: '0 auto',
            mt: 2.5,
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
