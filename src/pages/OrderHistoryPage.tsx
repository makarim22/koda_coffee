import React, { useEffect, useState } from 'react';
import { BaseProps, CartItem } from '../types';
import { ShoppingBag, ArrowLeft, Package, Coffee, Truck, CheckCircle, FileDown, ChevronDown, ChevronUp, X } from 'lucide-react';
import { auth } from '../auth';
import { Order, getUserOrders, updateOrderStatus } from '../data';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function OrderHistoryPage({ onNavigate, cart, setCart }: BaseProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        getUserOrders(currentUser.uid).then((ordersData) => {
          setOrders(ordersData);
          setLoading(false);
        }).catch(err => {
          console.error(err);
          setLoading(false);
        });
      } else {
        setOrders([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = () => {
    if (user?.uid) {
      getUserOrders(user.uid).then((ordersData) => {
        setOrders(ordersData);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

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

  const handleCancelOrder = async () => {
    if (cancelOrderId) {
      await updateOrderStatus(cancelOrderId, 'CANCELLED');
      setCancelOrderId(null);
      fetchOrders();
    }
  };

  const handleDownloadReceipt = (order: Order) => {
    const text = `
RECEIPT
Order ID: ${order.id}
Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
Status: ${order.status}

Items:
${order.items?.map(i => `${i.quantity}x ${i.title} - ${i.price}`).join('\n') || order.itemsSummary}

Total: ${order.totalPrice}

Thank you for your order!
Koda Coffee
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koda-receipt-${order.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch(status) {
      case 'PENDING': return <Package size={16} />;
      case 'ROASTING': return <Coffee size={16} />;
      case 'READY': return <Truck size={16} />;
      case 'DELIVERED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <X size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="bg-[#f2f0ea] text-[#1a1a1a] font-serif min-h-screen flex flex-col pb-32">
      <TopNavBar activeRoute="orders" onNavigate={onNavigate} cart={cart} />

      <main className="w-full max-w-4xl mx-auto px-6 md:px-12 flex-1 mt-8 fade-in-up">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-[#1a1a1a] text-[#f2f0ea] rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Order History</h1>
            <p className="font-sans text-sm text-slate-500 mt-2">Track the status of your current and past orders.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div className="w-full md:w-2/3">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="h-7 bg-slate-200 rounded-md w-48"></div>
                      <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-4 bg-slate-200 rounded-md w-64 max-w-full"></div>
                      <div className="h-4 w-4 bg-slate-200 rounded-full md:hidden"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end w-full md:w-1/3 mt-2 md:mt-0">
                    <div className="flex items-center gap-4">
                      <div className="h-8 bg-slate-200 rounded-md w-28"></div>
                      <div className="h-6 w-6 bg-slate-200 rounded-full hidden md:block"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 md:justify-end">
                      <div className="h-9 w-24 bg-slate-200 rounded-full"></div>
                      <div className="h-9 w-9 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 pb-2">
                  <div className="relative">
                    <div className="absolute top-6 left-0 w-full h-[2px] bg-slate-100"></div>
                    <div className="flex justify-between relative z-10 overflow-x-hidden md:overflow-visible">
                      {[1, 2, 3, 4].map(step => (
                        <div key={step} className="flex md:flex-col items-center gap-4 md:gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-200 border-4 border-white shrink-0"></div>
                          <div className="h-3 w-16 bg-slate-200 rounded-md hidden md:block"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[40vh]">
             <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-full mb-6">
               <ShoppingBag size={32} className="text-slate-400" />
             </div>
             <h2 className="text-2xl font-bold mb-3 tracking-tight">No Orders Yet</h2>
             <p className="font-sans text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">It looks like you haven't placed any orders yet. Discover our collection of premium coffees and pastries to get started.</p>
             <button 
               onClick={() => onNavigate('menu')}
               className="font-sans text-xs uppercase tracking-[0.2em] font-bold bg-black text-white px-8 py-3.5 rounded-full hover:bg-[#c5a059] transition-colors shadow-md hover:shadow-lg flex items-center gap-3"
             >
               <span>Browse Menu</span>
               <ArrowLeft size={16} className="rotate-180" />
             </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer"
                onClick={() => setExpandedOrderId(prev => prev === order.id ? null : order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                       <h3 className="font-bold text-xl">{order.itemsSummary || 'Custom Order'}</h3>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest ${
                          order.status === 'DELIVERED' 
                            ? 'bg-slate-100 text-slate-600' 
                            : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-black text-white'
                        }`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status === 'PENDING' ? 'Preparing' : order.status === 'ROASTING' ? 'Roasting' : order.status === 'READY' ? 'In Transit' : order.status === 'DELIVERED' ? 'Delivered' : 'Cancelled'}</span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        <p className="font-sans text-xs text-slate-500">
                          Order #{order.id.slice(0, 8).toUpperCase()} • {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                        <button className="text-slate-400 hover:text-black transition-colors md:hidden">
                          {expandedOrderId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {order.deliveryAddress && (
                        <p className="font-sans text-xs text-slate-500 truncate mt-0.5">
                           <span className="font-semibold text-slate-700">Delivery:</span> {order.deliveryAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-left md:text-right flex flex-col md:items-end">
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-2xl text-[#c5a059]">{order.totalPrice}</p>
                      <button className="text-slate-400 hover:text-black transition-colors hidden md:block">
                        {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3 md:justify-end">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setCancelOrderId(order.id); }}
                          className="font-sans inline-block text-[10px] uppercase tracking-widest font-bold text-red-600 border border-red-200 h-9 px-5 hover:bg-red-50 transition-colors rounded-full"
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(order); }}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-[#1a1a1a] hover:border-[#1a1a1a] hover:text-white transition-colors"
                          title="Download Receipt"
                        >
                          <FileDown size={14} />
                        </button>
                      )}
                      {order.items && order.items.length > 0 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleReorder(order.items); }} 
                          className="font-sans inline-block text-[10px] uppercase tracking-widest font-bold border border-[#1a1a1a]/20 h-9 px-5 hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-full"
                        >
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="font-bold text-sm tracking-tight text-slate-800 mb-4">Order Items</h4>
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-4">
                             {order.items.map(item => (
                               <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-2xl gap-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                      <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                      {item.grindOption && (
                                        <p className="font-sans text-[10px] uppercase tracking-widest text-[#9d4300] font-bold mt-1">Grind: {item.grindOption}</p>
                                      )}
                                      {item.subscriptionOption && (
                                        <p className="font-sans text-[10px] uppercase tracking-widest text-[#9d4300] font-bold mt-0.5 flex items-center gap-1">
                                          <span className="material-symbols-outlined text-[12px]">autorenew</span>
                                          {item.subscriptionOption}
                                        </p>
                                      )}
                                      <p className="font-sans text-xs text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
                                      <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mt-2">Qty: {item.quantity} • {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleReorder([item]); }}
                                    className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#c5a059] hover:border-[#c5a059] hover:text-white transition-colors"
                                    title="Reorder Item"
                                  >
                                    <ShoppingBag size={16} />
                                  </button>
                               </div>
                             ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">No item details available.</p>
                        )}
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl">
                          <h4 className="font-bold text-sm tracking-tight text-slate-800 mb-4">Shipping Information</h4>
                          <p className="text-sm text-slate-700 font-medium">{order.customerName}</p>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                            123 Coffee Avenue, Suite 100<br/>
                            Seattle, WA 98101<br/>
                            United States
                          </p>
                          <p className="text-sm text-slate-500 mt-3 font-sans tracking-tight">Standard Delivery (2-3 Days)</p>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-2xl">
                          <h4 className="font-bold text-sm tracking-tight text-slate-800 mb-4">Order Summary</h4>
                          <div className="space-y-2 text-sm text-slate-600 pb-4 border-b border-slate-200">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{order.totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>Free</span>
                            </div>
                          </div>
                          <div className="flex justify-between font-bold text-slate-800 mt-4 text-base">
                            <span>Total</span>
                            <span className="text-[#c5a059]">{order.totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                  <div className="mt-8 pt-6 border-t border-slate-100 pb-2">
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 md:left-[50%] top-6 md:top-6 -bottom-6 w-px bg-slate-200 md:hidden"></div>
                      <div className="hidden md:block absolute top-6 left-6 right-6 h-px bg-slate-200"></div>
                      
                      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
                         {['PENDING', 'ROASTING', 'READY', 'DELIVERED'].map((step, index) => {
                           const steps = ['PENDING', 'ROASTING', 'READY', 'DELIVERED'];
                           const currentStepIndex = steps.indexOf(order.status);
                           const isCompleted = index <= currentStepIndex;
                           const isActive = index === currentStepIndex;
                           
                           return (
                             <div key={step} className="flex md:flex-col items-center gap-4 md:gap-3 group z-10 text-center relative w-full md:w-auto text-left md:text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 shadow-sm shrink-0 ${
                                  isActive ? 'bg-[#c5a059] text-white shadow-md' : isCompleted ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {getStatusIcon(step as any)}
                                </div>
                                <div>
                                  <p className={`font-sans text-[10px] uppercase tracking-widest font-bold ${
                                    isActive ? 'text-[#c5a059]' : isCompleted ? 'text-black' : 'text-slate-400'
                                  }`}>{step === 'PENDING' ? 'Preparing' : step === 'ROASTING' ? 'Roasting' : step === 'READY' ? 'In Transit' : 'Delivered'}</p>
                                </div>
                             </div>
                           )
                         })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cancel Order Modal */}
      {cancelOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 tracking-tight">Cancel Order</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCancelOrderId(null)}
                className="flex-1 px-6 py-3.5 rounded-full border border-slate-200 font-bold tracking-widest text-[10px] uppercase hover:bg-slate-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-6 py-3.5 rounded-full bg-red-600 font-bold tracking-widest text-[10px] uppercase text-white hover:bg-red-700 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
