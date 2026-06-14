import React from 'react';
import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function WholesalePage({ onNavigate, cart }: BaseProps) {
  return (
    <div className="bg-[#fcf8f7] text-slate-800 font-sans min-h-screen flex flex-col selection:bg-[#9d4300] selection:text-white">
      <div className="sticky top-0 z-50">
        <TopNavBar onNavigate={onNavigate} cart={cart} />
      </div>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-24 flex-grow w-full shrink-0">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Wholesale Partners</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-lg leading-relaxed">
            We love working with like-minded cafes, restaurants, and businesses who share our passion for exceptional coffee 
            and meticulous service. When you partner with Koda, you're getting more than just beans; you're getting a dedicated coffee program.
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-12 mb-4">What We Offer</h2>
          <ul className="list-disc pl-5 space-y-2">
             <li>Consistent, freshly roasted coffee tailored to your equipment and volume.</li>
             <li>Comprehensive barista training and ongoing education.</li>
             <li>Equipment consultation, sourcing, and preventative maintenance partnerships.</li>
             <li>Direct communication lines with our roasting and quality control teams.</li>
          </ul>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-12 mb-4">Get in Touch</h2>
          <p className="leading-relaxed">
            Interested in pouring Koda? Get in touch with our wholesale team at <a href="mailto:wholesale@kodacoffee.com" className="text-[#9d4300] underline font-medium">wholesale@kodacoffee.com</a>. 
            Please include a brief description of your business, location, and projected weekly volume.
          </p>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
