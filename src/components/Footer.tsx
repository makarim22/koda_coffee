export default function Footer() {
  return (
    <footer className="w-full mt-24 py-12 border-t border-[#1a1a1a]/10 bg-[#f2f0ea]">
      <div className="flex flex-col md:flex-row justify-between items-baseline px-12 max-w-7xl mx-auto gap-12">
        <div className="font-sans text-[9px] uppercase tracking-[0.2em] flex flex-col md:flex-row gap-8 md:gap-12">
          <div><span className="opacity-40 mr-2">Brand</span> Koda Coffee Roasters</div>
          <div><span className="opacity-40 mr-2">Est.</span> Twenty Twenty-Four</div>
          <div><span className="opacity-40 mr-2">Ethos</span> Editorial by Design</div>
        </div>
        
        <ul className="flex flex-wrap gap-8 font-sans text-[10px] uppercase tracking-[0.3em] font-semibold text-[#1a1a1a] opacity-70">
          <li className="hover:opacity-100 cursor-pointer transition-opacity">Sustainability</li>
          <li className="hover:opacity-100 cursor-pointer transition-opacity">Wholesale</li>
          <li className="hover:opacity-100 cursor-pointer transition-opacity">Careers</li>
          <li className="hover:opacity-100 cursor-pointer transition-opacity">Privacy</li>
        </ul>
      </div>
    </footer>
  );
}
