import { Box, Typography } from '@mui/material';
const Footer: React.FC = () => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height={{ xs: 35, md: 40 }}
      width='100%'
      bgcolor={'rgba(127, 173, 235, 1)'}
      sx={{ px: { xs: 1, sm: 2 } }}
    >
      <Typography
        color='#fff'
        textAlign='center'
        fontWeight={300}
        fontSize={14}
      >
        &copy; {new Date().getFullYear()} &nbsp;慧灯禅修 - By Huidengchanxiu
      </Typography>
    </Box>
  );
};

export default Footer;
