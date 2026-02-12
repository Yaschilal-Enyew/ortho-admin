import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CourseManagement from './pages/CourseManagement'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'

// Centralized Config
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  // Language State for Admin Panel
  const [language, setLanguage] = useState(localStorage.getItem('adminLang') || 'EN');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('adminLang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'AM' : 'EN');
  }

  return (
    <div className='bg-[#1A1614] min-h-screen font-sans text-white overflow-x-hidden'>
      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        theme="dark"
        toastStyle={{ backgroundColor: '#2D241E', color: '#D4AF37', border: '1px solid #D4AF37' }}
      />
      
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <div className="relative">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Admin Navbar */}
          <Navbar setToken={setToken} language={language} toggleLanguage={toggleLanguage} />
          
          <div className='flex flex-col md:flex-row w-full max-w-[2000px] mx-auto relative z-10'>
            
            {/* Sidebar with Language Awareness */}
            <div className="md:w-72 flex-shrink-0">
              <Sidebar language={language} />
            </div>
            
            <main className='flex-1 w-full min-h-[calc(100vh-80px)] p-4 md:p-8 lg:p-12'>
              
              {/* LARGE ADMIN SUBHEADING */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10 flex items-center gap-4"
              >
                <div className="h-px w-10 bg-amber-500/30"></div>
                <span className="text-sm md:text-xl font-black text-amber-500 uppercase tracking-[0.5em]">
                  {language === 'EN' ? 'ADMINISTRATOR COMMAND' : 'የአስተዳዳሪ መቆጣጠሪያ'}
                </span>
              </motion.div>

              {/* Main Content Container - Glass Obsidian Style */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-[#26211E]/50 backdrop-blur-xl rounded-[3rem] border border-white/5 p-6 md:p-10 shadow-2xl min-h-full'
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/courses" />} />
                  <Route path='/add' element={<Add token={token} language={language} />} />
                  <Route path='/list' element={<List token={token} language={language} />} />
                  <Route path='/orders' element={<Orders token={token} language={language} />} />
                  <Route path='/courses' element={<CourseManagement token={token} language={language} />} />
                  <Route path="*" element={
                    <div className="p-20 text-center">
                      <h2 className="text-4xl font-black text-white/20 uppercase tracking-tighter">404 - Sanctuary Not Found</h2>
                    </div>
                  } />
                </Routes>
              </motion.div>

              {/* Decorative Admin Footer */}
              <div className="mt-12 text-center opacity-20">
                <span className="text-[10px] font-black uppercase tracking-[1em] text-white">
                  {language === 'EN' ? 'SECURED SYSTEM • 2024' : 'ደህንነቱ የተጠበቀ ስርዓት • 2024'}
                </span>
              </div>
            </main>
          </div>

          {/* Floating Language Switcher for Admin Convenience */}
          <button 
            onClick={toggleLanguage}
            className="fixed bottom-8 right-8 z-50 bg-amber-500 text-[#1A1614] p-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black hover:scale-110 transition-transform active:scale-95"
          >
            <Globe size={20} />
            <span className="text-xs tracking-tighter">{language === 'EN' ? 'AMHARIC' : 'ENGLISH'}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default App