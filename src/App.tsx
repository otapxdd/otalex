import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PricingSection } from './components/PricingSection';
import { CommunityGallery } from './components/CommunityGallery';
import { LicenseDashboard } from './components/LicenseDashboard';
import { DiscordBanner } from './components/DiscordBanner';
import { Footer } from './components/Footer';
import { AuthPage } from './pages/AuthPage';
import { UserDashboard } from './pages/UserDashboard';
import { UploadPage } from './pages/UploadPage';
import { SuccessPage } from './pages/SuccessPage';
import { AdminPage } from './pages/AdminPage';
import { GalleryPage } from './pages/GalleryPage';

function Home() {
  return (
    <>
      <HeroSection />

      <div className="w-full border-t border-zinc-800/40">
        <PricingSection />
      </div>

      <div className="w-full border-t border-zinc-800/40">
        <CommunityGallery />
      </div>

      <div className="w-full border-t border-zinc-800/40">
        <LicenseDashboard />
      </div>

      <DiscordBanner />
    </>
  );
}

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden text-zinc-100 font-sans selection:bg-primary/30 selection:text-white">
      
      {/* Background ambient lights */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Hide Navbar and Footer on AuthPage */}
      {(!isAuthPage && location.pathname !== '/admin') && <Navbar />}
      
      <main className="flex-grow z-10 w-full flex flex-col items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>

      {(!isAuthPage && location.pathname !== '/admin') && <Footer />}
    </div>
  );
}

export default App;
