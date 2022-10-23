import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import DataObject from '@mui/icons-material/DataObject';
import MenuIcon from '@mui/icons-material/Menu';
import {
  IconButton,
  Toolbar,
  Typography
} from 'presentation/components/generics';
import { useMobile } from 'presentation/hooks';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDrawer } from '../Drawer/DrawerController';
import {
  Brand,
  BrandIcon,
  BrandText,
  Button,
  Container,
  DesktopWrapper,
  Drawer,
  DrawerContent,
  IconButtonWrapper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  MobileWrapper
} from './ResponsiveAppBar.styles';
import { SpeedOutlined } from '@mui/icons-material';

const pages = [
  { name: 'Endpoints', icon: DataObject, page: '/' },
  { name: 'Load Test', icon: SpeedOutlined, page: '/loadTest' }
];

export function ResponsiveAppBar() {
  const { isOpen, handleOpenDrawer, handleCloseDrawer } = useDrawer();
  const isMobile = useMobile();
  useEffect(() => {
    if (!isMobile) return;
    handleCloseDrawer();
  }, [handleCloseDrawer, isMobile]);

  const brandText = 'TESTER';

  return (
    <Container>
      <Toolbar disableGutters>
        <DesktopWrapper>
          <BrandIcon />
          <BrandText variant="h6" component={RouterLink} to="/">
            {brandText}
          </BrandText>
          {pages.map(({ name, icon: Icon, page }) => (
            <Button
              key={name}
              component={RouterLink}
              to={page}
              onClick={handleCloseDrawer}
            >
              <Icon />
              {name}
            </Button>
          ))}
        </DesktopWrapper>

        <MobileWrapper>
          <IconButtonWrapper>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleOpenDrawer}
            >
              <MenuIcon />
            </IconButton>
          </IconButtonWrapper>

          <Drawer isOpen={isOpen} onClose={handleCloseDrawer}>
            <DrawerContent>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleCloseDrawer}
              >
                <CloseTwoToneIcon />
              </IconButton>
              <List>
                {pages.map(({ name, icon: Icon, page }) => (
                  <ListItem key={name} disablePadding>
                    <ListItemButton
                      to={page}
                      component={RouterLink}
                      onClick={handleCloseDrawer}
                    >
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                      <Typography textAlign="center">{name}</Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </DrawerContent>
          </Drawer>
          <Brand>
            <BrandIcon />
            <BrandText variant="h6" component={RouterLink} to="/">
              {brandText}
            </BrandText>
          </Brand>
        </MobileWrapper>
      </Toolbar>
    </Container>
  );
}
