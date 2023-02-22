import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import DataObject from '@mui/icons-material/DataObject';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import { SpeedOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '../../generics';
import { Endpoints, LoadTest } from '../../../pages';
import { Cluster } from '../../../pages/registrations/cluster/Cluster';
import React, { ReactElement } from 'react';
import { Tooltip } from '@mui/material';

interface RoutesItem {
  name: string;
  icon: any;
  path: string;
  element: ReactElement;
  isConfiguration: boolean;
}

export const routesItems: Array<RoutesItem> = [
  {
    name: 'Endpoints',
    icon: DataObject,
    path: '/',
    element: <Endpoints />,
    isConfiguration: false
  },
  {
    name: 'Load Test',
    icon: SpeedOutlined,
    path: '/loadTest',
    element: <LoadTest />,
    isConfiguration: false
  },
  {
    name: 'Cluster Registration',
    icon: AppRegistrationRoundedIcon,
    path: '/registration/cluster',
    element: <Cluster />,
    isConfiguration: true
  }
];

export const listItems = (isConfiguration: boolean) => {
  return routesItems
    .filter((item) => item.isConfiguration == isConfiguration)
    .map(({ name, icon: Icon, path }) => (
      <ListItemButton key={name} to={path} component={RouterLink}>
        <Tooltip title={name} placement="right">
          <ListItemIcon>
            <Icon
              color={window.location.pathname == path ? 'primary' : 'none'}
            />
          </ListItemIcon>
        </Tooltip>
        <Typography textAlign="center">{name}</Typography>
      </ListItemButton>
    ));
};
