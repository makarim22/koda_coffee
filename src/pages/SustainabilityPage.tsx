import React from 'react';
import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function SustainabilityPage({ onNavigate, cart }: BaseProps) {
  return (
    <div className="bg-[#fcf8f7] text-slate-800 font-sans min-h-screen flex flex-col selection:bg-[#9d4300] selection:text-white">
      <div className="sticky top-0 z-50">
        <TopNavBar onNavigate={onNavigate} cart={cart} />
      </div>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-24 flex-grow w-full shrink-0">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Sustainability</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-lg leading-relaxed">
            At Koda, we believe that great coffee shouldn't come at the expense of our planet or the communities that grow it. 
            Our commitment to sustainability is woven into every aspect of our business, from seed to cup.
          </p>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-12 mb-4">Ethical Sourcing</h2>
          <p className="leading-relaxed">
            We work directly with smallholder farmers and cooperatives worldwide. By bypassing traditional commodity markets, 
            we ensure that a significantly larger portion of the retail price goes directly to the people growing the coffee. 
            We pay premium prices for premium quality, providing financial stability and allowing farmers to invest in sustainable agricultural practices.
          </p>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-12 mb-4">Environmental Impact</h2>
          <p className="leading-relaxed">
            Our roastery operates on 100% renewable energy. We use state-of-the-art Loring roasters which recirculate hot air, 
            eliminating the need for an afterburner and reducing our energy consumption and greenhouse gas emissions by up to 80% compared to conventional roasters.
          </p>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-12 mb-4">Packaging & Waste Tracking</h2>
          <p className="leading-relaxed">
            All of our coffee bags are fully compostable, made from plant-based materials. Our shipping boxes are 100% recycled 
            and recyclable. We are continuously working towards a zero-waste goal for our cafe and roastery operations by composting 
            chaff, spent coffee grounds, and partnering with local sustainable waste management initiatives.
          </p>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
