import { BaseProps } from '../types';
import { useState } from 'react';

export default function ResetPasswordPage({ onNavigate }: BaseProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#f2f0ea] text-[#1a1a1a] font-serif min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#c5a059] selection:text-white pb-24">
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-[#e8e4d8] -z-10 opacity-70 blur-3xl mix-blend-multiply"></div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center z-10 py-24 min-h-screen">
        
        {/* Header/Logo */}
        <div className="absolute top-12 left-6 md:left-12 cursor-pointer z-20" onClick={() => onNavigate('landing')}>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-[#1a1a1a]">Koda Coffee</span>
        </div>

        <div className="w-full max-w-sm flex flex-col fade-in-up">
          
          <div className="mb-16">
            {!submitted ? (
              <>
                <h1 className="text-5xl font-bold italic mb-6">Reset</h1>
                <p className="font-sans text-xs tracking-widest opacity-70 leading-relaxed">
                  Enter the email address associated with your account, and we'll send you a secure link.
                </p>
                <form 
                  className="space-y-12 mt-12" 
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                  <div className="space-y-4">
                    <label htmlFor="email" className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 opacity-40">mail</span>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="name@example.com" 
                        required 
                        className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 pl-10 pr-4 font-sans text-sm focus:border-[#1a1a1a] transition-colors outline-none" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-6 bg-[#1a1a1a] text-[#f2f0ea] font-sans text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#c5a059] transition-colors cursor-pointer outline-none mt-8 flex justify-center items-center gap-4">
                    Send Link
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-8 fade-in-up">
                <div className="w-16 h-16 border border-[#c5a059] flex items-center justify-center mx-auto mb-4 text-[#c5a059] rounded-full">
                  <span className="material-symbols-outlined text-[32px]">check</span>
                </div>
                <h2 className="text-3xl font-bold italic">Check Inbox</h2>
                <p className="font-sans text-xs tracking-widest opacity-70 leading-relaxed">
                  We've sent recovery instructions. Please check your spam folder if you don't see it soon.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center pt-8 border-t border-[#1a1a1a]/10">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
              className="inline-flex items-center gap-4 font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 hover:opacity-100 transition-opacity group"
            >
              <span className="material-symbols-outlined text-[14px] group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
              Back to Sign In
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
