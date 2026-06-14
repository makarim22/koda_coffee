import { useState, useEffect } from 'react';
import { BaseProps } from '../types';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import { getUserAddresses, saveUserAddress, UserAddress } from '../data';
import { auth } from '../auth';

import Footer from '../components/Footer';

export default function CheckoutPage({ onNavigate, cart = [], setCart }: BaseProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [pickupTime, setPickupTime] = useState<string>('ASAP (15-20 mins)');
  const [storeLocation, setStoreLocation] = useState<string>('Downtown Roastery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'qris'>('card');
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [giftMessage, setGiftMessage] = useState('');
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '' });
  
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '' });
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        const userAddresses = await getUserAddresses(user.uid);
        setAddresses(userAddresses);
        const defaultAddr = userAddresses.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
        } else {
          setIsAddingNewAddress(true);
        }
      } else {
        setAddresses([]);
        setIsAddingNewAddress(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveNewAddress = async () => {
    const user = auth.currentUser;
    if (user?.uid && newAddress.name && newAddress.street && newAddress.city) {
      const addr: UserAddress = {
        id: 'ADDR-' + Math.floor(Math.random() * 10000),
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        isDefault: addresses.length === 0,
      };
      await saveUserAddress(user.uid, addr);
      setAddresses([...addresses, addr]);
      setSelectedAddressId(addr.id);
      setIsAddingNewAddress(false);
      setNewAddress({ name: '', street: '', city: '' });
    }
  };

  const updateQuantity = (id: string, grindOption: string | undefined, subscriptionOption: string | undefined, delta: number) => {
    if (setCart) {
      setCart(prev => prev.map(item => {
        if (item.id === id && item.grindOption === grindOption && item.subscriptionOption === subscriptionOption) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      }).filter(item => item.quantity > 0));
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = (method === 'delivery' && cart.length > 0) ? 15000 : 0;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax;
  const formattedTotal = `Rp ${total.toLocaleString('id-ID')}`;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }
    
    if (!contact.firstName || !contact.lastName || !contact.email) {
      setFormError('Please fill in your contact information.');
      return;
    }
    
    if (method === 'delivery') {
      if (isAddingNewAddress) {
        setFormError('Please save your delivery address before continuing.');
        return;
      }
      if (!selectedAddressId && addresses.length === 0) {
        setFormError('Please select or add a delivery address.');
        return;
      }
    }
    
    setFormError('');
    setIsSubmitting(true);
    try {
      const { createOrder } = await import('../data');
      
      const itemsSummary = cart.map(i => `${i.quantity}x ${i.title}${i.grindOption ? ` (${i.grindOption})` : ''}${i.subscriptionOption ? ` [Sub: ${i.subscriptionOption}]` : ''}`).join(', ');

      const { auth } = await import('../auth');
      const currentUser = auth.currentUser;

      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      const deliveryInfo = method === 'delivery' 
        ? (selectedAddress ? `${selectedAddress.name} - ${selectedAddress.street}, ${selectedAddress.city}` : 'No Address') 
        : `Pickup at ${storeLocation} - ${pickupTime}`;

      const newOrder = {
        id: 'KD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        customerName: currentUser?.displayName || 'New Customer',
        itemsSummary: itemsSummary || 'Empty Order',
        totalPrice: formattedTotal,
        status: 'PENDING' as const,
        priority: 'NORMAL' as const,
        userId: currentUser?.uid || '',
        createdAt: Date.now(),
        items: cart,
        giftMessage: giftMessage,
        deliveryAddress: deliveryInfo,
      };

      setPlacedOrder({
        id: newOrder.id,
        items: [...cart],
        method: method
      });

      await createOrder(newOrder);

      if (currentUser?.uid) {
        const { addPointsToUser } = await import('../data');
        const pointsEarned = Math.floor(total / 10000);
        await addPointsToUser(currentUser.uid, pointsEarned);
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      if (setCart) {
        setCart([]); // Clear cart on success
      }
      setTimeout(() => {
        onNavigate('landing');
      }, 3000);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#fcf8f7] text-[#000000] font-['Outfit'] min-h-screen selection:bg-[#9d4300] selection:text-white flex flex-col relative overflow-hidden">
        
        {/* Custom Header */}
        <div className="px-6 md:px-12 py-8 flex justify-between items-center w-full z-20">
          <div className="text-3xl font-black tracking-tighter cursor-pointer" onClick={() => onNavigate('landing')} role="button">
            Koda
          </div>
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-800 hover:text-[#f97316] transition-colors">
            <span className="material-symbols-outlined text-[16px]">close</span>
            Close
          </button>
        </div>

        {/* Soft radial glow */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#fadcd0]/30 rounded-full blur-[80px] pointer-events-none z-0"></div>

        <div className="flex-1 flex flex-col items-center pt-8 pb-24 px-6 relative z-10 w-full overflow-y-auto">
          <div className="text-[#f97316] mb-5 fade-in-up">
            <span className="material-symbols-outlined text-[36px] font-light">check_circle</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 fade-in-up tracking-tight text-center">Order Confirmed</h1>
          <p className="text-slate-600 font-medium text-[15px] max-w-sm mb-12 fade-in-up delay-100 text-center">
            Your order is being prepared.
          </p>

          <div className="max-w-[420px] w-full flex flex-col fade-in-up delay-200 drop-shadow-xl relative">
            <div className="bg-white rounded-t-[2rem] rounded-b-sm p-8 pb-4 flex flex-col items-center relative z-10 w-full overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Order Number</p>
              <h2 className="text-5xl font-black tracking-tight mb-8">{placedOrder?.id || '#KD-9012'}</h2>
              
              <div className="bg-[#fcf8f7] px-5 py-2.5 rounded-full flex items-center gap-2.5 mb-10 text-[#f97316]">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Ready in ~5 mins</span>
              </div>

              <div className="w-full border-t border-dashed border-slate-200 mb-8"></div>
              
              <div className="w-full text-left mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Items</p>
                
                <div className="flex flex-col gap-6">
                  {placedOrder?.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-[15px] text-slate-900 leading-snug mb-1.5">{item.title}</p>
                        {item.grindOption && (
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 inline-block px-2 py-0.5 bg-slate-100 rounded-md">
                            Grind: {item.grindOption}
                          </p>
                        )}
                        {item.subscriptionOption && (
                          <p className="text-[10px] font-bold text-[#9d4300] uppercase tracking-widest mb-1.5 inline-flex px-2 py-0.5 bg-[#fdfaf8] border border-[#9d4300] rounded-md ml-2 items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">autorenew</span>
                            {item.subscriptionOption}
                          </p>
                        )}
                        <p className="text-[12px] text-slate-500 font-medium">{item.desc || 'Ready to serve'}</p>
                      </div>
                      <span className="font-bold text-slate-900 text-[15px]">{item.quantity}</span>
                    </div>
                  ))}
                  {(!placedOrder || !placedOrder.items || placedOrder.items.length === 0) && (
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-[15px] text-slate-900 leading-snug mb-1.5">Koda Signature Blend</p>
                        <p className="text-[12px] text-slate-500 font-medium">Pour Over, Hot</p>
                      </div>
                      <span className="font-bold text-slate-900 text-[15px]">1</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full border-t border-dashed border-slate-200 mt-6 mb-8"></div>

              <div className="w-28 h-28 bg-white mb-5 overflow-hidden flex items-center justify-center relative">
                 <img src="https://images.unsplash.com/photo-1548680785-5b4cf39a3f28?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="QR Code" className="w-full h-full object-cover mix-blend-multiply opacity-80 rounded-2xl grayscale contrast-125" />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Show barcode at counter</p>
            </div>
            
            <div className="flex w-full h-4 justify-between -mt-[1px] z-10 px-2 pointer-events-none pb-1" aria-hidden="true">
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 bg-white rounded-full flex-shrink-0 mx-[1px]"></div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-12 w-full max-w-[420px] fade-in-up delay-300">
            <button className="w-full bg-black text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black/80 transition-colors flex justify-center items-center gap-3">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Save to Photos
            </button>
            <button onClick={() => onNavigate('menu')} className="w-full bg-[#fcf8f7] text-[#f97316] py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#fae8df] transition-colors border-none">
              View Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf8f7] text-[#000000] font-['Outfit'] min-h-screen selection:bg-[#9d4300] selection:text-white pb-12 flex flex-col">
      
      <TopNavBar onNavigate={onNavigate} activeRoute="checkout" cart={cart} />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start z-10 w-full flex-grow">
        
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10 fade-in-up">
          <header>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Complete your order</h1>
            <p className="text-slate-600 font-medium text-[15px]">
              Almost there. Please review your details below to ensure a smooth handoff.
            </p>
          </header>

          <section className="bg-white rounded-[1rem] p-1.5 flex shadow-sm border border-slate-100 max-w-xl">
            <button 
              type="button"
              onClick={() => setMethod('delivery')}
              className={`flex-1 py-3.5 rounded-[0.8rem] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${method === 'delivery' ? 'bg-black text-white' : 'bg-transparent text-slate-500 hover:text-black'}`}
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Delivery
            </button>
            <button 
              type="button"
              onClick={() => setMethod('pickup')}
              className={`flex-1 py-3.5 rounded-[0.8rem] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${method === 'pickup' ? 'bg-black text-white' : 'bg-transparent text-slate-500 hover:text-black'}`}
            >
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
                  <input type="text" id="firstName" value={contact.firstName} onChange={e => setContact({...contact, firstName: e.target.value})} placeholder="Jane" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Last Name</label>
                  <input type="text" id="lastName" value={contact.lastName} onChange={e => setContact({...contact, lastName: e.target.value})} placeholder="Doe" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Email Address</label>
                  <input type="email" id="email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} placeholder="jane.doe@example.com" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="giftMessage" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Gift Message (Optional)</label>
                  <textarea 
                    id="giftMessage" 
                    placeholder="Add a personalized note to your order..." 
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none resize-none h-24" 
                  />
                </div>
              </div>
            </section>

            {method === 'delivery' && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">2</span>
                  Delivery Address
                </h2>
                
                {addresses.length > 0 && (
                  <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {addresses.map(addr => (
                      <div 
                        key={addr.id} 
                        onClick={() => { setSelectedAddressId(addr.id); setIsAddingNewAddress(false); }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id && !isAddingNewAddress ? 'border-[#9d4300] bg-[#fdfaf8]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm">{addr.name}</h4>
                          {addr.isDefault && <span className="text-[9px] font-bold uppercase tracking-widest text-[#9d4300] bg-[#fcf8f7] px-2 py-1 rounded-md">Default</span>}
                        </div>
                        <p className="text-sm text-slate-600 truncate">{addr.street}</p>
                        <p className="text-xs text-slate-500 mt-1">{addr.city}</p>
                      </div>
                    ))}
                    
                    <div 
                      onClick={() => setIsAddingNewAddress(true)}
                      className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${isAddingNewAddress ? 'border-[#9d4300] bg-[#fdfaf8] text-[#9d4300]' : 'border-slate-200 bg-transparent hover:border-slate-300 text-slate-500'}`}
                    >
                      <span className="material-symbols-outlined text-[24px]">add_circle</span>
                      <span className="text-xs font-bold uppercase tracking-widest">Add New</span>
                    </div>
                  </div>
                )}

                {isAddingNewAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="md:col-span-2 text-sm font-bold">New Address Details</h3>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label htmlFor="addrName" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Address Label (e.g., Home, Office)</label>
                      <input type="text" id="addrName" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} placeholder="Home" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label htmlFor="street" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Street Address</label>
                      <input type="text" id="street" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} placeholder="123 Roaster Way, Apt 4B" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="city" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">City</label>
                      <input type="text" id="city" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="Portland" className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none" />
                    </div>
                    <div className="flex flex-col justify-end">
                      <button type="button" onClick={handleSaveNewAddress} className="w-full bg-[#9d4300] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#863700] transition-colors">
                        Save Address
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {method === 'pickup' && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">2</span>
                  Pickup Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Store Location</label>
                    <select 
                      value={storeLocation}
                      onChange={(e) => setStoreLocation(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="Downtown Roastery">Downtown Roastery</option>
                      <option value="Eastside Cafe">Eastside Cafe</option>
                      <option value="Westend Kiosk">Westend Kiosk</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Pickup Time</label>
                    <select 
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-medium text-sm focus:border-[#9d4300] focus:ring-1 focus:ring-[#9d4300] transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="ASAP (15-20 mins)">ASAP (15-20 mins)</option>
                      <option value="In 30 mins">In 30 mins</option>
                      <option value="In 1 hour">In 1 hour</option>
                      <option value="Tomorrow">Tomorrow</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">3</span>
                Payment
              </h2>
              
              <div className="flex flex-col gap-3 mb-6">
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`border-2 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all relative overflow-hidden ${paymentMethod === 'card' ? 'border-[#9d4300] bg-white' : 'border-slate-100 bg-slate-50 hover:bg-white'}`}
                >
                  {paymentMethod === 'card' && <div className="absolute inset-0 bg-[#9d4300]/5 pointer-events-none"></div>}
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="material-symbols-outlined text-[28px] text-black">credit_card</span>
                    <div>
                      <p className="text-sm font-bold text-black mb-0.5">Credit Card</p>
                      <p className="text-[13px] text-slate-500 font-medium">Secure encrypted transaction</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-[5px] relative z-10 transition-colors ${paymentMethod === 'card' ? 'border-[#9d4300] bg-white' : 'border-slate-300 bg-transparent'}`}></div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`border-2 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all relative overflow-hidden ${paymentMethod === 'transfer' ? 'border-[#9d4300] bg-white' : 'border-slate-100 bg-slate-50 hover:bg-white'}`}
                >
                  {paymentMethod === 'transfer' && <div className="absolute inset-0 bg-[#9d4300]/5 pointer-events-none"></div>}
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="material-symbols-outlined text-[28px] text-black">account_balance</span>
                    <div>
                      <p className="text-sm font-bold text-black mb-0.5">Bank Transfer</p>
                      <p className="text-[13px] text-slate-500 font-medium">BCA, Mandiri, BNI, BRI</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-[5px] relative z-10 transition-colors ${paymentMethod === 'transfer' ? 'border-[#9d4300] bg-white' : 'border-slate-300 bg-transparent'}`}></div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('qris')}
                  className={`border-2 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all relative overflow-hidden ${paymentMethod === 'qris' ? 'border-[#9d4300] bg-white' : 'border-slate-100 bg-slate-50 hover:bg-white'}`}
                >
                  {paymentMethod === 'qris' && <div className="absolute inset-0 bg-[#9d4300]/5 pointer-events-none"></div>}
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="material-symbols-outlined text-[28px] text-black">qr_code_scanner</span>
                    <div>
                      <p className="text-sm font-bold text-black mb-0.5">QRIS</p>
                      <p className="text-[13px] text-slate-500 font-medium">Pay with any e-wallet or bank app</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-[5px] relative z-10 transition-colors ${paymentMethod === 'qris' ? 'border-[#9d4300] bg-white' : 'border-slate-300 bg-transparent'}`}></div>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 fade-in-up">
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
              )}

              {paymentMethod === 'transfer' && (
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center fade-in-up text-center">
                  <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3 block mx-auto">account_balance</span>
                  <p className="text-sm font-medium text-slate-600">You will receive virtual account details to complete your payment on the next screen.</p>
                </div>
              )}

              {paymentMethod === 'qris' && (
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center fade-in-up text-center">
                   <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3 block mx-auto">qr_code_2</span>
                   <p className="text-sm font-medium text-slate-600">A QRIS code will be generated for you to scan and pay on the next screen.</p>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4 relative fade-in-up delay-200">
          <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-8 border border-slate-100">
            <h3 className="text-xl font-bold">Order Summary</h3>
            
            <div className="flex flex-col gap-6">
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.grindOption || 'none'}-${item.subscriptionOption || 'none'}-${index}`} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl shrink-0 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <span className="font-semibold text-sm">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    {item.grindOption && (
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 shrink-0 inline-block px-2 py-0.5 bg-slate-100 rounded-md">
                        Grind: {item.grindOption}
                      </p>
                    )}
                    {item.subscriptionOption && (
                      <p className="text-[10px] font-bold text-[#9d4300] uppercase tracking-widest mb-1.5 inline-flex px-2 py-0.5 bg-[#fdfaf8] border border-[#9d4300] rounded-md ml-2 items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">autorenew</span>
                        {item.subscriptionOption}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 font-medium mb-3">{item.desc}</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateQuantity(item.id, item.grindOption, item.subscriptionOption, -1)} className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-black hover:text-black transition-colors">
                        <span className="material-symbols-outlined text-[14px]">remove</span>
                      </button>
                      <span className="text-[13px] font-bold w-2 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.grindOption, item.subscriptionOption, 1)} className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-black hover:text-black transition-colors">
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {cart.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm font-bold text-slate-400">Your cart is empty.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-slate-100 text-[13px] font-medium text-slate-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {method === 'delivery' && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    Delivery Fee
                    <span className="material-symbols-outlined text-[14px] text-slate-400">info</span>
                  </span>
                  <span className="font-bold text-slate-800">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Taxes</span>
                <span className="font-bold text-slate-800">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between items-end mt-4 pt-6 border-t border-slate-100">
                <span className="text-xl font-bold text-black">Total</span>
                <span className="text-3xl font-black text-black tracking-tight">{formattedTotal}</span>
              </div>
            </div>

            {formError && (
              <div className="bg-red-50 text-[#9d4300] p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3">
                <span className="material-symbols-outlined text-[18px] mt-0.5">error</span>
                <p>{formError}</p>
              </div>
            )}

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

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
