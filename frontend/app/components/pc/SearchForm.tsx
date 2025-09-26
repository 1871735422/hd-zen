import { IconButton, Stack, TextField } from '@mui/material';
import { MAIN_BLUE_COLOR, STANDARD_TEXT_COLOR } from '../../constants/colors';
import SearchIcon from '../icons/SearchIcon';

const SearchForm: React.FC = () => {
  return (
    <form action='/search' method='GET'>
      <Stack
        direction='row'
        spacing={2}
        sx={{
          width: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          variant='outlined'
          size='small'
          placeholder=''
          required
          name='query'
          sx={{
            width: { xs: 120, md: 160 },
            height: { xs: 23, md: 25 },
            '& .MuiOutlinedInput-root': {
              height: { xs: 28, sm: 30, md: 32 },
              fontSize: { xs: 14, sm: 15, md: 16 },
              color: STANDARD_TEXT_COLOR,
              borderRadius: 1,
              px: { xs: 1, sm: 1.5, md: 2 },
              backgroundColor: 'transparent',
              '& fieldset': {
                borderColor: 'rgba(130, 178, 232, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: MAIN_BLUE_COLOR,
              },
              '&.Mui-focused fieldset': {
                borderColor: MAIN_BLUE_COLOR,
              },
            },
            '& input': {
              p: 0,
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
    </form>
  );
};

export default SearchForm;
