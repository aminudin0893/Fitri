/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  ChevronRight, 
  Moon, 
  Star, 
  Palette,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { themes } from './types';

const QUOTES = [
  "Meskipun jarak memisahkan dan raga tak bertatap, biarlah doa yang merangkul erat. Semoga Allah senantiasa menjaga silaturahmi kita.",
  "Tiada pemberian yang paling indah selain dimaafkan, dan tiada perbuatan yang paling mulia selain memaafkan dari lubuk hati terdalam.",
  "Semoga di hari yang fitri ini, hati kita kembali suci, dipenuhi kedamaian, dan dikelilingi oleh cinta kasih keluarga tercinta."
];

const MESSAGE = "Bila ada langkah membekas lara, ada kata merangkai dusta, ada tingkah menoreh luka, di hari yang fitri ini kami memohon dibukakan pintu maaf yang sebesar-besarnya.\n\nMinal Aidin Wal Faizin, Mohon Maaf Lahir dan Batin.\nSemoga Allah SWT menerima amal ibadah kita dan mempertemukan kita dengan Ramadhan berikutnya.";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'green' | 'navy'>('green');
  const [guestName, setGuestName] = useState('');
  const [inputName, setInputName] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      const decodedName = to.replace(/-/g, ' ');
      setGuestName(decodedName);
      setInputName(decodedName);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(MESSAGE.slice(0, i));
        i++;
        if (i > MESSAGE.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % QUOTES.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    fireConfetti();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'green' ? 'navy' : 'green');
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#059669', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#059669', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const copyLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = inputName 
      ? `${baseUrl}?to=${inputName.trim().replace(/\s+/g, '-')}`
      : baseUrl;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const activeTheme = themes[theme];

  return (
    <div className={`min-h-screen ${activeTheme.dark} text-white selection:bg-yellow-500/30 transition-colors duration-1000 overflow-hidden`}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${activeTheme.mid} px-4`}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 glass-card p-6 md:p-10 rounded-3xl border border-yellow-500/30 text-center max-w-sm w-full shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-float">
                <Mail size={64} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-yellow-400 font-poppins text-xs tracking-widest uppercase mb-1">Ada Pesan Untukmu</h2>
              <h1 className="text-xl md:text-2xl font-playfair font-bold text-white mb-1">Ucapan Idul Fitri</h1>
              <p className="text-gray-300 text-xs mb-6">Dari Keluarga Besar Aminudin</p>
              
              {/* Recipient Input Section */}
              <div className="mb-6 space-y-3">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Nama Penerima (Opsional)"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-yellow-100 placeholder:text-gray-500 focus:outline-none focus:border-yellow-500/50 transition-all"
                  />
                  <button 
                    onClick={copyLink}
                    title="Salin Link untuk Dibagikan"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
                {isCopied && (
                  <p className="text-[10px] text-green-400 animate-pulse">Link berhasil disalin!</p>
                )}
              </div>

              {(inputName || guestName) && (
                <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                  <p className="text-[10px] text-gray-400 mb-0.5">Kepada Yth.</p>
                  <p className="text-base font-semibold text-yellow-300 capitalize">{inputName || guestName}</p>
                </div>
              )}
              
              <button 
                onClick={handleOpen}
                className="group relative inline-flex items-center justify-center px-8 py-2.5 font-bold text-emerald-900 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full overflow-hidden shadow-lg shadow-yellow-500/30 transition-all hover:scale-105 hover:shadow-yellow-500/50"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative flex items-center gap-2 text-sm">
                  Buka Ucapan
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={`relative min-h-screen bg-gradient-to-b ${activeTheme.mid} flex flex-col items-center justify-center py-12 px-4 overflow-y-auto`}
          >
            {/* Background Decorations */}
            <div className="absolute top-0 left-4 md:left-20 animate-swing">
              <div className="w-1 h-16 md:h-24 bg-gradient-to-b from-yellow-400/0 to-yellow-400 mx-auto" />
              <Moon className="text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" size={48} fill="currentColor" />
            </div>
            
            <div className="absolute top-0 right-4 md:right-20 animate-swing" style={{ animationDelay: '1s' }}>
              <div className="w-1 h-12 md:h-16 bg-gradient-to-b from-yellow-400/0 to-yellow-400 mx-auto" />
              <Star className="text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" size={32} fill="currentColor" />
            </div>

            {/* Main Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10 glass-card w-full max-w-2xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-yellow-500/20 text-center my-8"
            >
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16 md:w-20 md:h-20 text-yellow-400 animate-float">
                  <Moon size={80} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                </div>
              </div>

              <div className="inline-block px-4 py-1 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-300 text-xs md:text-sm font-medium tracking-widest mb-6">
                1 Syawal 1447 H
              </div>

              <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                Selamat Hari Raya <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200">
                  Idul Fitri
                </span>
              </h1>

              <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto my-6" />

              <div className="font-amiri text-2xl md:text-4xl text-yellow-400 mb-4 leading-loose" dir="rtl">
                تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ صِيَامَنَا وَصِيَامَكُمْ
              </div>
              <p className="text-yellow-200/80 italic text-xs md:text-sm mb-8">
                "Taqabbalallahu minna wa minkum shiyamana wa shiyamakum"
              </p>

              <div className="text-gray-200 leading-relaxed text-sm md:text-base font-light mb-10 max-w-lg mx-auto min-h-[140px] whitespace-pre-line">
                {typedText}
                <span className="inline-block w-1 h-5 bg-yellow-400 ml-1 animate-pulse" />
              </div>

              {/* Slider */}
              <div className="mt-8 mb-10 border-t border-white/10 pt-8">
                <h3 className="font-playfair text-xl md:text-2xl text-yellow-300 mb-6 italic">Untaian Doa & Harapan</h3>
                <div className="relative w-full min-h-[120px] bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-gray-200 italic font-playfair text-lg leading-relaxed"
                    >
                      "{QUOTES[currentSlide]}"
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    {QUOTES.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-yellow-400 w-4 shadow-[0_0_5px_#fbbf24]' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-300 mb-2">Salam Hangat Dari,</p>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-yellow-400 tracking-wide drop-shadow-md">
                  Keluarga Besar Aminudin
                </h2>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="fixed bottom-6 right-6 z-50">
              <button 
                onClick={toggleTheme}
                className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-400 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500/40 transition-colors"
                title="Ganti Tema"
              >
                <Palette size={20} />
              </button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
