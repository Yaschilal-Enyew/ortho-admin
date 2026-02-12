import React, { useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
            
            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Authentication Successful");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center w-full bg-[#FBFBFB] p-6 text-slate-900 relative overflow-hidden'>
            
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[120px] -z-10" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] w-full max-w-md p-10 sm:p-12 relative'
            >
                {/* Top Badge Icon */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 p-4 rounded-2xl shadow-xl">
                    <ShieldCheck className="text-amber-500" size={28} />
                </div>

                <div className='text-center mb-10 mt-2'>
                    <h1 className='text-3xl font-black uppercase tracking-tight text-slate-900'>
                        Admin <span className='text-amber-600 font-light italic'>Portal</span>
                    </h1>
                    <p className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2'>
                        Authorized Access Only
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className='space-y-6'>
                    
                    {/* EMAIL FIELD */}
                    <div className='space-y-1'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4'>
                            <Mail size={12} className="text-amber-600" /> Administrative Email
                        </label>
                        <div className='relative'>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                className='w-full pl-6 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:font-normal placeholder:text-slate-300' 
                                type="email" 
                                placeholder='admin@email.com' 
                                required
                            />
                        </div>
                    </div>

                    {/* PASSWORD FIELD */}
                    <div className='space-y-1'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4'>
                            <Lock size={12} className="text-amber-600" /> Security Key
                        </label>
                        <div className='relative'>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                className='w-full pl-6 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:font-normal placeholder:text-slate-300' 
                                type="password" 
                                placeholder='••••••••' 
                                required
                            />
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button 
                        disabled={loading}
                        className={`group mt-4 w-full py-5 px-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-xl ${
                            loading 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 active:scale-[0.98]'
                        }`} 
                        type='submit'
                    >
                        {loading ? (
                            "Verifying..."
                        ) : (
                            <>
                                Authorize Entry <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Quote/Designation */}
                <div className='mt-12 text-center'>
                    <div className='flex justify-center items-center gap-2 text-amber-600/40 mb-2'>
                        <Sparkles size={14} />
                        <div className='h-[1px] w-12 bg-amber-600/20' />
                        <Sparkles size={14} />
                    </div>
                    <p className='text-[8px] font-black uppercase tracking-[0.4em] text-slate-300'>
                        Sacred Management System v2.0
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;