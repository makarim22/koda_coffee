import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { getMenuItems, MenuItem, getUserWishlist, toggleWishlistItem } from '../data';
import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { auth } from '../auth';

export default function MenuPage({ onNavigate, cart, setCart }: BaseProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [grindOption, setGrindOption] = useState<string>('Whole Bean');
  const [subscriptionOption, setSubscriptionOption] = useState<string>('One-time Purchase');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      setIsMenuLoading(true);
      const items = await getMenuItems();
      setMenuItems(items);
      setIsMenuLoading(false);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const itemIds = await getUserWishlist(user.uid);
        setWishlist(new Set(itemIds));
      } else {
        setWishlist(new Set());
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    const user = auth.currentUser;
    if (!user) {
      setToastMessage({ title: 'Authentication Required', desc: 'Please log in to save items to your wishlist.', img: item.img });
      return;
    }
    const isSaved = wishlist.has(item.id);
    const newSavedState = !isSaved;
    
    // Optimistic update
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSavedState) newSet.add(item.id);
      else newSet.delete(item.id);
      return newSet;
    });

    try {
      await toggleWishlistItem(user.uid, item.id, newSavedState);
      setToastMessage({
        title: newSavedState ? 'Saved to Wishlist' : 'Removed from Wishlist',
        desc: newSavedState ? `${item.title} has been added to your wishlist.` : `${item.title} removed from wishlist.`,
        img: item.img
      });
    } catch (err) {
      console.error(err);
      // Revert on error
      setWishlist(prev => {
        const newSet = new Set(prev);
        if (isSaved) newSet.add(item.id);
        else newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; img: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MenuItem[] | null>(null);

  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, menuItems })
      });
      const data = await res.json();
      if (data.matchedIds) {
         // Maintain the order returned by the AI
         const matchedItems = data.matchedIds
          .map((id: string) => menuItems.find(item => item.id === id))
          .filter((item: MenuItem | undefined) => item !== undefined);
         setSearchResults(matchedItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const [compareList, setCompareList] = useState<MenuItem[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const toggleCompare = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (compareList.find(i => i.id === item.id)) {
      setCompareList(prev => prev.filter(i => i.id !== item.id));
      setCompareError(null);
    } else {
      if (compareList.length >= 3) {
        setCompareError('You can only compare up to 3 beans at a time.');
        setTimeout(() => setCompareError(null), 3000);
        return;
      }
      setCompareList(prev => [...prev, item]);
    }
  };

  const [brewGuideLoading, setBrewGuideLoading] = useState(false);
  const [brewGuide, setBrewGuide] = useState<{ temperature: string; grindSize: string; steepTime: string; steepSeconds: number } | null>(null);
  const [selectedRoast, setSelectedRoast] = useState<'Light' | 'Medium' | 'Dark'>('Medium');
  const [brewMethod, setBrewMethod] = useState<string>('V60 Pour Over');
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => (t !== null && t > 0 ? t - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch(e) {}
    }
    return () => clearInterval(interval!);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGetBrewGuide = async () => {
    if (!selectedItem) return;
    setBrewGuideLoading(true);
    setTimerActive(false);
    try {
      const res = await fetch('/api/brew-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: selectedItem.origin || 'Unknown',
          roastLevel: selectedRoast,
          method: brewMethod
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate brew guide');
      }
      setBrewGuide(data);
      setTimeLeft(data.steepSeconds || 0);
    } catch (e) {
      console.error(e);
      // Fallback
      setBrewGuide({
         targetTemp: "93°C",
         coffeeToWater: "1:15",
         steepSeconds: 120,
         steps: [
           "Our AI barista is currently at max capacity, but here's a reliable recipe:",
           "Boil water to 93°C.",
           "Grind coffee according to your selected method.",
           "Pour water progressively, wetting all grounds.",
           "Wait for completion."
         ]
      });
      setTimeLeft(120);
    } finally {
      setBrewGuideLoading(false);
    }
  };

  const [sharingState, setSharingState] = useState<'idle' | 'loading'>('idle');
  const [sharedImage, setSharedImage] = useState<string | null>(null);

  const handleShareProduct = async (item: MenuItem) => {
    setSharingState('loading');
    setSharedImage(null);
    try {
      const res = await fetch('/api/generate-share-graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          origin: item.origin || 'Unknown Origin',
          process: item.process || 'Standard',
          flavorNotes: item.desc || ''
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setSharedImage(data.imageUrl);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err: any) {
      console.error(err);
      setToastMessage({ 
        title: 'Error', 
        desc: err.message || 'Failed to generate share graphic.', 
        img: item.img 
      });
    } finally {
      setSharingState('idle');
    }
  };

  const openModal = (item: MenuItem) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setGrindOption('Whole Bean');
    setSubscriptionOption('One-time Purchase');
    setBrewGuide(null);
    setSelectedRoast('Medium');
    setBrewMethod('V60 Pour Over');
    setTimerActive(false);
    setTimeLeft(null);
    setSharedImage(null);
    setSharingState('idle');
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSharedImage(null);
    setSharingState('idle');
  };

  const handleAddToCart = () => {
    if (!setCart || !selectedItem) return;

    // Convert price string to number, e.g. "Rp 45.000" -> 45000
    let priceNumber = parseInt(selectedItem.price.replace(/[^\d]/g, ''), 10) || 0;

    const selectedGrind = ['espresso', 'pourOver', 'coldBrew'].includes(selectedItem.category) ? grindOption : undefined;
    const selectedSubscription = ['espresso', 'pourOver', 'coldBrew'].includes(selectedItem.category) && subscriptionOption !== 'One-time Purchase' ? subscriptionOption : undefined;

    if (selectedSubscription) {
      priceNumber = Math.round(priceNumber * 0.9);
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === selectedItem.id && i.grindOption === selectedGrind && i.subscriptionOption === selectedSubscription);
      if (existing) {
        return prev.map(i => i.id === selectedItem.id && i.grindOption === selectedGrind && i.subscriptionOption === selectedSubscription ? { ...i, quantity: i.quantity + itemQuantity } : i);
      }
      return [...prev, {
        id: selectedItem.id,
        title: selectedItem.title,
        price: priceNumber,
        desc: selectedItem.desc,
        img: selectedItem.img,
        quantity: itemQuantity,
        grindOption: selectedGrind,
        subscriptionOption: selectedSubscription
      }];
    });
    
    setToastMessage({
      title: 'Added to Order',
      desc: `${itemQuantity}x ${selectedItem.title}${selectedGrind ? ` (${selectedGrind})` : ''}${selectedSubscription ? ` [${selectedSubscription}]` : ''}`,
      img: selectedItem.img
    });

    closeModal();
    // onNavigate('checkout'); // don't navigate automatically

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const getFlavorData = (item: MenuItem) => {
    if (item.flavorProfile && item.flavorProfile.length > 0) {
      return item.flavorProfile.map(f => ({
        subject: f.metric,
        A: f.value * 20,
        fullMark: 100
      }));
    }
    const seed = item.title.length;
    return [
      { subject: 'Acidity', A: 40 + (seed * 7) % 60, fullMark: 100 },
      { subject: 'Body', A: 50 + (seed * 3) % 50, fullMark: 100 },
      { subject: 'Sweetness', A: 60 + (seed * 5) % 40, fullMark: 100 },
      { subject: 'Aroma', A: 70 + (seed * 11) % 30, fullMark: 100 },
      { subject: 'Aftertaste', A: 55 + (seed * 13) % 45, fullMark: 100 },
    ];
  };

  const menuData = {
    espresso: menuItems.filter(item => item.category === 'espresso'),
    pourOver: menuItems.filter(item => item.category === 'pourOver'),
    coldBrew: menuItems.filter(item => item.category === 'coldBrew'),
    pastries: menuItems.filter(item => item.category === 'pastries'),
  };

  const renderSection = (id: string, title: string, desc: string, items: MenuItem[]) => (
    <section id={id} className="scroll-mt-40">
      <header className="mb-12 border-b border-slate-200 pb-6 fade-in-up">
        <h2 className="text-3xl font-black mb-4">{title}</h2>
        <p className="text-[15px] font-medium leading-relaxed text-slate-500 max-w-xl">{desc}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {items.map((item) => (
          <article key={item.id} className={`group flex flex-col fade-in-up ${item.delay} cursor-pointer bg-white p-4 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transform transition-all duration-300 hover:scale-[1.02]`} onClick={() => openModal(item)}>
            <div className="aspect-[4/3] overflow-hidden relative bg-[#f4f1eb] mb-6 rounded-[1.5rem]">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                {item.origin && <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-[#9d4300] shadow-sm">{item.origin}</span>}
                {item.process && <span className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm">{item.process}</span>}
              </div>
              <button 
                onClick={(e) => handleToggleWishlist(e, item)}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-colors z-[5] ${
                  wishlist.has(item.id) ? 'bg-white text-red-500' : 'bg-black/30 text-white hover:bg-black/50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: wishlist.has(item.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
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
                {['espresso', 'pourOver', 'coldBrew'].includes(item.category) && (
                  <button 
                    onClick={(e) => toggleCompare(e, item)}
                    className={`ml-auto flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${compareList.some(i => i.id === item.id) ? 'bg-[#9d4300] border-[#9d4300] text-white' : 'border-slate-300 text-slate-400 hover:border-[#9d4300] hover:text-[#9d4300]'} z-10`}
                    title="Compare"
                  >
                    <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-[#fcf8f7] text-[#000000] font-['Outfit'] min-h-screen flex flex-col relative overflow-hidden selection:bg-[#9d4300] selection:text-white">
      <TopNavBar onNavigate={onNavigate} activeRoute="menu" cart={cart} />
      
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
          {/* Semantic Search Bar */}
          <div className="bg-white rounded-3xl p-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center shrink-0">
            <form onSubmit={handleSemanticSearch} className="flex-1 flex items-center">
              <span className="material-symbols-outlined text-slate-400 ml-4 mr-2">search</span>
              <input 
                type="text" 
                placeholder="Search by flavor notes (e.g. 'bright and fruity' or 'chocolatey and bold')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-slate-400 py-3"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-black mr-2"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <button 
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="bg-[#9d4300] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#803600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                )}
                Ask AI
              </button>
            </form>
          </div>

          {searchResults ? (
            <div className="fade-in-up">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <h2 className="text-3xl font-black">Search Results</h2>
                <button 
                  onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                  className="text-xs font-bold uppercase tracking-widest text-[#9d4300] hover:underline"
                >
                  Clear Results
                </button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {searchResults.map(item => (
                    <article key={item.id} className="group flex flex-col cursor-pointer bg-white p-4 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transform transition-all duration-300 hover:scale-[1.02]" onClick={() => openModal(item)}>
                      <div className="aspect-[4/3] overflow-hidden relative bg-[#f4f1eb] mb-6 rounded-[1.5rem]">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          {item.origin && <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-[#9d4300] shadow-sm">{item.origin}</span>}
                          {item.process && <span className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm">{item.process}</span>}
                        </div>
                        <button 
                          onClick={(e) => handleToggleWishlist(e, item)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-colors z-[5] ${
                            wishlist.has(item.id) ? 'bg-white text-red-500' : 'bg-black/30 text-white hover:bg-black/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: wishlist.has(item.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
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
                          {['espresso', 'pourOver', 'coldBrew'].includes(item.category) && (
                            <button 
                              onClick={(e) => toggleCompare(e, item)}
                              className={`ml-auto flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${compareList.some(i => i.id === item.id) ? 'bg-[#9d4300] border-[#9d4300] text-white' : 'border-slate-300 text-slate-400 hover:border-[#9d4300] hover:text-[#9d4300]'} z-10`}
                              title="Compare"
                            >
                              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
                  <p className="text-slate-500 font-medium">No coffee beans matched your search.<br/>Try describing different flavor notes like 'chocolate', 'floral', or 'berries'.</p>
                </div>
              )}
            </div>
          ) : isMenuLoading ? (
            <div className="animate-pulse space-y-16">
              {[1, 2, 3].map((section) => (
                <section key={section}>
                  <header className="mb-12 border-b border-slate-200 pb-6">
                    <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full max-w-xl"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/5 max-w-xl mt-2"></div>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {[1, 2, 3, 4].map((item) => (
                      <article key={item} className="flex flex-col bg-white p-4 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="aspect-[4/3] bg-slate-200 mb-6 rounded-[1.5rem]"></div>
                        <div className="px-2 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-2 gap-4">
                            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-200 rounded w-12 mt-1"></div>
                          </div>
                          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-6"></div>
                          <div className="mt-auto h-4 bg-slate-200 rounded w-24"></div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          
          <div 
            className="relative bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] md:max-h-[80vh] fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 hover:bg-white hover:text-black hover:shadow-md transition-all border border-slate-200/50"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto shrink-0 relative bg-[#f4f1eb] p-4">
              <img 
                src={selectedItem.img} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover rounded-2xl" 
              />
            </div>

            {/* Content Side */}
            <div className="flex flex-col flex-1 min-h-0 w-full md:w-1/2">
              <div className="p-8 md:p-10 flex-1 overflow-y-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedItem.category === 'espresso' || selectedItem.category === 'pourOver' ? (
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                      ROAST: {selectedRoast.toUpperCase()}
                    </span>
                  ) : null}
                  {selectedItem.process && (
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                      PROCESS: {selectedItem.process.toUpperCase()}
                    </span>
                  )}
                  {selectedItem.origin && (
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                      ORIGIN: {selectedItem.origin.toUpperCase()}
                    </span>
                  )}
                </div>

                <h2 className="text-4xl font-black text-black leading-tight mb-2 tracking-tight">
                  {selectedItem.title}
                </h2>
                
                <div className="text-xl font-bold text-[#9d4300] mb-6">
                  {selectedItem.price}
                </div>

                <p className="text-[14px] leading-relaxed text-slate-600 font-medium mb-8">
                  {selectedItem.desc}
                </p>

                {/* Generate Share Graphic Section */}
                <div className="mb-8 p-4 rounded-xl border border-slate-100 bg-[#fdfaf8] relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#9d4300]" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-black">Social Share</h4>
                    </div>
                    {sharingState === 'idle' && !sharedImage && (
                      <button 
                        onClick={() => handleShareProduct(selectedItem)}
                        className="text-[9px] font-bold uppercase tracking-widest text-[#9d4300] hover:text-white hover:bg-[#9d4300] bg-orange-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        Generate Graphic
                      </button>
                    )}
                  </div>
                  
                  {sharingState === 'loading' && (
                     <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 animate-pulse border border-slate-100">
                       <span className="material-symbols-outlined text-[#9d4300] rotate-animation text-2xl">sync</span>
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Dreaming up abstract flavors...</span>
                     </div>
                  )}
                  
                  {sharedImage && (
                    <div className="mt-4 flex flex-col items-center">
                      <div className="relative w-full aspect-square max-w-[200px] rounded-xl overflow-hidden shadow-lg border-4 border-white mb-4">
                        <img src={sharedImage} alt="Generated share graphic" className="w-full h-full object-cover" />
                      </div>
                      <a 
                        href={sharedImage}
                        download={`share-${selectedItem.title.toLowerCase().replace(/ /g, '-')}.jpg`}
                        className="text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-slate-800 px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Download 
                      </a>
                    </div>
                  )}
                  
                  {sharingState === 'idle' && !sharedImage && (
                    <p className="text-xs text-slate-500 leading-relaxed pr-6 relative z-10">
                      Generate an AI custom, aesthetic graphic capturing the unique flavor profile and notes of {selectedItem.title} to share on your socials.
                    </p>
                  )}
                </div>

                {/* Grind Option */}
                {(selectedItem.category === 'espresso' || selectedItem.category === 'pourOver' || selectedItem.category === 'coldBrew') && (
                  <div className="mb-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Grind Option</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Whole Bean', 'Espresso', 'AeroPress', 'Pour Over', 'French Press'].map(option => (
                        <button
                          key={option}
                          onClick={() => setGrindOption(option)}
                          className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${grindOption === option ? 'bg-[#9d4300] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subscription Option */}
                {(selectedItem.category === 'espresso' || selectedItem.category === 'pourOver' || selectedItem.category === 'coldBrew') && (
                  <div className="mb-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Purchase Type</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <button
                        onClick={() => setSubscriptionOption('One-time Purchase')}
                        className={`py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all text-left border-2 ${subscriptionOption === 'One-time Purchase' ? 'border-[#9d4300] bg-[#fdfaf8] text-[#9d4300] shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                      >
                        One-time Purchase
                      </button>
                    </div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#9d4300] mb-1 mt-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">autorenew</span> Subscribe & Save 10%
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {['Every 1 Week', 'Every 2 Weeks', 'Every 4 Weeks'].map(freq => (
                        <button
                          key={freq}
                          onClick={() => setSubscriptionOption(freq)}
                          className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${subscriptionOption === freq ? 'border-[#9d4300] bg-[#9d4300] text-white shadow-md' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'}`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Roast Level */}
                {(selectedItem.category === 'espresso' || selectedItem.category === 'pourOver' || selectedItem.category === 'coldBrew') && (
                  <div className="mb-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Roast Level</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full shadow-inner transition-colors duration-700 ease-in-out flex items-center justify-center border-4 border-slate-100 shrink-0"
                        style={{
                          backgroundColor: 
                            selectedRoast === 'Light' ? '#d99d6a' : 
                            selectedRoast === 'Medium' ? '#703e1e' : '#2b1509'
                        }}
                      >
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                         {['Light', 'Medium', 'Dark'].map(roast => (
                            <button
                              key={roast}
                              onClick={() => setSelectedRoast(roast as 'Light' | 'Medium' | 'Dark')}
                              className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${selectedRoast === roast ? 'bg-[#9d4300] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                              {roast}
                            </button>
                         ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Flavor Profile (Only for coffee categories) */}
                {(selectedItem.category === 'espresso' || selectedItem.category === 'pourOver' || selectedItem.category === 'coldBrew') && (
                  <div className="mb-10 flex flex-col gap-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Flavor Profile</h4>
                    
                    <div className="w-full h-[200px] -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getFlavorData(selectedItem)}>
                          <PolarGrid stroke="#f1f5f9" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Flavor" dataKey="A" stroke="#000000" fill="#000000" fillOpacity={0.1} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Brew Guide Section */}
                {(selectedItem.category === 'espresso' || selectedItem.category === 'pourOver') && (
                  <div className="mb-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-black">Brew Guide</h4>
                      {!brewGuide && !brewGuideLoading && (
                        <button 
                          onClick={handleGetBrewGuide}
                          className="text-[10px] font-bold uppercase tracking-widest text-[#9d4300] hover:text-[#803600] flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full"
                        >
                          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                          Generate Guide
                        </button>
                      )}
                    </div>

                    {!brewGuide && !brewGuideLoading && (
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Select Brew Method</label>
                        <select 
                          value={brewMethod} 
                          onChange={(e) => setBrewMethod(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#9d4300] focus:border-[#9d4300] block w-full p-2.5 outline-none"
                        >
                          <option value="V60 Pour Over">V60 Pour Over</option>
                          <option value="French Press">French Press</option>
                          <option value="AeroPress">AeroPress</option>
                          <option value="Chemex">Chemex</option>
                          <option value="Espresso Machine">Espresso Machine</option>
                        </select>
                      </div>
                    )}
                    
                    {brewGuideLoading && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center gap-3 animate-pulse mt-2">
                        <span className="material-symbols-outlined text-[#9d4300] rotate-animation">sync</span>
                        <span className="text-xs font-medium text-slate-500 text-center">Tuning parameters for {brewMethod}...</span>
                      </div>
                    )}

                    {brewGuide && (
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500 px-1 border-b border-slate-100 pb-2">
                          <span>Method: <span className="text-slate-800">{brewMethod}</span></span>
                          <button onClick={() => { setBrewGuide(null); setTimerActive(false); }} className="text-[#9d4300] hover:underline">Change</button>
                        </div>
                        
                        <div className="bg-[#fcf8f7] border border-[#f97316]/20 rounded-xl p-4 grid grid-cols-2 gap-4 relative overflow-hidden">
                          
                          <div className="flex flex-col gap-4 z-10">
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 tracking-widest"><span className="material-symbols-outlined text-[12px]">thermostat</span> Temp</span>
                              <span className="text-sm font-black text-slate-800">{brewGuide.temperature}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 tracking-widest"><span className="material-symbols-outlined text-[12px]">grain</span> Grind</span>
                              <span className="text-sm font-black text-slate-800">{brewGuide.grindSize}</span>
                            </div>
                          </div>

                          {/* Interactive Timer */}
                          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-4 border border-[#f97316]/10 z-10">
                            <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-2">
                              <span className="material-symbols-outlined text-[12px]">timer</span> Brew Timer
                            </span>
                            <span className="text-3xl font-mono font-black text-[#9d4300] mb-3 tracking-wider">
                              {formatTime(timeLeft !== null ? timeLeft : (brewGuide.steepSeconds || 0))}
                            </span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => timerActive ? setTimerActive(false) : (timeLeft === 0 ? (setTimeLeft(brewGuide.steepSeconds), setTimerActive(true)) : setTimerActive(true))}
                                className="bg-black text-white hover:bg-[#9d4300] transition-colors w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[16px]">{timerActive ? 'pause' : 'play_arrow'}</span>
                              </button>
                              <button 
                                onClick={() => { setTimerActive(false); setTimeLeft(brewGuide.steepSeconds || 0); }}
                                className="bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[16px]">refresh</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Area */}
              <div className="pt-6 pb-8 px-8 md:px-10 flex gap-4 items-center border-t border-slate-100 bg-white shrink-0">
                {/* Quantity */}
                <div className="flex items-center gap-4 px-4 py-3 bg-white border border-slate-200 rounded-full shrink-0">
                  <button 
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="text-slate-400 hover:text-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{itemQuantity}</span>
                  <button 
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="text-slate-400 hover:text-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>

                {/* Add to Order */}
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-3.5 px-6 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-[110] bg-white text-black p-4 pr-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-4 slide-in-right">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-[#f4f1eb]">
            <img src={toastMessage.img} alt={toastMessage.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-0.5">{toastMessage.title}</p>
            <p className="text-sm font-bold text-slate-800">{toastMessage.desc}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="absolute top-2 right-2 text-slate-400 hover:text-black">
             <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Compare Floating Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-6 z-40 slide-in-bottom">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c5a059]">compare_arrows</span>
            <span className="text-sm font-bold hidden sm:inline">{compareList.length} Selected</span>
          </div>
          <div className="flex -space-x-3">
            {compareList.map(item => (
              <img key={`compare-bar-${item.id}`} src={item.img} alt={item.title} className="w-10 h-10 rounded-full border-2 border-black object-cover bg-white" />
            ))}
          </div>
          <button 
            onClick={() => setShowCompareModal(true)}
            className="bg-[#c5a059] text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-white transition-colors whitespace-nowrap"
          >
            Compare
          </button>
          <div className="w-px h-6 bg-white/20"></div>
          <button 
            onClick={() => setCompareList([])}
            className="text-white/60 hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* Compare Error Toast */}
      {compareError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-red-500 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 slide-in-top font-bold text-sm">
          <span className="material-symbols-outlined">error</span>
          <span>{compareError}</span>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setShowCompareModal(false)}>
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xl"></div>
          
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col relative z-10 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9d4300]">compare_arrows</span>
                COMPARE COFFEES
              </h2>
              <button onClick={() => setShowCompareModal(false)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors text-black">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compareList.map(item => (
                  <div key={`compare-${item.id}`} className="flex flex-col bg-slate-50 border border-slate-100 rounded-3xl p-6 relative">
                    <button 
                      onClick={(e) => toggleCompare(e, item)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm z-10"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                    
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-sm shrink-0">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-black mb-1">{item.title}</h3>
                      <span className="text-sm font-bold text-[#9d4300]">{item.price}</span>
                    </div>

                    <div className="space-y-4 flex-1">
                      {item.origin && (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Origin</span>
                          <span className="font-medium text-slate-800">{item.origin}</span>
                        </div>
                      )}
                      
                      {item.process && (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Process</span>
                          <span className="font-medium text-slate-800">{item.process}</span>
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Notes</span>
                        <p className="font-medium text-slate-800 text-sm leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Flavor Profile</h4>
                        <div className="w-full h-[150px] -ml-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getFlavorData(item)}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Flavor" dataKey="A" stroke="#9d4300" fill="#9d4300" fillOpacity={0.2} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { openModal(item); setShowCompareModal(false); }}
                      className="mt-6 w-full py-3 bg-white border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
