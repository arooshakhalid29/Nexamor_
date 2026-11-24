import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Growth from './pages/Growth';
import About from './pages/About';
import Start from './pages/Start';
import Legal from './pages/Legal';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/growth" element={<Growth />} />
            <Route path="/about" element={<About />} />
            <Route path="/start" element={<Start />} />
            <Route
              path="/privacy"
              element={
                <Legal
                  title="Privacy Policy"
                  summary="We respect your privacy and only collect information you choose to share with us."
                />
              }
            />
            <Route
              path="/terms"
              element={
                <Legal
                  title="Terms of Service"
                  summary="Plain-language terms covering flat-rate builds, unlimited revisions, and full client ownership."
                />
              }
            />
            <Route path="/contact" element={<Navigate to="/#contact" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
