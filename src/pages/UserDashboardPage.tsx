import { BaseProps, CartItem } from '../types';
import { ShoppingBag, Star, Clock, MapPin, ChevronRight, LogOut, Search, Award, X, Gift } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { auth } from '../auth';
import { Order, getUserOrders, getUserPoints, getMenuItems, MenuItem, getUserWishlist, deductPointsFromUser } from '../data';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function UserDashboardPage({ onNavigate, cart, setCart }: BaseProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [wishlistItems, setWishlistItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        Promise.all([
          getUserOrders(currentUser.uid),
          getUserPoints(currentUser.uid),
          getMenuItems(),
          getUserWishlist(currentUser.uid)
        ]).then(([ordersData, pointsData, menuData, wishlistData]) => {
          setOrders(ordersData);
          setPoints(pointsData);
          const savedItems = wishlistData
            .map(id => menuData.find(m => m.id === id))
            .filter(Boolean) as MenuItem[];
          setWishlistItems(savedItems);
          setLoading(false);
        }).catch(err => {
          console.error(err);
          setLoading(false);
        });
      } else {
        setOrders([]);
        setPoints(0);
        setWishlistItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleReorder = (items?: CartItem[]) => {
    if (items && setCart) {
      let newItems = [...(cart || [])];
      items.forEach(pastItem => {
        const existingIndex = newItems.findIndex(i => i.id === pastItem.id && i.grindOption === pastItem.grindOption && i.subscriptionOption === pastItem.subscriptionOption);
        if (existingIndex >= 0) {
          const updatedItem = { ...newItems[existingIndex] };
          updatedItem.quantity += pastItem.quantity;
          newItems[existingIndex] = updatedItem;
        } else {
          newItems.push({ ...pastItem });
        }
      });
      setCart(newItems);
      onNavigate('checkout');
    }
  };

  const handleRedeem = async (cost: number, rewardName: string) => {
    if (points >= cost && user?.uid) {
      await deductPointsFromUser(user.uid, cost);
      setPoints(prev => prev - cost);
      alert(`Successfully redeemed: ${rewardName}!`);
      setShowRewardsModal(false);
    }
  };

  return (
    <div className="bg-[#f2f0ea] text-[#1a1a1a] font-serif min-h-screen flex flex-col selection:bg-[#c5a059] selection:text-white pb-32">
      <TopNavBar activeRoute="user-dashboard" onNavigate={onNavigate} cart={cart} />

      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 flex-1 mt-12 fade-in-up">
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-4">Welcome back, {user?.displayName || 'Coffee Lover'}.</h1>
          <p className="font-sans text-sm opacity-70 max-w-xl leading-relaxed">Here is an overview of your current subscriptions, past orders, and personalized recommendations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Koda Rewards */}
            <div className="bg-[#1a1a1a] text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#c5a059] rounded-full blur-[80px] -z-10 opacity-30"></div>
              <div className="flex items-center gap-3 mb-6">
                <Award size={20} className="text-[#c5a059]" />
                <h2 className="text-xl font-bold">Koda Rewards</h2>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <p className="font-sans text-sm text-white/70 mb-1">Available Points</p>
                  <h3 className="text-5xl font-bold tracking-tighter text-[#c5a059]">{points}</h3>
                </div>
                <button 
                  onClick={() => setShowRewardsModal(true)}
                  className="font-sans text-xs uppercase tracking-widest font-bold bg-white text-black px-6 py-3 rounded-full hover:bg-[#c5a059] hover:text-white transition-colors">
                  Redeem Rewards
                </button>
              </div>
            </div>

            {/* Active Subscription Box */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f9f8f5] rounded-bl-[100px] -z-10 mix-blend-multiply opacity-50"></div>
              <div className="flex items-center gap-3 mb-6">
                <Star size={18} className="text-[#c5a059]" />
                <h2 className="text-xl font-bold">Active Subscription</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-24 h-24 bg-[#f2f0ea] p-4 shrink-0 rounded-2xl flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop" alt="Coffee Bag" className="w-full h-full object-cover rounded-lg mix-blend-multiply opacity-90" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">Explorer's Trio</h3>
                  <p className="font-sans text-sm text-slate-500 mb-4">Bi-weekly delivery • 3x250g Single Origins</p>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-full">Next Ship: Oct 12</span>
                    <button className="font-sans text-xs underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity">Manage</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={18} className="text-slate-400" />
                  <h2 className="text-xl font-bold">Past Discoveries</h2>
                </div>
                <button onClick={() => onNavigate('orders')} className="font-sans text-xs underline opacity-60 hover:opacity-100 transition-opacity">View All</button>
              </div>

              <div className="space-y-6">
                {loading ? (
                  <p className="text-sm text-slate-500 font-sans">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-slate-500 font-sans">You have no past discoveries yet.</p>
                ) : orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#f2f0ea] rounded-xl overflow-hidden p-2 flex items-center justify-center">
                         <img src={order.items?.[0]?.img || "https://images.unsplash.com/photo-1544244015-0df4b3dfc584?q=80&w=800&auto=format&fit=crop"} alt="Coffee Bag" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{order.itemsSummary || 'Custom Order'}</h4>
                        <p className="font-sans text-xs text-slate-500 mb-1">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'} • {order.totalPrice} • <span className={`font-bold uppercase ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-orange-500'}`}>{order.status}</span>
                        </p>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <button onClick={() => handleReorder(order.items)} className="font-sans text-[10px] uppercase tracking-widest font-bold border border-[#1a1a1a]/20 px-4 py-2 hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-full text-center shrink-0">Buy Again</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column / Sidebar */}
          <div className="space-y-8">
             {/* Reward Points */}
             <div className="bg-[#1a1a1a] text-[#f2f0ea] p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059] rounded-bl-full -z-10 mix-blend-screen opacity-20 blur-xl"></div>
                <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-70 mb-4">Koda Rewards</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-bold">{points}</span>
                  <span className="font-sans text-sm opacity-70 mb-2">pts</span>
                </div>
                <p className="font-sans text-xs opacity-70 mb-6">{Math.max(0, 500 - (points % 500))} points away from a free pastry or free shipping.</p>
                
                <div className="w-full h-1 bg-white/20 rounded-full mb-6 relative overflow-hidden">
                  <div className="h-full bg-[#c5a059] rounded-full absolute left-0 top-0 transition-all duration-1000" style={{ width: `${Math.min(100, (points % 500) / 500 * 100)}%` }}></div>
                </div>

                <button 
                  onClick={() => setShowRewardsModal(true)}
                  className="w-full font-sans text-[10px] uppercase tracking-widest font-bold bg-[#f2f0ea] text-[#1a1a1a] py-3 rounded-full hover:bg-[#c5a059] hover:text-white transition-colors">
                  Redeem Points
                </button>
             </div>

             {/* Visit Info */}
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin size={16} /> Your Local Roastery</h3>
                <p className="font-sans text-sm text-slate-600 mb-2">Midtown Flagship</p>
                <p className="font-sans text-xs text-slate-500 mb-4">1289 Roastery Ave.<br/>Open today until 7PM</p>
                <div className="aspect-video bg-[#f2f0ea] rounded-xl overflow-hidden relative">
                   <img src="https://images.unsplash.com/photo-1552346765-680c44c5cdca?q=80&w=800&auto=format&fit=crop" alt="Cafe" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                   <button className="absolute inset-0 bg-black/20 flex items-center justify-center font-sans text-xs font-bold text-white uppercase tracking-widest hover:bg-black/40 transition-colors">
                     Get Directions
                   </button>
                </div>
             </div>

             {/* Wishlist */}
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-xl">
                  <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> 
                  Saved Beans
                </h3>
                {loading ? (
                  <p className="text-sm text-slate-500 font-sans">Loading wishlist...</p>
                ) : wishlistItems.length === 0 ? (
                  <p className="text-sm text-slate-500 font-sans">You haven't saved any beans yet.</p>
                ) : (
                  <div className="space-y-4">
                    {wishlistItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100" onClick={() => onNavigate('menu')}>
                        <div className="w-16 h-16 bg-[#f2f0ea] rounded-xl overflow-hidden shrink-0">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-[#c5a059] font-bold mb-1">{item.price}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans truncate">{item.origin || item.category}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>

      {/* Rewards Modal */}
      {showRewardsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#fcfaf8] rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative border border-white/20 flex flex-col max-h-[90vh]">
            <div className="bg-[#1a1a1a] text-white p-8 relative shrink-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#c5a059] rounded-full blur-[80px] -z-0 opacity-40"></div>
              <button 
                onClick={() => setShowRewardsModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X size={20} className="text-white" />
              </button>
              <h2 className="text-3xl font-bold mb-2 relative z-10">Koda Rewards</h2>
              <p className="font-sans text-sm text-white/70 relative z-10">Redeem your hard-earned points for exclusive perks.</p>
              <div className="mt-8 flex items-end gap-2 relative z-10">
                <span className="text-5xl font-bold text-[#c5a059]">{points}</span>
                <span className="font-sans text-sm opacity-70 mb-2">Available pts</span>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto font-sans flex-1">
              <div className="space-y-4">
                {[
                  { name: 'Free Pastry', cost: 150, desc: 'Any pastry from the daily selection.', img: 'https://images.unsplash.com/photo-1549725838-89c0bf2693fb?q=80&w=800&auto=format&fit=crop' },
                  { name: '$5 Off Next Roast', cost: 300, desc: 'Discount applied to your next bean purchase.', bg: '#f2f0ea' },
                  { name: 'Free Koda Tote Bag', cost: 800, desc: 'Limited edition heavy canvas tote.', img: 'https://images.unsplash.com/photo-1597464161986-7bd611e9aeb2?q=80&w=800&auto=format&fit=crop' },
                  { name: '1-Month Subscription', cost: 2500, desc: 'One month of our Explorer\'s Trio for free.', bg: '#1a1a1a' }
                ].map((reward, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-slate-100 rounded-2xl items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                    {reward.img ? (
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src={reward.img} alt={reward.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                      </div>
                    ) : (
                      <div className={`w-20 h-20 rounded-xl shrink-0 flex items-center justify-center ${reward.bg === '#1a1a1a' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f2f0ea] text-[#1a1a1a]'}`}>
                        <Gift size={32} className={reward.bg === '#1a1a1a' ? 'text-[#c5a059]' : 'text-slate-400'} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{reward.name}</h4>
                      <p className="text-xs text-slate-500">{reward.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-sm font-bold text-[#c5a059]">{reward.cost} pts</span>
                       <button 
                         onClick={() => handleRedeem(reward.cost, reward.name)}
                         disabled={points < reward.cost}
                         className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${points >= reward.cost ? 'bg-[#1a1a1a] text-white hover:bg-[#c5a059]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                       >
                         Redeem
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
