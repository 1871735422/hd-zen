import { Box, Typography } from '@mui/material';
const Footer: React.FC = () => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height={{ xs: 35, sm: 40, md: 45 }}
      width='100%'
      bgcolor={'rgba(127, 173, 235, 1)'}
      sx={{ px: { xs: 1, sm: 2 } }}
    >
      <Typography
        color='white'
        textAlign='center'
        variant='body1'
      >
        &nbsp; {new Date().getFullYear()} &nbsp;慧灯禅修 - By Huidengchanxiu
      </Typography>
    </Box>
  );
};

export default Footer;
