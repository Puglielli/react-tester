import { useCallback, useState } from 'react';

export function useDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return {
    handleOpenDrawer,
    handleCloseDrawer,
    toggleDrawer,
    isOpen
  };
}
