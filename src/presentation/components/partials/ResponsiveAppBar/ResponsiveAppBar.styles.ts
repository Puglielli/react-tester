import AdbIcon from '@mui/icons-material/Adb';
import {
  Box as DefaultBox,
  Button as DefaultButton,
  Container as DefaultContainer,
  List as DefaultList,
  ListItem as DefaultListItem,
  ListItemButton as DefaultListItemButton,
  ListItemIcon as DefaultListItemIcon,
  Typography as DefaultTypography
} from 'presentation/components/generics';
import styled from 'styled-components';

import { Drawer as DefaultDrawer } from '../Drawer/Drawer';

export const Container = styled(DefaultContainer)`
  max-width: ${({ theme }) => `${theme.breakpoints.values.xl}px`};
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

export const BrandIcon = styled(AdbIcon)`
  margin-right: 8px;
`;

export const BrandText: typeof DefaultTypography = styled(DefaultTypography)`
  margin-right: 24px;
  font-weight: 700;
  letter-spacing: 0.1rem;
  color: 'inherit';
  text-decoration: none;
  flex-wrap: nowrap;
`;

export const IconButtonWrapper = styled.div`
  flex-grow: 1;
`;

export const MobileWrapper = styled(DefaultBox)`
  flex-grow: 1;
  align-items: center;

  ${({ theme }) => theme.breakpoints.up('xs')} {
    display: flex;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`;

export const DesktopWrapper = styled(DefaultBox)`
  flex-grow: 1;
  align-items: center;

  ${({ theme }) => theme.breakpoints.up('xs')} {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: flex;
  }
`;

export const Drawer = styled(DefaultDrawer)`
  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`;

export const DrawerContent = styled.div`
  min-width: 240px;
`;

export const List = styled(DefaultList)``;

export const ListItem = styled(DefaultListItem)``;

export const ListItemButton: typeof DefaultListItemButton = styled(
  DefaultListItemButton
)``;

export const ListItemIcon = styled(DefaultListItemIcon)``;

export const Button: typeof DefaultButton = styled(DefaultButton)`
  display: flex;
  transition: filter 0.3s ease-in-out;
  margin-right: 12px;
  color: ${({ theme }) => theme.palette.common.white};

  svg {
    margin-right: 4px;
  }
  &:hover {
    filter: brightness(85%);
  }
`;
