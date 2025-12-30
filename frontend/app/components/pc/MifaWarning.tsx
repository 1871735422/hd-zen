'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useDevice } from '../DeviceProvider';
import LuminousIcon from '../icons/LuminousIcon';
import { MobileLessonDescription } from '../mobile/MobileLessonMeta';

interface MifaProps {
  article_title: string;
  author?: string;
  date?: string;
  description?: string;
  secret_level?: string;
  children: React.ReactNode;
}
const MifaWarning = ({
  article_title,
  // author,
  // date,
  description,
  secret_level,
  children,
}: MifaProps) => {
  const [show, setShow] = useState(false);
  const { deviceType } = useDevice();
  const isMobile = deviceType === 'mobile';

  return (
    <>
      {show ? (
        <>
          {/* {author && date && <MobileLessonAuthor author={author} date={date} />} */}
          {description && <MobileLessonDescription description={description} />}
          {children}
        </>
      ) : (
        <Box>
          {!isMobile && (
            <Typography
              fontWeight={600}
              px={0}
              textAlign={'center'}
              mt={{ lg: 6.4, xlg: 7, xl: 8 }}
              mb={3}
              fontSize={{
                lg: 30,
                xl: 36,
                xxl: 40,
              }}
              color={STANDARD_TEXT_COLOR}
            >
              {article_title}
            </Typography>
          )}
          <Box
            sx={{
              width: '100%',
              border: '3px solid transparent',
              borderRadius: '21px',
              background: `
          linear-gradient(rgba(255, 250, 253, 1)) padding-box,
          linear-gradient(90deg, rgba(196,198,255,1) 0%, rgba(250,167,222,1) 100%) border-box
        `,
            }}
          >
            <Typography
              sx={
                isMobile
                  ? {
                      fontSize: pxToVw(20),
                      color: 'rgba(255, 94, 124, 1)',
                      lineHeight: 1.43,
                      px: pxToVw(15),
                      pt: pxToVw(20),
                      textAlign: 'center',
                    }
                  : {
                      fontSize: 32,
                      color: 'rgba(255, 94, 124, 1)',
                      lineHeight: 1.43,
                      px: 14,
                      pt: '48px',
                      textAlign: 'center',
                    }
              }
            >
              {secret_level}
            </Typography>
            <Stack
              sx={{
                alignItems: 'center',
                fontSize: 136,
                mt: { lg: 3, xlg: 5, xl: 9 },
              }}
            >
              <LuminousIcon />
              <Button
                onClick={() => setShow(true)}
                sx={{
                  mt: { lg: 4, xlg: 4, xl: 8 },
                  mb: { lg: 5, xlg: 6, xl: 10 },
                  height: isMobile ? pxToVw(45) : 69,
                  width: 'fit-content',
                  px: isMobile ? pxToVw(15) : 10,
                  py: isMobile ? {} : 1.7,
                  borderRadius: 10,
                  background:
                    'linear-gradient(90deg, rgba(196, 198, 255, 1) 0%, rgba(250, 167, 222, 1) 100%)',
                  fontSize: isMobile ? pxToVw(18) : 30,
                  fontWeight: 500,
                  color: '#fff',
                }}
              >
                我已经达到该次第，让我继续观看
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default MifaWarning;
