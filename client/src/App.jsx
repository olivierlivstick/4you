import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PersonalizePage from './pages/PersonalizePage';
import ConfirmationPage from './pages/ConfirmationPage';
import VideoPage from './pages/VideoPage';
import AboutPage from './pages/AboutPage';
import TechPage from './pages/TechPage';
import BackOfficePage from './pages/BackOfficePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/tech" element={<TechPage />} />
            <Route path="/brand/:brandId" element={<PersonalizePage />} />
            <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
            <Route path="/voucher/:orderId/video" element={<VideoPage />} />
            <Route path="/backoffice" element={<BackOfficePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
