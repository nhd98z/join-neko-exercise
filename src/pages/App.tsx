import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import Func from 'pages/Func';
import Header from 'components/Header';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/func" element={<Func />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
