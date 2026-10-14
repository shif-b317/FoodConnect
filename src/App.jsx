import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FoodConnectChatbot from './components/common/FoodConnectChatbot';
import AppRoutes from './routes/AppRoutes';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppShell = () => {
  const { pathname } = useLocation();
  const hideNavbar = pathname === '/login' || pathname === '/register';

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#2D2422]">
        {!hideNavbar && <Navbar />}
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
        <FoodConnectChatbot />
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
