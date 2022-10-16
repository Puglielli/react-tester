import { Home, Tester } from 'presentation/pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainTemplate from './presentation/components/templates/MainTemplate/MainTemplate';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tester" element={<Tester />} />
        <Route path="/dash" element={<MainTemplate />} />
      </Routes>
    </BrowserRouter>
  );
}
