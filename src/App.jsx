import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';
import OfflineStatus from './components/OfflineStatus';
import Loading from './components/Loading';

const Home           = lazy(() => import('./pages/Home'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const NearbyDoctors  = lazy(() => import('./pages/NearbyDoctors'));
const MedicineReminder = lazy(() => import('./pages/MedicineReminder'));
const HealthLocker   = lazy(() => import('./pages/HealthLocker'));
const Emergency      = lazy(() => import('./pages/Emergency'));
const Settings       = lazy(() => import('./pages/Settings'));
const About          = lazy(() => import('./pages/About'));

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <OfflineStatus />
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/"                   element={<Home />} />
            <Route path="/symptom-checker"    element={<SymptomChecker />} />
            <Route path="/nearby-doctors"     element={<NearbyDoctors />} />
            <Route path="/medicine-reminder"  element={<MedicineReminder />} />
            <Route path="/health-locker"      element={<HealthLocker />} />
            <Route path="/emergency"          element={<Emergency />} />
            <Route path="/settings"           element={<Settings />} />
            <Route path="/about"              element={<About />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <OfflineProvider>
            <AppLayout />
          </OfflineProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
