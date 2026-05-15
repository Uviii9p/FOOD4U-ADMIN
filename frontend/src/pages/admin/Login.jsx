import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { User, Lock, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' or 'vendor'
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password, role);
      toast.success(`Welcome back, ${user.name}!`);
      if (role === 'vendor') {
        navigate('/admin/items');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/20 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-blue-600 rounded-[2rem] mb-6 shadow-2xl shadow-accent/40 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Access Hub</h1>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">Secure Gateway for Sujal Food Shop</p>
          </div>

          {/* Role Switcher */}
          <div className="relative flex bg-slate-800/40 p-1.5 rounded-[1.5rem] mb-10 border border-white/5">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[1.2rem] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_10px_20px_rgba(255,255,255,0.1)] ${
                role === 'admin' ? 'left-1.5' : 'left-[50%]'
              }`}
            ></div>
            <button 
              onClick={() => setRole('admin')}
              className={`relative z-10 flex-1 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-500 ${role === 'admin' ? 'text-slate-900' : 'text-slate-500'}`}
            >
              Administrator
            </button>
            <button 
              onClick={() => setRole('vendor')}
              className={`relative z-10 flex-1 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-500 ${role === 'vendor' ? 'text-slate-900' : 'text-slate-500'}`}
            >
              Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors duration-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/30 border border-white/5 text-white pl-14 pr-6 py-5 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/50 transition-all placeholder:text-slate-600 font-medium"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors duration-300" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/30 border border-white/5 text-white pl-14 pr-6 py-5 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/50 transition-all placeholder:text-slate-600"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full group relative bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-xs py-5 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center">
                Initialize Session
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center px-2">
             <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">Emergency Reset</button>
             <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">Support Node</button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
            SYSTEM v4.0.2 // SECURE CONNECTION ESTABLISHED
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
