import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';

export default function LandingPage({ onNavigate }: BaseProps) {
  return (
    <div className="bg-[#fcf8f7] text-[#000000] min-h-screen font-['Outfit'] selection:bg-[#9d4300] selection:text-white">
      
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <TopNavBar onNavigate={onNavigate} activeRoute="landing" />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] bg-black mt-[88px] flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=2574&auto=format&fit=crop" 
          alt="Coffee Roaster" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-xl">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e09121] mb-6">EST. 2024</div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight">
              Our Craft,<br />
              Our Story
            </h1>
          </div>
        </div>
      </section>

      {/* The Origin Section */}
      <section className="py-24 md:py-32 bg-[#fcf8f7]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 text-[#1a1a1a]">THE ORIGIN</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6 text-[15px]">
              We begin where the air is thin and the soil is rich. Our journey starts in the volcanic foothills of high-altitude farms, where every cherry is hand-picked at its peak of ripeness.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed text-[15px]">
              Ethical sourcing isn't a checkbox for us; it's the foundation of our existence. We trade directly with farmers, ensuring that the excellence in your cup translates to prosperity in the fields.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=1740&auto=format&fit=crop" 
                alt="Coffee farm landscape" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Precision as Art Section */}
      <section className="py-24 md:py-32 bg-[#0c0c0c] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16 md:mb-24">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e09121] mb-4">LOCATED IN THE ARTS DISTRICT</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Precision as Art</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <div className="rounded-[2.5rem] overflow-hidden aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=2669&auto=format&fit=crop" 
                  alt="Industrial roastery interior" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-12">
              <div className="pl-6 border-l-2 border-[#e09121]">
                <h3 className="text-2xl font-black mb-4">Editorial Expression</h3>
                <p className="text-[#a0a0a0] font-medium leading-relaxed text-[15px]">
                  Every batch is a dialogue between the roaster and the bean. We utilize modern thermal profiling to unlock the unique "editorial expression" of each harvest, highlighting floral notes and complex acids.
                </p>
              </div>
              <div className="pl-6 border-l-2 border-white/20">
                <h3 className="text-2xl font-black mb-4">Micro-Batch Philosophy</h3>
                <p className="text-[#a0a0a0] font-medium leading-relaxed text-[15px]">
                  We reject mass production. By roasting in small, controlled quantities, we maintain a level of precision that large-scale operations simply cannot replicate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Collective Section */}
      <section className="py-24 md:py-32 bg-[#f6f3f0]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">The Collective</h2>
            <p className="text-slate-500 font-medium text-[15px]">The masters of the craft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col">
              <div className="bg-[#e4d9ca] rounded-[1.5rem] w-full aspect-[3/4] mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop" alt="Julian Vance" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-xl font-bold mb-1">Julian Vance</h3>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#9d4300]">HEAD ROASTER</p>
            </div>
            <div className="flex flex-col">
              <div className="bg-[#e0deda] rounded-[1.5rem] w-full aspect-[3/4] mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop" alt="Elena Rossi" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-xl font-bold mb-1">Elena Rossi</h3>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#9d4300]">SENSORY LEAD</p>
            </div>
            <div className="flex flex-col">
              <div className="bg-[#d2cbc3] rounded-[1.5rem] w-full aspect-[3/4] mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop" alt="Marcus Thorne" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-xl font-bold mb-1">Marcus Thorne</h3>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#9d4300]">SOURCING DIRECTOR</p>
            </div>
            <div className="flex flex-col">
              <div className="bg-[#e8e4d8] rounded-[1.5rem] w-full aspect-[3/4] mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop" alt="Sara Chen" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-xl font-bold mb-1">Sara Chen</h3>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#9d4300]">SUSTAINABILITY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 md:py-32 bg-[#fcf8f7]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl md:text-6xl font-black text-[#b7410e]">98%</span>
                <div className="w-[1px] h-10 bg-slate-200"></div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-500 max-w-[100px]">SUSTAINABILITY SCORE</span>
              </div>
              <h3 className="text-3xl font-black mb-6">Zero-Waste Commitment</h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 text-[15px]">
                We believe that luxury should not cost the earth. From our fully compostable bags to our zero-emission roasting tech, Koda is built to leave no trace. Every decision is measured against its ecological impact.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-[#b7410e] font-extrabold text-[12px] uppercase tracking-widest hover:gap-4 transition-all">
                Read the Impact Report 
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-[#1a2b27] rounded-[2rem] aspect-square overflow-hidden flex items-center justify-center p-8">
                <img 
                  src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=2670&auto=format&fit=crop" 
                  alt="Coffee bag on stand" 
                  className="w-full h-full object-contain filter drop-shadow-2xl mix-blend-luminosity opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Taste the Narrative / Footer CTA */}
      <section className="py-24 bg-[#fcf8f7]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Taste the Narrative.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('menu')} className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full text-[11px] font-extrabold uppercase tracking-[0.1em] hover:bg-black/80 transition-colors">
              Shop Subscriptions
            </button>
            <button onClick={() => onNavigate('cafes')} className="w-full sm:w-auto bg-transparent border border-[#d2cbc3] text-[#9d4300] px-8 py-4 rounded-full text-[11px] font-extrabold uppercase tracking-[0.1em] hover:bg-[#fff9ef] transition-colors">
              Find a Cafe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fcf8f7] py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 pt-8">
          <div 
            onClick={() => onNavigate('landing')}
            className="text-2xl font-black tracking-tighter cursor-pointer"
          >
            Koda
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 font-extrabold text-[10px] uppercase tracking-widest text-[#9d4300]/60">
            <a href="#" className="hover:text-[#9d4300] transition-colors">Sustainability</a>
            <a href="#" className="hover:text-[#9d4300] transition-colors">Wholesale</a>
            <a href="#" className="hover:text-[#9d4300] transition-colors">Careers</a>
            <a href="#" className="hover:text-[#9d4300] transition-colors">Privacy</a>
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            © 2024 Koda Coffee Roasters. Ethically sourced, editorial by design.
          </div>
        </div>
      </footer>
    </div>
  );
}


