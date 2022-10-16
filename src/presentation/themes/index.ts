import { Theme } from '@mui/material';
import darkTheme from './darkTheme';
import defaultTheme from './defaultTheme';

export enum Themes {
  default = 'defaultTheme',
  dark = 'darkTheme'
}

const themeMap: { [key: string]: Theme } = {
  defaultTheme,
  darkTheme
};

export async function getTheme(): Promise<Theme> {
  const currentTheme = Themes.dark;
  return themeMap[currentTheme];
}
