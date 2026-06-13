import { BaseProps } from '../types';
import { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import { loginUser } from '../auth';

export default function LoginPage({ onNavigate }: BaseProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginUser(email, password);
      onNavigate('landing');
    } catch (err: any) {
      setError(err.message || 'Failed to login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f2f0ea] text-[#1a1a1a] font-serif min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#c5a059] selection:text-white">
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-[#e8e4d8] -z-10 opacity-70 blur-3xl mix-blend-multiply"></div>

      <div className="fixed top-0 w-full z-50">
        <TopNavBar onNavigate={onNavigate} activeRoute="login" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center z-10 py-24 min-h-screen pt-32">
        
        <div className="w-full max-w-sm flex flex-col">
          
          <div className="mb-16 text-center fade-in-up">
            <h1 className="text-5xl font-bold italic mb-6">Sign In</h1>
            <p className="font-sans text-xs tracking-widest opacity-70">Enter your details to access your roasts.</p>
          </div>

          <form className="space-y-12 fade-in-up delay-100" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 font-sans text-xs bg-red-50 p-3 border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <label htmlFor="email" className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-70 ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 opacity-40">mail</span>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 pl-10 pr-4 font-sans text-sm focus:border-[#1a1a1a] transition-colors outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Password</label>
              </div>
              <div className="relative border-b border-[#1a1a1a]/20 focus-within:border-[#1a1a1a] transition-colors">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 opacity-40">lock</span>
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-transparent py-4 pl-10 pr-12 font-sans text-sm outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer outline-none">
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              <div className="text-right mt-2">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('reset-password'); }} className="font-sans text-[9px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Forgot Password?</a>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-6 bg-[#1a1a1a] text-[#f2f0ea] font-sans text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#c5a059] transition-colors cursor-pointer outline-none mt-8 flex justify-center items-center gap-4 disabled:opacity-50">
              {isLoading ? 'Signing In...' : 'Sign In'}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          <div className="mt-16 text-center fade-in-up delay-200">
            <p className="font-sans text-[10px] uppercase tracking-widest opacity-70">
              Don't have an account?{' '}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('register'); }}
                className="font-bold text-[#1a1a1a] hover:text-[#c5a059] transition-colors border-b border-[#1a1a1a]/20 hover:border-[#c5a059] pb-1 ml-2"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
