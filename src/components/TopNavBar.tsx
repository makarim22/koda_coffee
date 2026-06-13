import { BaseProps } from '../types';
import { useEffect, useState } from 'react';
import { auth, logoutUser } from '../auth';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function TopNavBar({ onNavigate, activeRoute }: BaseProps & { activeRoute?: string }) {
  const [user, setUser] = useState<User | null>(null);

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
  };

  return (
    <nav className="w-full z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-[#fcf8f7]/90 backdrop-blur-md sticky top-0 border-b border-transparent">
      <div 
        onClick={() => onNavigate('landing')}
        className="text-3xl font-black tracking-tighter cursor-pointer"
      >
        Koda
      </div>
      <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em]">
        <div 
          onClick={() => onNavigate('menu')} 
          className={`relative cursor-pointer group hover:text-[#9d4300] transition-colors ${activeRoute === 'menu' ? 'text-[#9d4300]' : 'text-slate-500'}`}
        >
          Menu
          {activeRoute === 'menu' && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
        </div>
        <div 
          onClick={() => onNavigate('cafes')} 
          className={`relative cursor-pointer group hover:text-[#9d4300] transition-colors ${activeRoute === 'cafes' ? 'text-[#9d4300]' : 'text-slate-500'}`}
        >
          Cafes
          {activeRoute === 'cafes' && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
        </div>
        <div 
          onClick={() => onNavigate('landing')} 
          className={`relative cursor-pointer group hover:text-[#9d4300] transition-colors ${activeRoute === 'landing' ? 'text-[#9d4300]' : 'text-slate-500'}`}
        >
          Story
          {activeRoute === 'landing' && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
        </div>
        <div 
          onClick={() => onNavigate('admin')} 
          className={`relative cursor-pointer group hover:text-[#9d4300] transition-colors ${activeRoute === 'admin' ? 'text-[#9d4300]' : 'text-slate-500'}`}
        >
          Admin
          {activeRoute === 'admin' && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
        </div>
        <div 
          onClick={handleAuthClick} 
          className={`relative cursor-pointer group hover:text-[#9d4300] transition-colors ${activeRoute === 'login' || activeRoute === 'register' ? 'text-[#9d4300]' : 'text-slate-500'}`}
        >
          {user ? 'Logout' : 'Account'}
          {(activeRoute === 'login' || activeRoute === 'register') && !user ? <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div> : null}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="material-symbols-outlined text-[20px] cursor-pointer text-slate-600 hover:text-black transition-colors hidden md:block">search</span>
        <button 
          onClick={() => onNavigate('checkout')} 
          className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-colors"
        >
          Cart (0)
        </button>
      </div>
    </nav>
  );
}
