import { Container } from './Menu.styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ListSubheader } from '@mui/material';
import { SpeedOutlined } from '@mui/icons-material';
import DataObject from '@mui/icons-material/DataObject';
import { ListItem } from '../ResponsiveAppBar/ResponsiveAppBar.styles';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '../../generics';

const menuItems = [
  { name: 'Endpoints', icon: DataObject, page: '/' },
  { name: 'Load Test', icon: SpeedOutlined, page: '/tester' },
  { name: 'Dash', icon: SpeedOutlined, page: '/dash' }
];

export function Menu() {
  return (
    <Container>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="menu-list-subheader"
        subheader={
          <ListSubheader component="div" id="menu-list-subheader">
            Menu
          </ListSubheader>
        }
      >
        {menuItems.map(({ name, icon: Icon, page }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton to={page} component={RouterLink}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <Typography textAlign="center">{name}</Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
