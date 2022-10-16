import { Home, Tester } from 'presentation/pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tester" element={<Tester />} />
      </Routes>
    </BrowserRouter>
  );
}
