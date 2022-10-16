import { createTheme } from '@mui/material/styles';
import baseTheme from '../baseTheme';

const darkTheme = createTheme(baseTheme, {
  palette: {
    mode: 'dark'
  }
});

export default darkTheme;
