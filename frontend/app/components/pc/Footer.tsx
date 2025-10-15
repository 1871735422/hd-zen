import { Box, Typography } from '@mui/material';
const Footer: React.FC = () => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height={{ sm: 36, md: 38, lg: 40, xl: 45, xxl: 50 }}
      width='100%'
      bgcolor={'rgba(127, 173, 235, 1)'}
      sx={{ px: { sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 } }}
    >
      <Typography
        color='#fff'
        textAlign='center'
        fontWeight={400}
        fontSize={{ sm: 12, md: 13, lg: 14, xl: 16, xxl: 18 }}
      >
        &copy; {new Date().getFullYear()} &nbsp;慧灯禅修 - By HuiDengChanXiu
      </Typography>
    </Box>
  );
};

export default Footer;
