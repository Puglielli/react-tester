import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import DataObject from '@mui/icons-material/DataObject';
import { SpeedOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '../../generics';

const items = [
  { name: 'Endpoints', icon: DataObject, page: '/' },
  { name: 'Load Test', icon: SpeedOutlined, page: '/tester' }
];

export const listItems = items.map(({ name, icon: Icon, page }) => (
  <ListItemButton key={name} to={page} component={RouterLink}>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <Typography textAlign="center">{name}</Typography>
  </ListItemButton>
));
