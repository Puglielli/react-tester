import { Drawer as DefaultDrawer } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  [x: string]: any;
};

export function Drawer({ children, isOpen, onClose, ...rest }: Props) {
  return (
    <DefaultDrawer open={isOpen} {...rest} onClose={onClose}>
      {children}
    </DefaultDrawer>
  );
}
