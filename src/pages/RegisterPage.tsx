import { BaseProps } from '../types';
import { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import { registerUser } from '../auth';

export default function RegisterPage({ onNavigate }: BaseProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await registerUser(name, email, password);
      onNavigate('landing');
    } catch (err: any) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f2f0ea] text-[#1a1a1a] font-serif min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#c5a059] selection:text-white pb-24 border-b border-transparent">
      {/* Background Graphic Element */}
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[60rem] h-[60rem] rounded-full bg-[#e8e4d8] -z-10 opacity-70 blur-2xl"></div>

      <div className="fixed top-0 w-full z-50">
        <TopNavBar onNavigate={onNavigate} activeRoute="register" />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-32 items-center px-6 md:px-12 pt-32">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] italic">
            Join the<br/>Craft.
          </h1>
          <p className="font-sans text-xs tracking-widest leading-relaxed opacity-70 max-w-sm">
            Experience editorial coffee roasting. Sign up to manage your subscriptions and explore our finest roasts.
          </p>
          <div className="mt-12 group w-full max-w-md aspect-[3/4] relative overflow-hidden bg-[#e8e4d8]">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLacUn6jRlWqbUHYCJYM6ixkIpMEjzA_z3D1cxqC-JxOokUgpPs0nuqClgtQK3JqWwGvZwuSiMih5g-FrFT9NRUXbcyO3wSjBFqOHhwQFOIeA3SAiedxn8hfPTCi71rTK7FGleKF5-ag9p_IXq9XOzexDa0WPmrzXTgQ5eSA2FVZ9oxfmzE3yoDMuRL3wkIneEkSaqx0tbcWI26PPqv5urK64XR2AA8UqYoLG10Aac4aIzdbDx_MkP4R_X2WfTBmexZ2LjgVdGU-4" 
              alt="Pour over coffee being prepared" 
              className="w-full h-full object-cover mix-blend-multiply opacity-80 grayscale contrast-125 transform transition-transform duration-[2s] group-hover:scale-110" 
            />
            <div className="absolute inset-0 border border-white/20 m-6 pointer-events-none"></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center fade-in-up delay-200">
          <div className="w-full max-w-md flex flex-col">
            <div className="mb-16">
              <h2 className="text-4xl font-bold italic mb-4">Register</h2>
              <p className="font-sans text-[10px] uppercase tracking-widest opacity-70">
                Already have an account?{' '}
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
                  className="font-bold text-[#1a1a1a] hover:text-[#c5a059] transition-colors border-b border-[#1a1a1a]/20 hover:border-[#c5a059] pb-1 ml-2"
                >
                  Sign In
                </a>
              </p>
            </div>
            
            <form className="space-y-12" onSubmit={handleSubmit}>
              {error && (
                <div className="text-red-500 font-sans text-xs bg-red-50 p-3 border border-red-200">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <label htmlFor="name" className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 opacity-40">person</span>
                  <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 pl-10 pr-4 font-sans text-sm focus:border-[#1a1a1a] transition-colors outline-none" />
                </div>
              </div>
              
              <div className="space-y-4">
                <label htmlFor="email" className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 opacity-40">mail</span>
                  <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" required className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 pl-10 pr-4 font-sans text-sm focus:border-[#1a1a1a] transition-colors outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="password" className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Password</label>
                <div className="relative border-b border-[#1a1a1a]/20 focus-within:border-[#1a1a1a] transition-colors">
                  <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 opacity-40">lock</span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                    className="w-full bg-transparent py-4 pl-10 pr-12 font-sans text-sm outline-none" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer outline-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start mt-8 pt-4">
                <div className="flex items-center h-5">
                  <input type="checkbox" id="newsletter" name="newsletter" className="w-4 h-4 border-[#1a1a1a]/20 text-[#1a1a1a] bg-transparent focus:ring-0 cursor-pointer outline-none appearance-none checked:bg-[#1a1a1a] shadow-none rounded-none border transition-colors" />
                </div>
                <div className="ml-4 text-sm">
                  <label htmlFor="newsletter" className="font-sans text-[10px] uppercase tracking-widest opacity-70 cursor-pointer select-none">
                    Subscribe to editorial brew guides
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button type="submit" disabled={isLoading} className="w-full py-6 bg-[#1a1a1a] text-[#f2f0ea] font-sans text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#c5a059] transition-colors cursor-pointer outline-none mt-4 flex justify-center items-center gap-4 disabled:opacity-50">
                  {isLoading ? 'Creating...' : 'Create Account'}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </form>
            <p className="mt-12 text-center font-sans text-[9px] uppercase tracking-[0.2em] opacity-40 max-w-[250px] mx-auto leading-relaxed">
              By creating an account, you agree to our <a href="#" className="border-b border-[#1a1a1a]/20 hover:border-[#1a1a1a] transition-colors pb-0.5">Terms</a> and <a href="#" className="border-b border-[#1a1a1a]/20 hover:border-[#1a1a1a] transition-colors pb-0.5">Privacy Policy</a>.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
