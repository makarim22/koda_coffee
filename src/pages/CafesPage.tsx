import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function CafesPage({ onNavigate }: BaseProps) {
  return (
    <div className="bg-[#fcf8f7] text-[#000000] font-['Outfit'] selection:bg-[#9d4300] selection:text-white min-h-screen flex flex-col relative overflow-hidden">
      
      <TopNavBar onNavigate={onNavigate} activeRoute="cafes" />
      
      <main className="flex flex-col lg:flex-row flex-1 pt-12 px-6 md:px-12 max-w-[1400px] mx-auto w-full gap-12 lg:gap-20 z-10 pb-24">
        {/* Left Panel: Cafe List */}
        <section className="w-full lg:w-[450px] shrink-0 h-full flex flex-col">
          <div className="pb-8 shrink-0 fade-in-up">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Locations</h1>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input type="text" placeholder="Search city or zip..." className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none shadow-sm" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto mt-4 pr-4" style={{scrollbarWidth: 'none'}}>
            <div className="group cursor-pointer fade-in-up delay-100 flex flex-col pt-8 pb-8 border-t border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">Senopati Roastery</h2>
                <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-[#9d4300]/10 text-[#9d4300] rounded-full font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9d4300] animate-pulse"></span> Open
                </span>
              </div>
              <p className="text-[14px] font-medium leading-relaxed text-slate-500 mb-6">Jl. Senopati No.43<br/>Jakarta Selatan, 12190</p>
              <div className="flex items-center gap-6 mt-auto">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-[11px] uppercase tracking-widest font-bold">7am - 9pm</span>
                </div>
                <div 
                  className="flex items-center gap-2 text-[#9d4300] transition-transform group-hover:translate-x-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://www.google.com/maps/dir/?api=1&destination=-6.230752,106.808899', '_blank');
                  }}
                >
                  <span className="text-[11px] uppercase tracking-widest font-bold">Get Directions</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer fade-in-up delay-200 flex flex-col pt-8 pb-8 border-t border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">Menteng Lab</h2>
                <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-[#9d4300]/10 text-[#9d4300] rounded-full font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9d4300] animate-pulse"></span> Open
                </span>
              </div>
              <p className="text-[14px] font-medium leading-relaxed text-slate-500 mb-6">Jl. Teuku Cik Ditiro No.36<br/>Jakarta Pusat, 10310</p>
              <div className="flex items-center gap-6 mt-auto">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-[11px] uppercase tracking-widest font-bold">7am - 8pm</span>
                </div>
                <div 
                  className="flex items-center gap-2 text-[#9d4300] transition-transform group-hover:translate-x-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://www.google.com/maps/dir/?api=1&destination=-6.195325,106.836471', '_blank');
                  }}
                >
                  <span className="text-[11px] uppercase tracking-widest font-bold">Get Directions</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer fade-in-up delay-300 flex flex-col pt-8 pb-8 border-t border-slate-200 opacity-60">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">Sudirman Kiosk</h2>
                <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-bold flex items-center gap-1.5">
                  Closed
                </span>
              </div>
              <p className="text-[14px] font-medium leading-relaxed text-slate-500 mb-6">SCBD Park, Lot 8<br/>Jakarta Selatan, 12190</p>
              <div className="flex items-center gap-6 mt-auto">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-[11px] uppercase tracking-widest font-bold">Opens 8am Tmrw</span>
                </div>
                <div 
                  className="flex items-center gap-2 text-[#9d4300] transition-transform group-hover:translate-x-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://www.google.com/maps/dir/?api=1&destination=-6.223596,106.807755', '_blank');
                  }}
                >
                  <span className="text-[11px] uppercase tracking-widest font-bold">Get Directions</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Map Area */}
        <section className="flex-1 relative overflow-hidden min-h-[500px] bg-slate-100 rounded-3xl fade-in-up shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          {!hasValidKey ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fcf8f7] p-8 text-center z-20">
              <div className="w-16 h-16 bg-white shadow-sm flex items-center justify-center text-[#9d4300] rounded-full mb-6">
                <span className="material-symbols-outlined text-[32px]">map</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Interactive Map Disabled</h2>
              <p className="text-[14px] text-slate-500 font-medium max-w-sm mx-auto">
                Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> in AI Studio settings to view store locations on the map.
              </p>
            </div>
          ) : (
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultCenter={{lat: -6.216, lng: 106.820}}
                defaultZoom={13}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{width: '100%', height: '100%'}}
              >
                <AdvancedMarker position={{lat: -6.230752, lng: 106.808899}} title="Senopati Roastery">
                  <Pin background="#9d4300" borderColor="#9d4300" glyphColor="#fff" />
                </AdvancedMarker>
                <AdvancedMarker position={{lat: -6.195325, lng: 106.836471}} title="Menteng Lab">
                  <Pin background="#9d4300" borderColor="#9d4300" glyphColor="#fff" />
                </AdvancedMarker>
                <AdvancedMarker position={{lat: -6.223596, lng: 106.807755}} title="Sudirman Kiosk">
                  <Pin background="#000000" borderColor="#000000" glyphColor="#fff" />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          )}
        </section>
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
