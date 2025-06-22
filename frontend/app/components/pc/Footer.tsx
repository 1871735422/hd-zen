import { Box, Typography } from '@mui/material';
const Footer: React.FC = () => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height={45}
      width='100%'
      bgcolor={'rgba(127, 173, 235, 1)'}
    >
      <Typography color='white'>
        &nbsp; {new Date().getFullYear()} &nbsp;慧灯禅修 - By Huidengchanxiu
      </Typography>
    </Box>
  );
};

export default Footer;
