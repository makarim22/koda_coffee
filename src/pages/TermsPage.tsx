import React from 'react';
import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function TermsPage({ onNavigate, cart }: BaseProps) {
  return (
    <div className="bg-[#fcf8f7] text-slate-800 font-sans min-h-screen flex flex-col selection:bg-[#9d4300] selection:text-white">
      <div className="sticky top-0 z-50">
        <TopNavBar onNavigate={onNavigate} cart={cart} />
      </div>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-24 flex-grow w-full shrink-0">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">2. Use License</h2>
          <p className="leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on Koda Coffee Roasters's website for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">3. Disclaimer</h2>
          <p className="leading-relaxed">
            The materials on Koda Coffee Roasters's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">4. Limitations</h2>
          <p className="leading-relaxed">
            In no event shall Koda Coffee Roasters or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
          </p>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
