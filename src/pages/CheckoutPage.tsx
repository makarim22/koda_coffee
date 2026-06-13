import { useState } from 'react';
import { BaseProps } from '../types';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';

export default function CheckoutPage({ onNavigate }: BaseProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onNavigate('landing');
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#fcf8f7] text-[#000000] font-['Outfit'] min-h-screen selection:bg-[#9d4300] selection:text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white shadow-xl flex items-center justify-center text-[#9d4300] rounded-full mb-8 fade-in-up">
          <span className="material-symbols-outlined text-[40px] font-bold">check</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 fade-in-up delay-100 tracking-tight">Order Confirmed</h1>
        <p className="text-slate-600 font-medium text-[15px] max-w-sm mb-12 fade-in-up delay-200">
          Your coffee experience is being prepared.
        </p>
        <button onClick={() => onNavigate('landing')} className="fade-in-up delay-300 bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf8f7] text-[#000000] font-['Outfit'] min-h-screen selection:bg-[#9d4300] selection:text-white pb-12 flex flex-col">
      
      <TopNavBar onNavigate={onNavigate} activeRoute="checkout" />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start z-10 w-full flex-grow">
        
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10 fade-in-up">
          <header>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Complete your order</h1>
            <p className="text-slate-600 font-medium text-[15px]">
              Almost there. Please review your details below to ensure a smooth handoff.
            </p>
          </header>

          <section className="bg-white rounded-[1rem] p-1.5 flex shadow-sm border border-slate-100 max-w-xl">
            <button className="flex-1 py-3.5 bg-black text-white rounded-[0.8rem] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Delivery
            </button>
            <button className="flex-1 py-3.5 bg-transparent text-slate-500 hover:text-black rounded-[0.8rem] text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Pickup
            </button>
          </section>

          <form className="flex flex-col gap-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">1</span>
                Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">First Name</label>
                  <input type="text" id="firstName" placeholder="Jane" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Last Name</label>
                  <input type="text" id="lastName" placeholder="Doe" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Email Address</label>
                  <input type="email" id="email" placeholder="jane.doe@example.com" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">2</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="street" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Street Address</label>
                  <input type="text" id="street" placeholder="123 Roaster Way, Apt 4B" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">City</label>
                  <input type="text" id="city" placeholder="Portland" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="zip" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Zip Code</label>
                  <input type="text" id="zip" placeholder="97204" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">3</span>
                Payment
              </h2>
              
              <div className="bg-white border-2 border-[#9d4300] rounded-2xl p-5 mb-6 flex items-center justify-between cursor-pointer shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[#9d4300]/5 pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <span className="material-symbols-outlined text-[28px] text-black">credit_card</span>
                  <div>
                    <p className="text-sm font-bold text-black mb-0.5">Credit Card</p>
                    <p className="text-[13px] text-slate-500 font-medium">Secure encrypted transaction</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-[5px] border-[#9d4300] bg-white relative z-10"></div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="card" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Card Number</label>
                    <div className="relative">
                      <input type="text" id="card" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">credit_card</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="exp" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Expiration</label>
                    <input type="text" id="exp" placeholder="MM/YY" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cvv" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">CVV</label>
                    <input type="text" id="cvv" placeholder="123" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4 relative fade-in-up delay-200">
          <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-8 border border-slate-100">
            <h3 className="text-xl font-bold">Order Summary</h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-xl shrink-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Ethiopian Yirgacheffe Pour Over" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm">Ethiopian Yirgacheffe Pour Over</h4>
                    <span className="font-semibold text-sm">$6.50</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mb-3">Light Roast, Floral Notes</p>
                  <div className="flex items-center gap-3">
                    <button className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-black hover:text-black transition-colors">
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </button>
                    <span className="text-[13px] font-bold w-2 text-center">1</span>
                    <button className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-black hover:text-black transition-colors">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-xl shrink-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1549725838-89c0bf2693fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Almond Croissant" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm">Almond Croissant</h4>
                    <span className="font-semibold text-sm">$4.75</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mb-3">Twice baked, house frangipane</p>
                  <div className="flex items-center gap-3">
                    <button className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-black hover:text-black transition-colors">
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </button>
                    <span className="text-[13px] font-bold w-2 text-center">1</span>
                    <button className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-black hover:text-black transition-colors">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-slate-100 text-[13px] font-medium text-slate-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">$11.25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  Delivery Fee
                  <span className="material-symbols-outlined text-[14px] text-slate-400">info</span>
                </span>
                <span className="font-bold text-slate-800">$3.99</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxes</span>
                <span className="font-bold text-slate-800">$1.02</span>
              </div>
              
              <div className="flex justify-between items-end mt-4 pt-6 border-t border-slate-100">
                <span className="text-xl font-bold text-black">Total</span>
                <span className="text-3xl font-black text-black tracking-tight">$16.26</span>
              </div>
            </div>

            <button 
              onClick={(e) => { e.preventDefault(); handleCheckout(); }} 
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-black/80 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors mt-2 flex justify-center items-center gap-3 shadow-md"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
              {!isSubmitting && <span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
            </button>
            <p className="text-center text-[10px] text-slate-500 font-medium">
              By confirming, you agree to Koda's Terms of Service.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#fcf8f7] py-16 mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8 pt-8">
          <div 
            onClick={() => onNavigate('landing')}
            className="text-2xl font-extrabold tracking-tighter cursor-pointer"
          >
            Koda
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 font-semibold text-[11px] uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-black transition-colors">Sustainability</a>
            <a href="#" className="hover:text-black transition-colors">Wholesale</a>
            <a href="#" className="hover:text-black transition-colors">Careers</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            © 2024 Koda Coffee Roasters. Ethically sourced, editorial by design.
          </div>
        </div>
      </footer>
    </div>
  );
}
