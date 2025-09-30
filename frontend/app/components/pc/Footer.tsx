import { Box, Typography } from '@mui/material';
const Footer: React.FC = () => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height={{ lg: 40, xl: 45 }}
      width='100%'
      bgcolor={'rgba(127, 173, 235, 1)'}
      sx={{ px: { xs: 1, sm: 2 } }}
    >
      <Typography
        color='#fff'
        textAlign='center'
        fontWeight={400}
        fontSize={{ lg: 4, xl: 16 }}
      >
        &copy; {new Date().getFullYear()} &nbsp;慧灯禅修 - By HuiDengChanXiu
      </Typography>
    </Box>
  );
};

export default Footer;
