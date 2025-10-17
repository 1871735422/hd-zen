'use client';

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
        width: {
          sm: '180px',
          md: '200px',
          lg: '199px',
          xl: '280px',
          xxl: '320px',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: { sm: 0, md: 0, lg: 0, xl: 8, xxl: 10 },
      }}
    >
      <TextField
        variant='outlined'
        size='small'
        placeholder=''
        required
        name='query'
        sx={{
          width: { sm: 120, md: 140, lg: 128, xl: 180, xxl: 200 },
          '& .MuiOutlinedInput-root': {
            height: { sm: 20, md: 22, lg: 23, xl: 32, xxl: 36 },
            fontSize: { sm: 12, md: 14, lg: 11, xl: 16, xxl: 18 },
            color: STANDARD_TEXT_COLOR,
            borderRadius: '5px',
            backgroundColor: 'transparent',
          },
          '& .MuiInputBase-input': {
            fontSize: { sm: 12, md: 14, lg: 11, xl: 16, xxl: 18 },
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
