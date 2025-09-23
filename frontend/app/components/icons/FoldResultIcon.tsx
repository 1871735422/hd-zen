import { Box, SvgIcon, SxProps } from '@mui/material';

interface FoldResultIconProps {
  sx?: SxProps;
  expanded?: boolean;
}

const FoldResultIcon = ({ sx, expanded = false }: FoldResultIconProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      position: 'relative',
      '&::before': {
        content: `"${expanded ? '折叠' : '展开'}"`,
        position: 'absolute',
        top: expanded ? '70%' : 0,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 12,
        color: 'rgba(84, 161, 209, 1)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        zIndex: 1,
      },
      ...sx,
    }}
  >
    <SvgIcon
      sx={{
        width: 50,
        height: 50,
        transform: expanded ? 'rotateX(180deg)' : 'rotateX(0deg)',
        transition: 'transform 200ms ease',
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width='60'
        height='32'
        viewBox='0 0 60 32'
        fill='none'
      >
        <g filter='url(#filter_267_926)'>
          <path
            d='M3.9998 1C5.02404 14.4249 16.2733 25 29.9998 25C43.7262 25 54.9755 14.4249 55.9998 1L3.9998 1Z'
            fillRule='evenodd'
            fill='#FFFFFF'
          ></path>
        </g>
        <path
          stroke='rgba(84, 161, 209, 1)'
          strokeWidth='1.3333333333333333'
          strokeLinejoin='round'
          strokeLinecap='round'
          d='M25.2588 11.4385L30.3254 15.3738L35.392 11.4385'
        ></path>
        <defs>
          <filter
            id='filter_267_926'
            x='0'
            y='0'
            width='60'
            height='32'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='feFloodId_267_926' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha_267_926'
            />
            <feOffset dx='0' dy='3' />
            <feGaussianBlur stdDeviation='2' />
            <feComposite in2='hardAlpha_267_926' operator='out' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0.5098039215686274 0 0 0 0 0.6980392156862745 0 0 0 0 0.9098039215686274 0 0 0 0.3 0'
            />
            <feBlend
              mode='normal'
              in2='feFloodId_267_926'
              result='dropShadow_1_267_926'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='dropShadow_1_267_926'
              result='shape_267_926'
            />
          </filter>
        </defs>
      </svg>
    </SvgIcon>
  </Box>
);

export default FoldResultIcon;
