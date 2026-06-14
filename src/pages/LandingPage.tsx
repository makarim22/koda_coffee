import { BaseProps } from '../types';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { subscribeNewsletter, getMenuItems, MenuItem } from '../data';

const FadeInSection = ({ children, className = '', delay = '' }: { children: React.ReactNode, className?: string, delay?: string }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`${className} ${isVisible ? `fade-in-up ${delay}` : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};

const QUIZ_QUESTIONS = [
  {
    question: "How do you usually start your morning?",
    options: ["Rushed and need immediate energy", "Slow and contemplative", "Ready for a bold adventure", "Craving something sweet and comforting"]
  },
  {
    question: "If your perfect coffee was a music genre, it would be:",
    options: ["Classical Symphony", "Heavy Metal", "Smooth Jazz", "Upbeat Pop"]
  },
  {
    question: "Which flavor profile intrigues you the most?",
    options: ["Floral & Tea-like", "Chocolate & Nuts", "Berries & Jam", "Caramel & Vanilla"]
  }
];

const FAQ_ITEMS = [
  {
    question: "When do you roast and ship your coffee?",
    answer: "We roast our coffee every Monday and Thursday. All orders are shipped within 24 hours of roasting to ensure maximum freshness. Standard shipping takes 3-5 business days."
  },
  {
    question: "How should I store my coffee beans?",
    answer: "Keep your beans in an airtight container at room temperature, away from direct sunlight and heat. We recommend against storing coffee in the fridge or freezer as moisture can compromise the flavor."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we ship within the US and to select international destinations. If your country is not listed at checkout, please contact our support team."
  },
  {
    question: "What is your recommended brew method for beginners?",
    answer: "We highly recommend starting with a French Press. It's forgiving, requires minimal equipment, and allows you to taste the full body and inherent oils of the coffee without paper filters."
  }
];

export default function LandingPage({ onNavigate, cart }: BaseProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<{ item: MenuItem, reason: string } | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setIsInitialLoading(true);
    getMenuItems().then(items => {
      setMenuItems(items);
      setIsInitialLoading(false);
    });
  }, []);

  const handleQuizAnswer = async (answer: string) => {
    const newAnswers = { ...quizAnswers, [quizStep]: answer };
    setQuizAnswers(newAnswers);
    
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Finish quiz
      setQuizLoading(true);
      try {
        const res = await fetch('/api/coffee-personality', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: newAnswers,
            menuItems: menuItems.filter(m => m.category !== 'pastries') // only coffees
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch personality');
        }
        const recommendedItem = menuItems.find(m => m.id === data.recommendedId);
        if (recommendedItem) {
          setQuizResult({ item: recommendedItem, reason: data.reason });
        } else {
          throw new Error('Recommended item not found');
        }
      } catch (err) {
        console.error(err);
        // Fallback or show error
        setQuizResult({ 
          item: menuItems[0], 
          reason: "Oops! Our AI is taking a coffee break. In the meantime, we highly recommend our house favorite!" 
        });
      } finally {
        setQuizLoading(false);
      }
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcf8f7] text-[#000000] min-h-screen font-['Outfit'] selection:bg-[#9d4300] selection:text-white">
      
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <TopNavBar onNavigate={onNavigate} activeRoute="landing" cart={cart} />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] bg-black mt-[88px] flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=2574&auto=format&fit=crop" 
          alt="Coffee Roaster" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <FadeInSection className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-xl">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e09121] mb-6">EST. 2024</div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight">
              Our Craft,<br />
              Our Story
            </h1>
          </div>
        </FadeInSection>
      </section>

      {/* The Origin Section */}
      <section className="py-24 md:py-32 bg-[#fcf8f7]">
        <FadeInSection className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
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
        </FadeInSection>
      </section>

      {/* Precision as Art Section */}
      <section className="py-24 md:py-32 bg-[#0c0c0c] text-white">
        <FadeInSection className="max-w-[1200px] mx-auto px-6 md:px-12">
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
        </FadeInSection>
      </section>

      {/* The Collective Section */}
      <section className="py-24 md:py-32 bg-[#f6f3f0]">
        <FadeInSection className="max-w-[1400px] mx-auto px-6 md:px-12">
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
        </FadeInSection>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 md:py-32 bg-[#fcf8f7]">
        <FadeInSection className="max-w-[1200px] mx-auto px-6 md:px-12">
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
        </FadeInSection>
      </section>

      {/* Coffee Personality Quiz Section */}
      <section className="py-24 bg-[#e0deda] text-black">
        <FadeInSection className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9d4300] mb-4">Discover Your Match</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Coffee Personality</h2>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-lg min-h-[400px] flex flex-col justify-center">
            {isInitialLoading ? (
              <div className="flex flex-col h-full animate-pulse">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((_, idx) => (
                      <div key={idx} className="h-1 w-6 rounded-full bg-slate-200" />
                    ))}
                  </div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                  {[1, 2, 3, 4].map((_, idx) => (
                    <div key={idx} className="h-20 bg-slate-200 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            ) : quizLoading ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <span className="material-symbols-outlined text-[#9d4300] text-5xl rotate-animation">sync</span>
                <p className="font-bold text-xl text-slate-800">Analyzing your palate...</p>
              </div>
            ) : quizResult ? (
              <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
                <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img src={quizResult.item.img} alt={quizResult.item.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9d4300] mb-2">Your Perfect Match</div>
                  <h3 className="text-3xl font-black mb-2">{quizResult.item.title}</h3>
                  <p className="text-sm font-bold text-slate-500 mb-6">{quizResult.item.origin} • {quizResult.item.process}</p>
                  <p className="text-slate-700 font-medium leading-relaxed mb-8">{quizResult.reason}</p>
                  <button 
                    onClick={() => {
                      setQuizStep(0);
                      setQuizAnswers({});
                      setQuizResult(null);
                    }}
                    className="border-2 border-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Step {quizStep + 1} of {QUIZ_QUESTIONS.length}</span>
                  <div className="flex gap-1">
                    {QUIZ_QUESTIONS.map((_, idx) => (
                      <div key={idx} className={`h-1 w-6 rounded-full ${idx <= quizStep ? 'bg-[#9d4300]' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-8 text-center">{QUIZ_QUESTIONS[quizStep].question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(opt)}
                      className="bg-slate-50 border-2 border-transparent hover:border-[#9d4300] py-6 px-4 rounded-2xl text-center font-bold text-slate-700 transition-all shadow-sm hover:shadow-md"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeInSection>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#fcf8f7] text-black">
        <FadeInSection className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9d4300] mb-4">Have Questions?</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={`border border-slate-200 rounded-2xl overflow-hidden transition-colors ${isOpen ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-white/50'}`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-bold text-lg">{faq.question}</span>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#9d4300]' : 'text-slate-400'}`}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInSection>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-[#0c0c0c] text-white">
        <FadeInSection className="max-w-xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e09121] mb-4">JOIN OUR ROASTING JOURNEY</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Inside the Roastery</h2>
          <p className="text-[#a0a0a0] font-medium leading-relaxed text-[15px] mb-8">
            Subscribe for early access to micro-lot releases, brewing intelligence, and editorial dispatches from the source.
          </p>
          
          <form className="w-full relative" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
              className="w-full bg-white/5 border border-white/20 text-white rounded-full px-6 py-4 outline-none text-sm font-medium tracking-wide placeholder:text-white/30 focus:border-[#e09121] transition-colors"
              required
            />
            <button 
              type="submit" 
              disabled={loading || success}
              className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-full text-[11px] font-extrabold uppercase tracking-[0.1em] hover:bg-[#e09121] hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
            >
              {loading ? 'Subscribing...' : success ? 'Subscribed' : 'Submit'}
            </button>
          </form>
          {success && (
             <p className="text-[#e09121] text-xs font-bold uppercase tracking-widest mt-4">Welcome to the collective.</p>
          )}
        </FadeInSection>
      </section>

      {/* Taste the Narrative / Footer CTA */}
      <section className="py-24 bg-[#fcf8f7]">
        <FadeInSection className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Taste the Narrative.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('menu')} className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full text-[11px] font-extrabold uppercase tracking-[0.1em] hover:bg-black/80 transition-colors">
              Shop Subscriptions
            </button>
            <button onClick={() => onNavigate('cafes')} className="w-full sm:w-auto bg-transparent border border-[#d2cbc3] text-[#9d4300] px-8 py-4 rounded-full text-[11px] font-extrabold uppercase tracking-[0.1em] hover:bg-[#fff9ef] transition-colors">
              Find a Cafe
            </button>
          </div>
        </FadeInSection>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}


