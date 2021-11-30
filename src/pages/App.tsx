import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import Func from 'pages/Func';
import Header from 'components/Header';
import { Box } from 'components/Box';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box pb="106px" /> {/* 106px = Height of header */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/func" element={<Func />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
