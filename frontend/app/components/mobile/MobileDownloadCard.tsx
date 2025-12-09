'use client';

import { trackDownload } from '@/app/utils/clarityAnalytics';
import { SvgIconProps } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
  DOWNLOAD_RED_COLOR,
  STANDARD_TEXT_COLOR,
} from '../../constants/colors';
import { DownloadResource } from '../../types/models';
import { pxToVw } from '../../utils/mobileUtils';
import EpubDownIcon from '../icons/EpubDownIcon';
import PdfDownIcon from '../icons/PdfDownIcon';

// 提取子组件：单个下载入口
interface DownloadOptionProps {
  href: string;
  label: string;
  Icon: React.ComponentType<SvgIconProps>;
  fileType: string;
  fileName?: string;
}
const DownloadOption: React.FC<DownloadOptionProps> = ({
  href,
  label,
  Icon,
  fileType,
  fileName,
}) => {
  const handleClick = () => {
    trackDownload(fileType, fileName, href);
  };

  return (
    <Box
      component='a'
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': { opacity: 0.8 },
      }}
    >
      <Box
        sx={{
          width: pxToVw(30),
          height: pxToVw(30),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: DOWNLOAD_RED_COLOR,
          borderRadius: pxToVw(12),
          fontSize: pxToVw(26),
        }}
      >
        <Icon />
      </Box>
      <Typography sx={{ fontSize: pxToVw(12), color: DOWNLOAD_RED_COLOR }}>
        {label}
      </Typography>
    </Box>
  );
};

interface MobileDownloadCardProps {
  item: DownloadResource;
  index: number;
}

/**
 * 移动端下载卡片组件
 * 根据设计稿实现简洁的卡片布局
 */
const MobileDownloadCard: React.FC<MobileDownloadCardProps> = ({
  item,
  index,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: pxToVw(15),
        padding: pxToVw(16),
        marginBottom: pxToVw(16),
        boxShadow: '0px 2px 10px rgba(131, 181, 247, 0.3)',
        width: pxToVw(345),
        height: pxToVw(113),
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'rgba(164, 202, 245, 1)',
            width: pxToVw(24),
            height: pxToVw(24),
            fontSize: pxToVw(16),
            fontWeight: 700,
          }}
        >
          {index + 1}
        </Avatar>
        <Typography
          sx={{
            fontSize: pxToVw(18),
            pl: pxToVw(8),
            fontWeight: 400,
            lineHeight: 1.5,
            color: STANDARD_TEXT_COLOR,
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </Typography>
      </Box>

      {/* 下载选项 */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-evenly', px: pxToVw(12) }}
      >
        {item.url_downpdf && (
          <DownloadOption
            href={item.url_downpdf}
            label={item.pdf_size || '560.2K'}
            Icon={PdfDownIcon}
            fileType='pdf'
            fileName={item.name}
          />
        )}
        {item.url_downepub && (
          <DownloadOption
            href={item.url_downepub}
            label={item.epub_size || '18.08M'}
            Icon={EpubDownIcon}
            fileType='epub'
            fileName={item.name}
          />
        )}
      </Box>
    </Box>
  );
};

export default MobileDownloadCard;
