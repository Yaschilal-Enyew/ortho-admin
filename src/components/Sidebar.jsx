import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { 
  LayoutDashboard, 
  PlusSquare, 
  FileText, 
  Users, 
  GraduationCap, 
  BrainCircuit,
  Star
} from "lucide-react";

const Sidebar = ({ language }) => {
  
  const content = {
    EN: {
      panel: "ADMIN PANEL",
      sub: "CONTROL CENTER",
      courses: "Course Management",
      quizzes: "Quiz Management",
      add: "Add New Event",
      posts: "Manage Posts",
      students: "Manage Students",
    },
    AM: {
      panel: "የአስተዳዳሪ ክፍል",
      sub: "መቆጣጠሪያ ማዕከል",
      courses: "የትምህርት አስተዳደር",
      quizzes: "የፈተና አስተዳደር",
      add: "አዲስ ጨምር",
      posts: "ጽሁፎችን አስተዳድር",
      students: "ተማሪዎችን አስተዳድር",
    }
  };

  const t = content[language] || content.EN;

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 font-black uppercase tracking-widest text-[11px] md:text-[13px]
     ${
       isActive
         ? "bg-amber-500 text-[#1A1614] shadow-[0_10px_30px_rgba(212,175,55,0.3)] scale-[1.02]"
         : "text-white/50 hover:bg-white/5 hover:text-white"
     }`;

  return (
    <div className="w-full md:w-72 min-h-[70px] md:min-h-screen bg-[#1A1614] border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col relative z-20">
      
      {/* --- HEADER --- */}
      <div className="hidden md:block w-full px-8 py-10">
        <div className="flex items-center gap-2 mb-2">
           <Star size={10} className="text-amber-500" fill="currentColor" />
           <p className="text-[10px] font-black text-amber-500 tracking-[0.4em]">
             {t.sub}
           </p>
        </div>
        <h2 className={`text-2xl font-black text-white tracking-tighter ${language === 'AM' ? 'font-sans' : 'font-serif italic'}`}>
          {t.panel}
        </h2>
      </div>

      {/* --- LINKS --- */}
      <div className="w-full flex md:flex-col gap-2 md:gap-4 px-4 py-3 md:px-6 overflow-x-auto no-scrollbar">
        
        {/* Course Management */}
        <NavLink to="/courses" className={linkClass}>
          <GraduationCap size={22} className="flex-shrink-0" />
          <p className="hidden md:block whitespace-nowrap">{t.courses}</p>
        </NavLink>

       

        {/* Add Event */}
        <NavLink to="/add" className={linkClass}>
          <PlusSquare size={22} className="flex-shrink-0" />
          <p className="hidden md:block whitespace-nowrap">{t.add}</p>
        </NavLink>

        {/* Manage Posts */}
        <NavLink to="/list" className={linkClass}>
          <FileText size={22} className="flex-shrink-0" />
          <p className="hidden md:block whitespace-nowrap">{t.posts}</p>
        </NavLink>

        {/* Manage Students */}
        <NavLink to="/orders" className={linkClass}>
          <Users size={22} className="flex-shrink-0" />
          <p className="hidden md:block whitespace-nowrap">{t.students}</p>
        </NavLink>
      </div>

      {/* Decorative Bottom Glow (Mobile Hidden) */}
      <div className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
         <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </div>
    </div>
  );
};

export default Sidebar;