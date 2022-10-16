import 'styled-components';
import defaultTheme from './defaultTheme';

type MyDefaultTheme = typeof defaultTheme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends MyDefaultTheme {}
}
