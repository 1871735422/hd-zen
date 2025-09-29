import { IconButton, Stack, TextField } from '@mui/material';
import { MAIN_BLUE_COLOR, STANDARD_TEXT_COLOR } from '../../constants/colors';
import SearchIcon from '../icons/SearchIcon';

const SearchForm: React.FC = () => {
  return (
    <Stack
      component={'form'}
      action='/search'
      method='GET'
      direction='row'
      spacing={2}
      sx={{
        width: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: { lg: 0, xl: 8 },
      }}
    >
      <TextField
        variant='outlined'
        size='small'
        placeholder=''
        required
        name='query'
        sx={{
          width: { lg: 160, xl: 180 },
          '& .MuiOutlinedInput-root': {
            height: { lg: 25, xl: 32 },
            fontSize: { xs: 14, sm: 15, md: 16 },
            color: STANDARD_TEXT_COLOR,
            borderRadius: '5px',
            p: { lg: 0.5 },
            backgroundColor: 'transparent',
            '& fieldset': {
              height: { lg: 25, xl: 32 },
              borderColor: 'rgba(130, 178, 232, 0.6)',
            },
            '&:hover fieldset': {
              borderColor: MAIN_BLUE_COLOR,
            },
            '&.Mui-focused fieldset': {
              height: { lg: 25, xl: 32 },
              borderColor: MAIN_BLUE_COLOR,
            },
          },
          '& input': {
            px: 0.5,
            py: 0,
            my: '4px',
            height: '100%',
          },
        }}
      />
      <IconButton
        type='submit'
        sx={{ color: MAIN_BLUE_COLOR, ml: '2px !important' }}
      >
        <SearchIcon />
      </IconButton>
    </Stack>
  );
};

export default SearchForm;
