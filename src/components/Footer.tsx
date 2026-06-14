import React from 'react';
import { BaseProps } from '../types';

export default function Footer({ onNavigate }: BaseProps) {
  return (
    <footer className="w-full mt-auto py-12 border-t border-[#1a1a1a]/10 bg-[#fcf8f7]">
      <div className="flex flex-col lg:flex-row justify-between items-center px-6 md:px-12 max-w-[1400px] mx-auto gap-8">
        <div 
          onClick={() => onNavigate('landing')} 
          className="text-2xl font-black tracking-tighter cursor-pointer text-slate-800"
        >
          Koda
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 font-semibold text-[11px] uppercase tracking-widest text-[#9d4300]/60">
          <span onClick={() => onNavigate('sustainability')} className="hover:text-[#9d4300] cursor-pointer transition-colors">Sustainability</span>
          <span onClick={() => onNavigate('wholesale')} className="hover:text-[#9d4300] cursor-pointer transition-colors">Wholesale</span>
          <span onClick={() => onNavigate('careers')} className="hover:text-[#9d4300] cursor-pointer transition-colors">Careers</span>
          <span onClick={() => onNavigate('privacy')} className="hover:text-[#9d4300] cursor-pointer transition-colors">Privacy</span>
          <span onClick={() => onNavigate('terms')} className="hover:text-[#9d4300] cursor-pointer transition-colors">Terms of Service</span>
        </div>

        <div className="text-[11px] font-medium text-slate-400">
          © 2024 Koda Coffee Roasters. Ethically sourced, editorial by design.
        </div>
      </div>
    </footer>
  );
}
