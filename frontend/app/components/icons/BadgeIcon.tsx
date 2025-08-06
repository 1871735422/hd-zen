import { SvgIcon, SvgIconProps } from '@mui/material';

interface BadgeIconProps extends SvgIconProps {
  size?: 'small' | 'medium' | 'large';
}

export default function BadgeIcon({ size = 'medium', ...props }: BadgeIconProps) {
  const sizeConfig = {
    small: { width: 32, height: 20 },
    medium: { width: 40, height: 25 },
    large: { width: 48, height: 30 },
  };

  const config = sizeConfig[size];

  return (
    <SvgIcon
      viewBox="0 0 127.129 77"
      sx={{
        width: config.width,
        height: config.height,
        ...props.sx,
      }}
      {...props}
    >
      <defs>
        <linearGradient id="badge-gradient" x1="127.129" y1="13.86" x2="33.053" y2="77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFA8B8" />
          <stop offset="0.6937" stopColor="#FF6A72" />
        </linearGradient>
      </defs>
      <path
        fill="url(#badge-gradient)"
        d="M0 0L102.129 0C115.936 0 127.129 11.1929 127.129 25L127.129 77L0 77L0 0Z"
      />
    </SvgIcon>
  );
}
