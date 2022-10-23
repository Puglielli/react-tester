import { AlertColor } from '@mui/material';

export interface SnackBarProps {
  message: string;
  severity: AlertColor;
}

export const initialize: SnackBarProps = { message: '', severity: 'info' };
export const defaultError: SnackBarProps = {
  message: 'Error found!',
  severity: 'error'
};
