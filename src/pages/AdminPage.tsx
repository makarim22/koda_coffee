import { useEffect, useState } from 'react';
import { BaseProps } from '../types';
import { getMenuItems, saveMenuItems, MenuItem, getOrders, saveOrders, Order, updateOrderStatus, OrderStatus } from '../data';
import { auth } from '../firebase';
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
  Archive,
  X
} from 'lucide-react';

import Footer from '../components/Footer';

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
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function DashboardTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState('Rp 0');
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
        
        const fetchedMenuItems = await getMenuItems();
        setMenuItems(fetchedMenuItems);
        
        const active = fetchedOrders.filter(o => o.status !== 'DELIVERED').length;
        setActiveOrdersCount(active);
        
        // Very basic calculation for display
        const rev = fetchedOrders.reduce((acc, order) => {
          const numStr = order.totalPrice.replace(/[^\d]/g, '');
          return acc + (parseInt(numStr, 10) || 0);
        }, 0);
        setTotalRevenue('Rp ' + rev.toLocaleString('id-ID'));
      } else {
        // If unauthenticated, maybe redirect or clear? For now, do nothing
      }
    });
    
    return () => unsubscribe();
  }, []);

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
          <p className="text-4xl font-black tracking-tight">{totalRevenue}</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[#C62828] font-sans font-bold text-sm">{activeOrdersCount} pending</div>
          <div className="w-12 h-12 rounded-full bg-[#fcf8f7] flex items-center justify-center mb-12 text-[#9d4300]">
            <Package size={20} />
          </div>
          <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">Active Orders</h3>
          <p className="text-4xl font-black tracking-tight">{activeOrdersCount}</p>
        </div>

        <div className="bg-[#1a1a1a] text-white p-8 rounded-3xl shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-6 right-6 text-white/80 font-sans font-bold text-sm">Trending</div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-12 text-white">
            <Star size={20} />
          </div>
          <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-white/60 mb-2">Top Roasts</h3>
          <p className="text-3xl font-black tracking-tight leading-tight">{menuItems.length > 0 ? menuItems[0].title : 'N/A'}</p>
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
                {orders.slice(0, 4).map(order => (
                  <tr key={order.id} className="border-b border-slate-50 last:border-b-0">
                    <td className="py-5 font-mono text-slate-500">#{order.id}</td>
                    <td className="py-5 font-medium">{order.customerName}</td>
                    <td className="py-5 text-slate-600">{order.itemsSummary}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'PENDING' ? 'bg-slate-100 text-slate-600' :
                        order.status === 'ROASTING' ? 'bg-orange-50 text-orange-700' :
                        order.status === 'READY' ? 'bg-green-50 text-green-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const fetchedItems = await getMenuItems();
        setItems(fetchedItems);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = (updated: MenuItem[]) => {
    setItems(updated);
    saveMenuItems(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    handleSave(updated);
  };

  const filteredItems = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);

  return (
    <div className="fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Menu Management</h1>
          <p className="text-slate-600 font-sans text-sm">Curate and refine your roastery offerings.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#1a1a1a] text-white px-8 py-3.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-[0.15em] hover:bg-[#9d4300] transition-colors flex items-center gap-2"
        >
          <span>+ Add New Item</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-10 font-sans text-sm overflow-x-auto pb-2 scrollbar-none">
        {['all', 'espresso', 'pourOver', 'coldBrew', 'pastries'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-[#9d4300] text-white' 
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 font-medium'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col group">
            <div className="bg-[#f0ece5] rounded-[1.5rem] h-64 mb-6 relative overflow-hidden">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-[#9d4300]">
                {item.category}
              </div>
            </div>
            <div className="px-2 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                <span className="text-[#9d4300] font-sans font-bold text-sm shrink-0">{item.price}</span>
              </div>
              <p className="text-slate-500 font-sans text-[13px] leading-relaxed mb-6 line-clamp-2">{item.desc}</p>
              
              <div className="mt-auto flex items-center gap-3 font-sans">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="flex-1 bg-[#f4f1eb] hover:bg-[#ece8df] text-[#1a1a1a] py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="w-12 h-12 shrink-0 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isAdding || editingItem) && (
        <MenuModal 
          item={editingItem} 
          onClose={() => { setIsAdding(false); setEditingItem(null); }} 
          onSave={(item) => {
            if (editingItem) {
              handleSave(items.map(i => i.id === item.id ? item : i));
            } else {
              handleSave([...items, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
            }
            setIsAdding(false);
            setEditingItem(null);
          }} 
        />
      )}
    </div>
  );
}

function MenuModal({ item, onClose, onSave }: { item: MenuItem | null, onClose: () => void, onSave: (item: MenuItem) => void }) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    item || { category: 'espresso', title: '', price: '', desc: '', img: '', origin: '', process: '', delay: 'delay-100' }
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black">{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={24} /></button>
        </div>
        <div className="space-y-4 font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Title</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm outline-none">
                <option value="espresso">Espresso</option>
                <option value="pourOver">Pour Over</option>
                <option value="coldBrew">Cold Brew</option>
                <option value="pastries">Pastries</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Price</label>
              <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div>
               <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
              <input value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm outline-none h-24" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Origin</label>
              <input value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div>
               <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Process</label>
              <input value={formData.process} onChange={e => setFormData({...formData, process: e.target.value})} className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
          </div>
          <button onClick={() => onSave(formData as MenuItem)} className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#9d4300] transition-colors mt-6">
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatus(orderId, newStatus);
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const roastingOrders = orders.filter(o => o.status === 'ROASTING');
  const readyOrders = orders.filter(o => o.status === 'READY');

  return (
    <div className="fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Order Monitoring</h1>
          <p className="text-slate-600 font-sans text-sm">Tracking {orders.filter(o => o.status !== 'DELIVERED').length} active roasting and brewing orders for today.</p>
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
        {/* Column 1: Pending */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#9d4300]"></div>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">Pending ({pendingOrders.length})</h3>
            </div>
            <MoreHorizontal size={16} className="text-slate-400" />
          </div>

          {pendingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
              {order.priority === 'URGENT' && (
                <div className="absolute top-6 right-6 text-red-500">
                  <AlertCircle size={18} />
                </div>
              )}
              <div className="bg-orange-50 text-[#9d4300] font-mono text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#{order.id}</div>
              <h4 className="text-xl font-bold mb-1">{order.customerName}</h4>
              <p className="font-sans text-xs text-slate-500 mb-6">{order.itemsSummary}</p>
              <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                <span className="text-xl font-bold">{order.totalPrice}</span>
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'ROASTING')}
                  className="bg-orange-50 text-[#9d4300] px-4 py-1.5 rounded-full text-[11px] font-sans font-bold hover:bg-orange-100 transition-colors"
                >
                  Start Roasting
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2: Roasting */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">Roasting ({roastingOrders.length})</h3>
            </div>
            <MoreHorizontal size={16} className="text-slate-400" />
          </div>

          {roastingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-[#9d4300] relative">
              {order.priority === 'URGENT' && (
                <div className="absolute top-6 right-6 text-red-500">
                  <AlertCircle size={18} />
                </div>
              )}
              <div className="bg-slate-50 font-mono text-slate-600 text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#{order.id}</div>
              <h4 className="text-xl font-bold mb-1">{order.customerName}</h4>
              <p className="font-sans text-xs text-slate-500 mb-6">{order.itemsSummary}</p>
              <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                <span className="text-xl font-bold">{order.totalPrice}</span>
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'READY')}
                  className="bg-[#9d4300] text-white px-4 py-1.5 rounded-lg text-[11px] font-sans font-bold hover:bg-[#803600] transition-colors"
                >
                  Mark Ready
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3: Ready & Stats */}
        <div className="space-y-4 xl:col-span-2">
           <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">Ready ({readyOrders.length})</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              {readyOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                  <div className="absolute top-6 right-6 text-green-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="bg-slate-50 font-mono text-slate-600 text-[10px] font-bold px-3 py-1 rounded w-fit mb-4">#{order.id}</div>
                  <h4 className="text-xl font-bold mb-1">{order.customerName}</h4>
                  <p className="font-sans text-xs text-slate-500 mb-6">{order.itemsSummary}</p>
                  <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                    <span className="text-xl font-bold">{order.totalPrice}</span>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                      className="bg-[#1a1a1a] text-white px-4 py-1.5 rounded-lg text-[11px] font-sans font-bold flex items-center gap-2 hover:bg-black/80"
                    >
                      Deliver <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    </button>
                  </div>
                </div>
              ))}
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
              {orders.map(order => (
                <tr key={order.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-mono text-[#1a1a1a] font-bold">#{order.id}</td>
                  <td className="p-6 font-medium">{order.customerName}</td>
                  <td className="p-6 text-slate-600 italic">{order.itemsSummary}</td>
                  <td className="p-6 font-bold">{order.totalPrice}</td>
                  <td className="p-6 text-right">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.priority === 'URGENT' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-slate-100 text-slate-600'
                    }`}>
                      {order.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
