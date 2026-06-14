import { BaseProps } from '../types';
import { useEffect, useState } from 'react';
import { auth, logoutUser } from '../auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';

export default function TopNavBar({ onNavigate, activeRoute, cart }: BaseProps & { activeRoute?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthClick = async () => {
    if (user) {
      await logoutUser();
      onNavigate('landing');
    } else {
      onNavigate('login');
    }
    setMobileMenuOpen(false);
  };

  const isAdmin = user?.email === 'admin@koda.com';

  const navItems: { label: string, route: string }[] = [];

  if (isAdmin) {
    navItems.push({ label: 'Admin', route: 'admin' });
  } else {
    navItems.push({ label: 'Menu', route: 'menu' });
    navItems.push({ label: 'Cafes', route: 'cafes' });
    
    if (user) {
      navItems.push({ label: 'Dashboard', route: 'user-dashboard' });
      navItems.push({ label: 'Orders', route: 'orders' });
    }
  }

  return (
    <>
      <nav className="w-full z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-[#fcf8f7]/90 backdrop-blur-md sticky top-0 border-b border-transparent">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-slate-600 hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div 
            onClick={() => onNavigate('landing')}
            className="text-3xl font-black tracking-tighter cursor-pointer"
          >
            Koda
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em]">
          {navItems.map(item => (
            <div 
              key={item.route}
              onClick={() => onNavigate(item.route as any)} 
              className={`relative cursor-pointer group hover:text-[#9d4300] transition-colors ${activeRoute === item.route ? 'text-[#9d4300]' : 'text-slate-500'}`}
            >
              {item.label}
              {activeRoute === item.route && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
            </div>
          ))}
          <div 
            onClick={handleAuthClick} 
            className={`relative cursor-pointer group hover:text-[#9d4300] transition-colors ${activeRoute === 'login' || activeRoute === 'register' ? 'text-[#9d4300]' : 'text-slate-500'}`}
          >
            {user ? 'Logout' : 'Account'}
            {(activeRoute === 'login' || activeRoute === 'register') && !user ? <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div> : null}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {!isAdmin && <Search size={20} className="text-slate-600 cursor-pointer hover:text-black transition-colors hidden md:block" />}
          {!isAdmin && (
            <button 
              onClick={() => onNavigate('checkout')} 
              className="bg-black text-white px-4 md:px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              <span className="hidden md:inline">Cart ({cart?.reduce((acc, item) => acc + item.quantity, 0) || 0})</span>
              <ShoppingCart size={14} className="md:hidden" />
              <span className="md:hidden">{cart?.reduce((acc, item) => acc + item.quantity, 0) || 0}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col pt-6 px-6 md:hidden overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="text-3xl font-black tracking-tighter">Koda</div>
            <button 
              className="text-slate-600 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={28} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6 text-xl font-bold tracking-tight">
            {navItems.map((item) => (
              <div 
                key={item.route}
                onClick={() => {
                  onNavigate(item.route as any);
                  setMobileMenuOpen(false);
                }}
                className={`cursor-pointer ${activeRoute === item.route ? 'text-[#9d4300]' : 'text-slate-800'}`}
              >
                {item.label}
              </div>
            ))}
            <div 
              onClick={handleAuthClick} 
              className={`cursor-pointer ${activeRoute === 'login' || activeRoute === 'register' ? 'text-[#9d4300]' : 'text-slate-800'}`}
            >
              {user ? 'Logout' : 'Account'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
