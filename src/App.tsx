import { useState } from 'react';
import { PageRoute } from './types';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import CafesPage from './pages/CafesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');

  const handleNavigate = (route: PageRoute) => {
    setCurrentPage(route);
    window.scrollTo(0, 0);
  };

  switch (currentPage) {
    case 'landing':
      return <LandingPage onNavigate={handleNavigate} />;
    case 'menu':
      return <MenuPage onNavigate={handleNavigate} />;
    case 'cafes':
      return <CafesPage onNavigate={handleNavigate} />;
    case 'login':
      return <LoginPage onNavigate={handleNavigate} />;
    case 'register':
      return <RegisterPage onNavigate={handleNavigate} />;
    case 'reset-password':
      return <ResetPasswordPage onNavigate={handleNavigate} />;
    case 'checkout':
      return <CheckoutPage onNavigate={handleNavigate} />;
    case 'admin':
      return <AdminPage onNavigate={handleNavigate} />;
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
}

