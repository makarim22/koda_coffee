import React from 'react';
import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function CareersPage({ onNavigate, cart }: BaseProps) {
  return (
    <div className="bg-[#fcf8f7] text-slate-800 font-sans min-h-screen flex flex-col selection:bg-[#9d4300] selection:text-white">
      <div className="sticky top-0 z-50">
        <TopNavBar onNavigate={onNavigate} cart={cart} />
      </div>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-24 flex-grow w-full shrink-0">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Careers</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-lg leading-relaxed">
            Koda is always looking for passionate, driven individuals to join our team. Whether you're an experienced barista, 
            a curious roaster apprentice, or a logistics whiz, if you care deeply about quality and hospitality, we'd love to hear from you.
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-12 mb-4">Open Roles</h2>
          
          <div className="border border-slate-200 rounded-xl p-6 hover:border-[#9d4300] transition-colors bg-white">
            <h3 className="text-xl font-bold text-slate-800">Lead Barista</h3>
            <p className="text-sm font-medium text-slate-400 mb-4 mt-1">Downtown Roastery • Full Time</p>
            <p className="leading-relaxed mb-4">We are looking for an experienced coffee professional to lead service at our flagship location. 2+ years specialty coffee experience required.</p>
            <button className="text-[10px] font-bold uppercase tracking-widest text-[#9d4300]">Apply Now →</button>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 hover:border-[#9d4300] transition-colors bg-white">
            <h3 className="text-xl font-bold text-slate-800">Production Assistant</h3>
            <p className="text-sm font-medium text-slate-400 mb-4 mt-1">Roastery HQ • Part Time</p>
            <p className="leading-relaxed mb-4">Help us fulfill wholesale and retail orders. Detail-oriented and physical stamina required. No prior coffee experience necessary.</p>
            <button className="text-[10px] font-bold uppercase tracking-widest text-[#9d4300]">Apply Now →</button>
          </div>

          <p className="leading-relaxed mt-12">
            Don't see a role that fits? Send your resume and a cover letter to <a href="mailto:careers@kodacoffee.com" className="text-[#9d4300] underline font-medium">careers@kodacoffee.com</a>.
          </p>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
