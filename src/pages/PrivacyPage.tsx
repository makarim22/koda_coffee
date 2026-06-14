import React from 'react';
import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function PrivacyPage({ onNavigate, cart }: BaseProps) {
  return (
    <div className="bg-[#fcf8f7] text-slate-800 font-sans min-h-screen flex flex-col selection:bg-[#9d4300] selection:text-white">
      <div className="sticky top-0 z-50">
        <TopNavBar onNavigate={onNavigate} cart={cart} />
      </div>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-24 flex-grow w-full shrink-0">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">1. Information We Collect</h2>
          <p className="leading-relaxed">
            We collect information you provide directly to us, such as when you create an account, place an order, or communicate with us. 
            This may include your name, email address, phone number, shipping and billing address, and payment information.
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We use the information we collect to process your transactions, communicate with you regarding your orders, 
            provide customer support, and improve our services.
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">3. Information Sharing</h2>
          <p className="leading-relaxed">
            We do not sell or rent your personal information to third parties. We may share your information with trusted 
            service providers who assist us in operating our website, conducting our business, or serving our users, so long 
            as those parties agree to keep this information confidential.
          </p>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-8 mb-4">4. Security</h2>
          <p className="leading-relaxed">
            We implement reasonable security measures to protect the integrity and security of your personal information. 
            However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
