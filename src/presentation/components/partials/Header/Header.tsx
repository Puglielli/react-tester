import AppBar from '@mui/material/AppBar';
import { ResponsiveAppBar } from '../ResponsiveAppBar/ResponsiveAppBar';

export function Header() {
  return (
    <AppBar position="static">
      <ResponsiveAppBar />
    </AppBar>
  );
}
