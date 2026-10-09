import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SudarshanChakraCanvas from '../components/SudarshanChakraCanvas';
import SudarshanLogo from '../components/SudarshanLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* 3D Sun-Blazing Sudarshan Chakra Canvas Background */}
      <SudarshanChakraCanvas opacity={0.85} speed={1.5} showChakra={true} />

      {/* Balanced Premium Glassmorphism Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md p-8 rounded-3xl z-10 text-white relative bg-slate-900/60 backdrop-blur-xl border border-amber-400/50 shadow-[0_0_60px_rgba(245,158,11,0.35)] hover:shadow-[0_0_80px_rgba(245,158,11,0.5)] transition-all duration-500"
      >
        <div className="flex justify-center mb-5">
          <SudarshanLogo size="xl" />
        </div>
        
        <h2 className="text-3xl font-black text-center mb-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
          SUDARSHAN AI
        </h2>
        <p className="text-center text-slate-300 font-semibold mb-7 text-xs tracking-wider uppercase">
          Sign in to access your intelligent conversations
        </p>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl mb-4 text-xs font-semibold text-center backdrop-blur-md">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-slate-950/70 border border-slate-700/80 hover:border-amber-400/60 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/60 transition shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-slate-950/70 border border-slate-700/80 hover:border-amber-400/60 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/60 transition shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs mt-2 text-slate-300 font-semibold">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-slate-700 bg-slate-900 accent-amber-500" /> Remember me
            </label>
            <a href="#" className="text-amber-400 hover:text-amber-300 hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 py-3.5 rounded-xl font-bold hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-5 text-sm text-white shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Authenticating..." : "Login to Sudarshan AI"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-xs font-semibold">
          Don't have an account? <Link to="/register" className="text-amber-400 font-bold hover:text-amber-300 hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
}
