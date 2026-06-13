import { useState } from 'react';
import { BaseProps } from '../types';
import { 
  Building2, 
  TrendingUp, 
  Package, 
  Star, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search, 
  LogOut,
  Calendar,
  MoreHorizontal,
  Archive
} from 'lucide-react';

type AdminTab = 'overview' | 'menu' | 'orders';

export default function AdminPage({ onNavigate }: BaseProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <div className="bg-[#fcf8f7] text-[#1a1a1a] font-serif min-h-screen flex flex-col selection:bg-[#9d4300] selection:text-white">
      {/* Admin Nav */}
      <nav className="w-full bg-white z-50 flex items-center justify-between px-6 md:px-12 py-6 sticky top-0 border-b border-[#1a1a1a]/10">
        <div 
          onClick={() => onNavigate('landing')}
          className="text-3xl font-black tracking-tighter cursor-pointer"
        >
          Koda<span className="text-[#9d4300] text-lg align-top ml-1">Admin</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-slate-500">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`relative group hover:text-[#9d4300] transition-colors ${activeTab === 'overview' ? 'text-[#9d4300]' : ''}`}
          >
            Overview
            {activeTab === 'overview' && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('menu')} 
            className={`relative group hover:text-[#9d4300] transition-colors ${activeTab === 'menu' ? 'text-[#9d4300]' : ''}`}
          >
            Menu Control
            {activeTab === 'menu' && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`relative group hover:text-[#9d4300] transition-colors ${activeTab === 'orders' ? 'text-[#9d4300]' : ''}`}
          >
            Orders
            {activeTab === 'orders' && <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#9d4300]"></div>}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-sm font-sans font-medium text-slate-500 hover:text-black transition-colors">
            <LogOut size={16} />
            <span>Exit Admin</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        {activeTab === 'overview' && <DashboardTab />}
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'orders' && <OrdersTab />}
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#1a1a1a]/10 px-6 md:px-12 py-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h2 className="text-2xl font-black tracking-tighter mb-4">Koda</h2>
            <p className="text-[#8c8c8c] text-sm font-sans max-w-xs">© 2024 Koda Coffee Roastery. Editorial Minimalism.</p>
          </div>
          <div className="flex gap-8 font-sans text-xs font-medium text-[#8c8c8c]">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-black transition-colors">Sustainability</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="fade-in-up">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Dashboard</h1>
          <p className="text-slate-600 font-sans text-sm">Welcome back. Here is what's happening at the roastery today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-5 py-3 rounded-full border border-slate-200 text-xs font-sans font-bold">
          <Calendar size={14} className="text-[#9d4300]" />
          <span>NOV 24, 2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[#2E7D32] font-sans font-bold text-sm">+12.5%</div>
          <div className="w-12 h-12 rounded-full bg-[#fcf8f7] flex items-center justify-center mb-12 text-[#9d4300]">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">Total Revenue</h3>
          <p className="text-4xl font-black tracking-tight">$42,890.00</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[#C62828] font-sans font-bold text-sm">24 pending</div>
          <div className="w-12 h-12 rounded-full bg-[#fcf8f7] flex items-center justify-center mb-12 text-[#9d4300]">
            <Package size={20} />
          </div>
          <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">Active Orders</h3>
          <p className="text-4xl font-black tracking-tight">156</p>
        </div>

        <div className="bg-[#1a1a1a] text-white p-8 rounded-3xl shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-6 right-6 text-white/80 font-sans font-bold text-sm">Trending</div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-12 text-white">
            <Star size={20} />
          </div>
          <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-white/60 mb-2">Top Roasts</h3>
          <p className="text-3xl font-black tracking-tight leading-tight">Ethiopia Yirgacheffe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <button className="text-[#9d4300] text-sm font-sans font-bold hover:underline">View All</button>
          </div>
          
          <div className="w-full overflow-x-auto font-sans">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.1em] text-slate-400">
                  <th className="pb-4 font-bold">Order ID</th>
                  <th className="pb-4 font-bold">Customer</th>
                  <th className="pb-4 font-bold">Product</th>
                  <th className="pb-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-50 last:border-b-0">
                  <td className="py-5 font-mono text-slate-500">#KD-8901</td>
                  <td className="py-5 font-medium">Julianne Moore</td>
                  <td className="py-5 text-slate-600">Dark Roast Blend</td>
                  <td className="py-5"><span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">ROASTING</span></td>
                </tr>
                <tr className="border-b border-slate-50 last:border-b-0">
                  <td className="py-5 font-mono text-slate-500">#KD-8902</td>
                  <td className="py-5 font-medium">Marcus Aurelius</td>
                  <td className="py-5 text-slate-600">Kenya AA Espresso</td>
                  <td className="py-5"><span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">PENDING</span></td>
                </tr>
                <tr className="border-b border-slate-50 last:border-b-0">
                  <td className="py-5 font-mono text-slate-500">#KD-8903</td>
                  <td className="py-5 font-medium">Sienna Miller</td>
                  <td className="py-5 text-slate-600">Colombian Decaf</td>
                  <td className="py-5"><span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">OUT FOR DELIVERY</span></td>
                </tr>
                <tr className="border-b border-slate-50 last:border-b-0">
                  <td className="py-5 font-mono text-slate-500">#KD-8904</td>
                  <td className="py-5 font-medium">Oscar Isaac</td>
                  <td className="py-5 text-slate-600">Summer Bloom Set</td>
                  <td className="py-5"><span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">ROASTING</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="rounded-2xl overflow-hidden relative h-32 mb-6 group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=600&auto=format&fit=crop&q=80" alt="Beans" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-sans font-bold tracking-wide">Add New Roast</span>
            </div>
          </div>
          
          <div className="space-y-4 font-sans mt-auto">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">Item Name</label>
              <input type="text" placeholder="e.g. Guatemala Single Origin" className="w-full bg-[#f4f1eb] border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#9d4300]/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">Price ($)</label>
              <input type="text" placeholder="24.00" className="w-full bg-[#f4f1eb] border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#9d4300]/20" />
            </div>
            <button className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#9d4300] transition-colors mt-2">
              Post to Menu
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#f8f5f2] border border-[#eee9e0] rounded-3xl p-8 flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
            <Archive size={24} className="text-[#1a1a1a]" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Inventory Low</h3>
            <p className="text-slate-600 font-sans text-sm mb-4">You have 3 items reaching critical stock levels.</p>
            <button className="text-[#9d4300] font-sans text-sm font-bold flex items-center gap-1 hover:underline">
              Manage Stock <TrendingUp size={14} className="rotate-90" />
            </button>
          </div>
        </div>

        <div className="bg-[#fff9f0] border border-[#ffeed4] rounded-3xl p-8 flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
            <Sparkles size={24} className="text-[#9d4300]" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Smart Suggestions</h3>
            <p className="text-slate-600 font-sans text-sm mb-4">Based on sales, consider a weekend sale for Light Roasts.</p>
            <button className="text-[#9d4300] font-sans text-sm font-bold flex items-center gap-1 hover:underline">
              Apply Strategy <Sparkles size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuTab() {
  return (
    <div className="fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Menu Management</h1>
          <p className="text-slate-600 font-sans text-sm">Curate and refine your roastery offerings.</p>
        </div>
        <button className="bg-[#1a1a1a] text-white px-8 py-3.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-[0.15em] hover:bg-[#9d4300] transition-colors flex items-center gap-2">
          <span>+ Add New Item</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-10 font-sans text-sm overflow-x-auto pb-2 scrollbar-none">
        <button className="bg-[#9d4300] text-white px-6 py-2 rounded-full font-bold whitespace-nowrap">All Items</button>
        <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full font-medium hover:border-slate-300 whitespace-nowrap transition-colors">Beans</button>
        <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full font-medium hover:border-slate-300 whitespace-nowrap transition-colors">Brew</button>
        <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full font-medium hover:border-slate-300 whitespace-nowrap transition-colors">Merch</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Item 1 */}
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col group">
          <div className="bg-[#f0ece5] rounded-[1.5rem] h-64 mb-6 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&auto=format&fit=crop&q=80" alt="Beans" className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-[#9d4300]">Beans</div>
          </div>
          <div className="px-2 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3 gap-4">
              <h3 className="text-xl font-bold leading-tight">Ethiopia Yirgacheffe</h3>
              <span className="text-[#9d4300] font-sans font-bold text-sm shrink-0">$24.00</span>
            </div>
            <p className="text-slate-500 font-sans text-[13px] leading-relaxed mb-6">Floral notes of jasmine and bergamot with a bright citrus finish. Single origin, light roast.</p>
            
            <div className="mt-auto flex items-center gap-3 font-sans">
              <button className="flex-1 bg-[#f4f1eb] hover:bg-[#ece8df] text-[#1a1a1a] py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors">
                <Edit2 size={12} /> Edit
              </button>
              <button className="w-12 h-12 shrink-0 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col group">
          <div className="bg-[#f0ece5] rounded-[1.5rem] h-64 mb-6 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1495474472205-1a3b194fb8db?w=800&auto=format&fit=crop&q=80" alt="Dripper" className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-[#9d4300]">Brew</div>
          </div>
          <div className="px-2 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3 gap-4">
              <h3 className="text-xl font-bold leading-tight">Koda Glass Dripper</h3>
              <span className="text-[#9d4300] font-sans font-bold text-sm shrink-0">$45.00</span>
            </div>
            <p className="text-slate-500 font-sans text-[13px] leading-relaxed mb-6">Heat-resistant borosilicate glass designed for optimal extraction. Hand-blown perfection.</p>
            
            <div className="mt-auto flex items-center gap-3 font-sans">
              <button className="flex-1 bg-[#f4f1eb] hover:bg-[#ece8df] text-[#1a1a1a] py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors">
                <Edit2 size={12} /> Edit
              </button>
              <button className="w-12 h-12 shrink-0 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col group">
          <div className="bg-[#f0ece5] rounded-[1.5rem] h-64 mb-6 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80" alt="Hoodie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-[#9d4300]">Merch</div>
          </div>
          <div className="px-2 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3 gap-4">
              <h3 className="text-xl font-bold leading-tight">Roastery Hoodie</h3>
              <span className="text-[#9d4300] font-sans font-bold text-sm shrink-0">$68.00</span>
            </div>
            <p className="text-slate-500 font-sans text-[13px] leading-relaxed mb-6">Heavyweight organic cotton with embroidered logo. Available in Charcoal and Bone.</p>
            
            <div className="mt-auto flex items-center gap-3 font-sans">
              <button className="flex-1 bg-[#f4f1eb] hover:bg-[#ece8df] text-[#1a1a1a] py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors">
                <Edit2 size={12} /> Edit
              </button>
              <button className="w-12 h-12 shrink-0 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Order Monitoring</h1>
          <p className="text-slate-600 font-sans text-sm">Tracking 24 active roasting and brewing orders for today.</p>
        </div>
        <div className="flex items-center gap-3 font-sans">
          <button className="bg-white border border-slate-200 px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium hover:border-slate-300">
            <Calendar size={16} className="text-slate-400" />
            <span>Current Day</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400 ml-2">expand_more</span>
          </button>
          <button className="bg-white border border-slate-200 px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium hover:border-slate-300">
            <Search size={16} className="text-slate-400" />
            <span>All Status</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400 ml-2">expand_more</span>
          </button>
          <button className="bg-white border border-slate-200 px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium hover:border-slate-300">
            <AlertCircle size={16} className="text-slate-400" />
            <span>All Priority</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400 ml-2">expand_more</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {/* Column 1: Pending (4) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#9d4300]"></div>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">Pending (4)</h3>
            </div>
            <MoreHorizontal size={16} className="text-slate-400" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
            <div className="absolute top-6 right-6 text-red-500">
               <AlertCircle size={18} />
            </div>
            <div className="bg-orange-50 text-[#9d4300] font-mono text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#KD-8832</div>
            <h4 className="text-xl font-bold mb-1">Eleanor Fant</h4>
            <p className="font-sans text-xs text-slate-500 mb-6">Ethiopian Yirgacheffe (250g), Chemex Filters</p>
            <div className="flex justify-between items-end border-t border-slate-50 pt-4">
              <span className="text-xl font-bold">$42.00</span>
              <span className="bg-orange-50 text-[#9d4300] px-3 py-1 rounded-full text-[11px] font-sans font-bold mix-blend-multiply">Pending</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="bg-orange-50 text-[#9d4300] font-mono text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#KD-8835</div>
            <h4 className="text-xl font-bold mb-1">Marcus Aurelius</h4>
            <p className="font-sans text-xs text-slate-500 mb-6">Subscription: Dark Roast Monthly</p>
            <div className="flex justify-between items-end border-t border-slate-50 pt-4">
              <span className="text-xl font-bold">$28.50</span>
              <span className="bg-orange-50 text-[#9d4300] px-3 py-1 rounded-full text-[11px] font-sans font-bold mix-blend-multiply">Pending</span>
            </div>
          </div>
        </div>

        {/* Column 2: Roasting (8) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">Roasting (8)</h3>
            </div>
            <MoreHorizontal size={16} className="text-slate-400" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-[#9d4300]">
            <div className="bg-slate-50 font-mono text-slate-600 text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#KD-8790</div>
            <h4 className="text-xl font-bold mb-1">Sienna Miller</h4>
            <p className="font-sans text-xs text-slate-500 mb-6">Sumatra Mandheling (1kg), Pour-over Kit</p>
            <div className="flex justify-between items-end border-t border-slate-50 pt-4">
              <span className="text-xl font-bold">$112.00</span>
              <button className="bg-[#9d4300] text-white px-4 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-transform active:scale-95">Roasting</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="bg-slate-50 font-mono text-slate-600 text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#KD-8795</div>
            <h4 className="text-xl font-bold mb-1">James Holden</h4>
            <p className="font-sans text-xs text-slate-500 mb-6">Guatemalan Antigua (500g)</p>
            <div className="flex justify-between items-end border-t border-slate-50 pt-4">
              <span className="text-xl font-bold">$34.00</span>
              <button className="bg-[#9d4300] text-white px-4 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-transform active:scale-95">Roasting</button>
            </div>
          </div>
        </div>

        {/* Column 3: Ready & Stats */}
        <div className="space-y-4 xl:col-span-2">
           <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">Ready (12)</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
              <div className="absolute top-6 right-6 text-green-500">
                <CheckCircle2 size={18} />
              </div>
              <div className="bg-slate-50 font-mono text-slate-600 text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#KD-8712</div>
              <h4 className="text-xl font-bold mb-1">Amos Burton</h4>
              <p className="font-sans text-xs text-slate-500 mb-6">Costa Rica Tarrazu (250g) x 4</p>
              <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                <span className="text-xl font-bold">$76.00</span>
                <button className="bg-[#1a1a1a] text-white px-4 py-1.5 rounded-lg text-[11px] font-sans font-bold flex items-center gap-2 hover:bg-black/80">
                  Ready <span className="material-symbols-outlined text-[14px]">expand_more</span>
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white flex flex-col justify-center">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-2">Efficiency Rating</h3>
              <p className="text-6xl font-black tracking-tighter mb-4">98%</p>
              <div className="flex items-center gap-2 text-sm font-sans">
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-white/80">+4.2% from yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">All Active Transactions</h2>
          <button className="text-[#1a1a1a] text-sm font-sans font-bold flex items-center gap-2 hover:underline">
            Export CSV <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
        
        <div className="w-full overflow-x-auto font-sans bg-white border border-slate-100 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.1em] text-slate-400">
                <th className="p-6 font-bold">Order #</th>
                <th className="p-6 font-bold">Customer</th>
                <th className="p-6 font-bold">Item Summary</th>
                <th className="p-6 font-bold">Price</th>
                <th className="p-6 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors">
                <td className="p-6 font-mono text-[#1a1a1a] font-bold">#KD-8901</td>
                <td className="p-6 font-medium">Lydia Tar</td>
                <td className="p-6 text-slate-600 italic">Panama Geisha (Special Release)</td>
                <td className="p-6 font-bold">$120.00</td>
                <td className="p-6 text-right"><span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">URGENT</span></td>
              </tr>
              <tr className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors">
                <td className="p-6 font-mono text-[#1a1a1a] font-bold">#KD-8902</td>
                <td className="p-6 font-medium">David Bowman</td>
                <td className="p-6 text-slate-600 italic">Space Blend Coffee Pods x 100</td>
                <td className="p-6 font-bold">$85.20</td>
                <td className="p-6 text-right"><span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">NORMAL</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
