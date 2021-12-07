import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import Landing from 'pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
