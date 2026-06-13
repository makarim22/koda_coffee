import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';

const menuData = {
  espresso: [
    { id: 'e1', title: 'Signature Blend', origin: 'Colombia & Ethiopia', process: 'Washed', price: '$4.00', desc: 'Our flagship daily rider. Notes of dark chocolate, toasted hazelnut, and dark cherry with a creamy mouthfeel.', img: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=800', delay: 'delay-100' },
    { id: 'e2', title: 'Finca El Paraiso', origin: 'Colombia', process: 'Thermal Shock', price: '$5.50', desc: 'An experimental masterpiece. Passionfruit, lychee, and a bright, syrupy and highly acidic mouthfeel.', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800', delay: 'delay-200' },
    { id: 'e3', title: 'Ethiopia Guji Natural', origin: 'Ethiopia', process: 'Natural', price: '$5.00', desc: 'Wild and fruit-forward. Explodes with strawberry jam, ripe peach, and fragrant floral aromatics.', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800', delay: 'delay-300' },
    { id: 'e4', title: 'Colombia Decaf', origin: 'Colombia', process: 'Sugarcane Decaf', price: '$4.50', desc: 'Decaffeinated naturally using sugarcane process. Notes of brown sugar, red apple, and graham cracker.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800', delay: 'delay-100' },
  ],
  pourOver: [
    { id: 'p1', title: 'Yirgacheffe Washed', origin: 'Ethiopia', process: 'Washed', price: '$6.00', desc: 'Exceptionally clean and tea-like. Jasmine, bergamot, and a clean, lingering lemon-zest finish.', img: 'https://images.unsplash.com/photo-1544244015-0df4b3dfc584?auto=format&fit=crop&q=80&w=800', delay: 'delay-100' },
    { id: 'p2', title: 'Kenya AA', origin: 'Kenya', process: 'Washed', price: '$6.50', desc: 'Bold and savory-sweet. Blackcurrant, tomato vine, vibrant citrus acidity, and a juicy body.', img: 'https://images.unsplash.com/photo-1495474472205-1a3b194fb8db?auto=format&fit=crop&q=80&w=800', delay: 'delay-200' },
    { id: 'p3', title: 'Panama Geisha', origin: 'Panama', process: 'Washed', price: '$12.00', desc: 'The crown jewel of coffee. Delicate bergamot, jasmine, and complex tropical fruits. Farm-direct reserve.', img: 'https://images.unsplash.com/photo-1587049352847-81a56d773cac?auto=format&fit=crop&q=80&w=800', delay: 'delay-300' },
    { id: 'p4', title: 'Costa Rica Tarrazu', origin: 'Costa Rica', process: 'Honey', price: '$5.50', desc: 'Sweet and full-bodied. Honey processed for intense caramel sweetness, green apple, and smooth vanilla.', img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=800', delay: 'delay-100' },
  ],
  coldBrew: [
    { id: 'c1', title: 'Kyoto Style Drip', origin: 'House Blend', process: 'Slow Drip', price: '$6.50', desc: 'Tower dripped over 12 hours. Smooth, complex profile with cocoa nibs and sweet cream notes.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800', delay: 'delay-100' },
    { id: 'c2', title: 'Nitro Cold Brew', origin: 'Colombia', process: 'Immersion', price: '$5.50', desc: 'Infused with nitrogen for a rich, velvety non-dairy texture that mimics a perfect stout.', img: 'https://images.unsplash.com/photo-1517701550927-30cfcb64ac45?auto=format&fit=crop&q=80&w=800', delay: 'delay-200' },
    { id: 'c3', title: 'Classic Cold Brew', origin: 'Brazil', process: '18h Immersion', price: '$4.50', desc: 'Steeped for 18 hours. Bold, intensely chocolatey, and features extremely low acidity.', img: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=800', delay: 'delay-300' },
  ],
  pastries: [
    { id: 'pa1', title: 'Almond Croissant', origin: 'House Baked', process: 'Viennoiserie', price: '$4.75', desc: 'Twice baked, filled with house frangipane, hand-laminated pastry layers, and topped with toasted almonds.', img: 'https://images.unsplash.com/photo-1549725838-89c0bf2693fb?auto=format&fit=crop&q=80&w=800', delay: 'delay-100' },
    { id: 'pa2', title: 'Pain au Chocolat', origin: 'House Baked', process: 'Viennoiserie', price: '$4.50', desc: 'Flaky layers of buttery dough wrapped around dual dark chocolate batons sourced from Valrhona.', img: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&q=80&w=800', delay: 'delay-200' },
    { id: 'pa3', title: 'Cardamom Bun', origin: 'House Baked', process: 'Swedish Style', price: '$4.00', desc: 'Traditional Swedish style knot baked with freshly ground premium cardamom and coarse sugar.', img: 'https://images.unsplash.com/photo-1550411294-06baabc1eb14?auto=format&fit=crop&q=80&w=800', delay: 'delay-300' },
    { id: 'pa4', title: 'Seasonal Scone', origin: 'House Baked', process: 'Rotational', price: '$3.50', desc: 'Flavor rotates weekly based on available harvests. Served warm with a side of clotted cream.', img: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&q=80&w=800', delay: 'delay-100' },
  ]
};

export default function MenuPage({ onNavigate }: BaseProps) {
  const renderSection = (id: string, title: string, desc: string, items: any[]) => (
    <section id={id} className="scroll-mt-40">
      <header className="mb-12 border-b border-slate-200 pb-6 fade-in-up">
        <h2 className="text-3xl font-black mb-4">{title}</h2>
        <p className="text-[15px] font-medium leading-relaxed text-slate-500 max-w-xl">{desc}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {items.map((item) => (
          <article key={item.id} className={`group flex flex-col fade-in-up ${item.delay} cursor-pointer bg-white p-4 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300`} onClick={() => onNavigate('checkout')}>
            <div className="aspect-[4/3] overflow-hidden relative bg-[#f4f1eb] mb-6 rounded-[1.5rem]">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                {item.origin && <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-[#9d4300] shadow-sm">{item.origin}</span>}
                {item.process && <span className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm">{item.process}</span>}
              </div>
            </div>
            <div className="px-2 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                <span className="text-[14px] font-bold text-[#9d4300] shrink-0 mt-1">{item.price}</span>
              </div>
              <p className="text-[13px] font-medium leading-relaxed text-slate-500 mb-6 flex-1 pr-2">{item.desc}</p>
              <div className="flex items-center gap-3 group/btn mt-auto">
                <div className="w-8 h-[2px] bg-[#9d4300] transition-all group-hover/btn:w-12"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#9d4300]">Add to Order</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-[#fcf8f7] text-[#000000] font-['Outfit'] min-h-screen flex flex-col relative overflow-hidden selection:bg-[#9d4300] selection:text-white">
      <TopNavBar onNavigate={onNavigate} activeRoute="menu" />
      
      <main className="pt-16 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto flex-1 flex flex-col md:flex-row gap-16 w-full z-10">
        <aside className="w-full md:w-64 shrink-0 fade-in-up">
          <div className="sticky top-32">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-10">Menu</h1>
            
            {/* Desktop Sidebar List */}
            <nav className="hidden md:flex flex-col gap-6 border-l border-slate-200 pl-6">
              <a href="#espresso" className="text-[11px] uppercase tracking-widest font-bold text-black transition-colors hover:text-[#9d4300]">
                Espresso
              </a>
              <a href="#pour-over" className="text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:text-black transition-colors">
                Pour Over
              </a>
              <a href="#cold-brew" className="text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:text-black transition-colors">
                Cold Brew
              </a>
              <a href="#pastries" className="text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:text-black transition-colors">
                Pastries
              </a>
            </nav>

            {/* Mobile Horizon Scroll Pills */}
            <nav className="md:hidden flex gap-3 overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
              <a href="#espresso" className="whitespace-nowrap px-5 py-2.5 bg-black text-white rounded-full text-[10px] uppercase tracking-widest font-bold">
                Espresso
              </a>
              <a href="#pour-over" className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] uppercase tracking-widest font-bold">
                Pour Over
              </a>
              <a href="#cold-brew" className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] uppercase tracking-widest font-bold">
                Cold Brew
              </a>
              <a href="#pastries" className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] uppercase tracking-widest font-bold">
                Pastries
              </a>
            </nav>
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-20">
          {renderSection(
            'espresso', 
            'Espresso', 
            'Meticulously calibrated shots featuring our seasonal single origins and signature house blend. Designed for clarity and sweetness.',
            menuData.espresso
          )}
          {renderSection(
            'pour-over', 
            'Pour Over', 
            'Hand-brewed filter coffees showcasing the delicate nuances of terroir and processing methods. Served in a glass carafe.',
            menuData.pourOver
          )}
          {renderSection(
            'cold-brew', 
            'Cold Brew', 
            'Refreshingly cold selections steeped for several hours to extract a smooth, low-acid profile that highlights rich flavor notes.',
            menuData.coldBrew
          )}
          {renderSection(
            'pastries', 
            'Pastries', 
            'Freshly baked daily from our artisanal partners. Designed to complement our coffee offerings with balanced sweetness and texture.',
            menuData.pastries
          )}
        </div>
      </main>

      <footer className="bg-[#fcf8f7] py-16 mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-slate-200/60">
          <div 
            onClick={() => onNavigate('landing')}
            className="text-2xl font-extrabold tracking-tighter cursor-pointer"
          >
            Koda
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 font-semibold text-[11px] uppercase tracking-widest text-[#9d4300]/60">
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
