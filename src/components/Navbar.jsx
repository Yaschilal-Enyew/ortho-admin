import React from "react";
import { Globe, LogOut, ShieldCheck } from "lucide-react";

export default function Navbar({ setToken, language, toggleLanguage }) {
  
  const content = {
    EN: {
      title: "ORTHODOX",
      sub: "ADMIN PANEL",
      toggle: "AMHARIC",
      logout: "Logout"
    },
    AM: {
      title: "ኦርቶዶክስ",
      sub: "የአስተዳዳሪ ክፍል",
      toggle: "ENGLISH",
      logout: "ውጣ"
    }
  };

  const t = content[language] || content.EN;

  return (
    <nav className="flex items-center justify-between bg-[#1A1614] py-4 px-6 md:px-12 border-b border-white/5 relative z-50 shadow-2xl">
      
      {/* --- LEFT SECTION: BRANDING --- */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src='logo.jpg'
            alt="Logo"
            className="w-12 h-12 object-contain border-2 border-amber-500 bg-[#26211E] rounded-full p-1 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 border-2 border-[#1A1614]">
            <ShieldCheck size={12} className="text-[#1A1614]" fill="currentColor" />
          </div>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black text-white leading-none tracking-tighter">
            {t.title}<span className="text-amber-500">ADMIN</span>
          </h1>
          <p className="text-[10px] font-black text-amber-500/60 tracking-[0.4em] uppercase mt-1">
            {t.sub}
          </p>
        </div>
      </div>

      {/* --- RIGHT SECTION: ACTIONS --- */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* LANGUAGE TOGGLE BUTTON */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-xl border-2 border-amber-500/50 text-white font-black text-xs md:text-sm hover:bg-amber-500 hover:text-[#1A1614] hover:border-amber-500 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.1)] group"
        >
          <Globe size={16} className="group-hover:rotate-12 transition-transform" />
          <span className="tracking-widest">{t.toggle}</span>
        </button>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => { 
            setToken(''); 
            localStorage.removeItem('token'); 
          }}
          className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 transition-all duration-300 group"
        >
          <span className="hidden md:block font-black text-xs uppercase tracking-widest">
            {t.logout}
          </span>
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
}