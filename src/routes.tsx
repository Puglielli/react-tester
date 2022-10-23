import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import { routesItems } from './presentation/components/templates/MainTemplate/MenuItems';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {routesItems.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
