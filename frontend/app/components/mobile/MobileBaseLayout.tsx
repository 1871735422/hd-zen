import Box from '@mui/material/Box';

interface MobileBaseLayoutProps {
  children: React.ReactNode;
  background?: string;
}

// 移动端通用 BaseLayout
export const MobileBaseLayout = ({
  children,
  background = 'linear-gradient(180deg, rgba(227, 241, 255, 1) 0,  rgba(255, 255, 255, 1) 30vw)',
}: MobileBaseLayoutProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        background,
      }}
    >
      {children}
    </Box>
  );
};

export default MobileBaseLayout;
