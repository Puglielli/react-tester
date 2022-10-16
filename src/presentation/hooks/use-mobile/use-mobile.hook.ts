import { useMediaQuery } from '@mui/material';
import { useTheme } from 'styled-components';

export const useMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};
