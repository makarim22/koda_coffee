import { useState } from 'react';
import { PageRoute, CartItem } from './types';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import CafesPage from './pages/CafesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import UserDashboardPage from './pages/UserDashboardPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SustainabilityPage from './pages/SustainabilityPage';
import WholesalePage from './pages/WholesalePage';
import CareersPage from './pages/CareersPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleNavigate = (route: PageRoute) => {
    setCurrentPage(route);
    window.scrollTo(0, 0);
  };

  const sharedProps = { onNavigate: handleNavigate, cart, setCart };

  switch (currentPage) {
    case 'landing':
      return <LandingPage {...sharedProps} />;
    case 'menu':
      return <MenuPage {...sharedProps} />;
    case 'cafes':
      return <CafesPage {...sharedProps} />;
    case 'login':
      return <LoginPage {...sharedProps} />;
    case 'register':
      return <RegisterPage {...sharedProps} />;
    case 'reset-password':
      return <ResetPasswordPage {...sharedProps} />;
    case 'checkout':
      return <CheckoutPage {...sharedProps} />;
    case 'admin':
      return <AdminPage {...sharedProps} />;
    case 'user-dashboard':
      return <UserDashboardPage {...sharedProps} />;
    case 'orders':
      return <OrderHistoryPage {...sharedProps} />;
    case 'sustainability':
      return <SustainabilityPage {...sharedProps} />;
    case 'wholesale':
      return <WholesalePage {...sharedProps} />;
    case 'careers':
      return <CareersPage {...sharedProps} />;
    case 'privacy':
      return <PrivacyPage {...sharedProps} />;
    case 'terms':
      return <TermsPage {...sharedProps} />;
    default:
      return <LandingPage {...sharedProps} />;
  }
}

