'use client';

import { Box, Tab, Tabs } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import CharIcon from '../icons/CharIcon';
import HeadphoneIcon from '../icons/HeadphoneIcon';
import VideoIcon from '../icons/VideoIcon';

interface MobileLessonTabsProps {
  excludeLabels?: string[];
  path: string;
}

const MobileLessonTabs: React.FC<MobileLessonTabsProps> = ({
  excludeLabels = [],
  path,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'video';

  const [selectedTab, setSelectedTab] = useState(currentTab);

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [currentTab]);

  const tabs = [
    {
      value: 'video',
      label: '视频',
      icon: <VideoIcon />,
    },
    {
      value: 'audio',
      label: '音频',
      icon: <HeadphoneIcon />,
    },
    {
      value: 'article',
      label: '文字',
      icon: <CharIcon />,
    },
  ].filter(tab => !excludeLabels.includes(tab.label));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    router.push(`${path}?tab=${newValue}`);
  };

  if (tabs.length <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: `${pxToVw(1)} solid rgba(230, 230, 230, 1)`,
        mb: pxToVw(20),
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant='fullWidth'
        sx={{
          minHeight: pxToVw(48),
          '& .MuiTabs-indicator': {
            height: pxToVw(3),
            backgroundColor: 'rgba(67, 109, 186, 1)',
            borderRadius: `${pxToVw(2)} ${pxToVw(2)} 0 0`,
          },
        }}
      >
        {tabs.map(tab => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: pxToVw(6),
                }}
              >
                <Box
                  sx={{
                    width: pxToVw(20),
                    height: pxToVw(20),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                      width: '100%',
                      height: '100%',
                      fill:
                        selectedTab === tab.value
                          ? 'rgba(67, 109, 186, 1)'
                          : 'rgba(153, 153, 153, 1)',
                    },
                  }}
                >
                  {tab.icon}
                </Box>
                <Box component='span'>{tab.label}</Box>
              </Box>
            }
            sx={{
              minHeight: pxToVw(48),
              fontSize: pxToVw(15),
              fontWeight: selectedTab === tab.value ? 600 : 400,
              color:
                selectedTab === tab.value
                  ? 'rgba(67, 109, 186, 1)'
                  : 'rgba(153, 153, 153, 1)',
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'rgba(67, 109, 186, 1)',
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default MobileLessonTabs;
