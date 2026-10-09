import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Globe, Shield, Mic, Volume2 } from 'lucide-react';
import SudarshanChakraCanvas from '../components/SudarshanChakraCanvas';
import SudarshanLogo from '../components/SudarshanLogo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* 3D Sun-Blazing Sudarshan Chakra Canvas Background */}
      <SudarshanChakraCanvas opacity={0.85} speed={1.2} showChakra={true} />

      <nav className="flex justify-between items-center p-6 lg:px-12 relative z-10 bg-slate-900/75 backdrop-blur-2xl border border-amber-500/30 rounded-3xl mx-4 mt-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <SudarshanLogo size="md" />
          <span className="text-xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            SUDARSHAN AI
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="px-5 py-2.5 rounded-full hover:bg-slate-800 text-sm font-semibold transition text-slate-300">Login</Link>
          <Link to="/register" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] transition flex items-center gap-2 transform hover:scale-105">
            Start Free <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-20 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles size={14} /> Next-Gen Divine Intelligence & Voice Processing
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Knowledge Without <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">Limits.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience ultra-fast, accurate, multi-lingual AI with real-time speech input & voice output, inspired by the divine brilliance of Lord Sri Krishna's Sudarshan Chakra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 font-bold text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 transform hover:scale-105 text-white">
              Start Chatting Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-700 hover:bg-slate-800 transition font-bold text-lg flex items-center justify-center text-slate-200">
              Sign In to Your Account
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl text-left hover:border-amber-500 transition duration-300 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Sub-Second AI Speed</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Powered by low-latency Gemini Flash engine delivering accurate answers in ~1.4 seconds.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl text-left hover:border-amber-500 transition duration-300 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Voice Input & Speech</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Speak questions directly into the microphone and hear responses read aloud instantly.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl text-left hover:border-amber-500 transition duration-300 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Private User Isolation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Your conversations are completely isolated and stored under your secure account only.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
