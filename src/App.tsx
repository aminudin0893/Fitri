/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  ChevronRight, 
  Moon, 
  Star, 
  Palette,
  Copy,
  Check,
  Sparkles,
  Send,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { themes } from './types';

const QUOTES = [
  "Meskipun jarak memisahkan dan raga tak bertatap, biarlah doa yang merangkul erat. Semoga Allah senantiasa menjaga silaturahmi kita.",
  "Tiada pemberian yang paling indah selain dimaafkan, dan tiada perbuatan yang paling mulia selain memaafkan dari lubuk hati terdalam.",
  "Semoga di hari yang fitri ini, hati kita kembali suci, dipenuhi kedamaian, dan dikelilingi oleh cinta kasih keluarga tercinta."
];

const MESSAGE = "Bila ada langkah membekas lara, ada kata merangkai dusta, ada tingkah menoreh luka, di hari yang fitri ini kami memohon dibukakan pintu maaf yang sebesar-besarnya.\n\nMinal Aidin Wal Faizin, Mohon Maaf Lahir dan Batin.\nSemoga Allah SWT menerima amal ibadah kita dan mempertemukan kita dengan Ramadhan berikutnya.";

const StarryBackground = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration,
            boxShadow: '0 0 5px white',
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'green' | 'navy' | 'romantic'>('green');
  const [guestName, setGuestName] = useState('');
  const [category, setCategory] = useState<'Sahabat' | 'Saudara' | 'Keluarga' | ''>('Sahabat');
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isRecipient, setIsRecipient] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const cat = params.get('cat');
    if (cat) setCategory(cat as any);
    if (to) {
      const decodedName = to.replace(/-/g, ' ');
      setGuestName(decodedName);
      setInputName(decodedName);
      setIsRecipient(true);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      let i = 0;
      const personalizedMessage = guestName 
        ? (category ? `Untuk ${category}ku, ${guestName}.\n\n${MESSAGE}` : `Untuk ${guestName}.\n\n${MESSAGE}`)
        : MESSAGE;
        
      const interval = setInterval(() => {
        setTypedText(personalizedMessage.slice(0, i));
        i++;
        if (i > personalizedMessage.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isOpen, guestName]);

  useEffect(() => {
    if (isOpen && isRecipient && guestName) {
      // Simulasi pengiriman notifikasi baca ke nomor 6285227853488
      // Menggunakan fetch ke layanan webhook atau API eksternal
      const notifySender = async () => {
        try {
          // Contoh penggunaan webhook (Anda bisa mengganti URL ini dengan API gateway WhatsApp Anda)
          // await fetch('https://your-api-gateway.com/notify', {
          //   method: 'POST',
          //   body: JSON.stringify({ to: '6285227853488', message: `Pesan kamu dibaca oleh ${guestName}` })
          // });
          console.log(`Notifikasi otomatis dikirim ke 6285227853488: Pesan dibaca oleh ${guestName}`);
        } catch (e) {
          console.error("Gagal mengirim notifikasi otomatis", e);
        }
      };
      notifySender();
    }
  }, [isOpen, isRecipient, guestName]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % QUOTES.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.play().catch(err => console.log("Autoplay blocked or failed:", err));
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    fireConfetti();
    
    // Improved audio trigger for mobile/Vercel
    if (audioRef.current) {
      audioRef.current.muted = false;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
          // Retry on next interaction if needed
          const retryPlay = () => {
            audioRef.current?.play();
            window.removeEventListener('click', retryPlay);
          };
          window.addEventListener('click', retryPlay);
        });
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'green') return 'navy';
      if (prev === 'navy') return 'romantic';
      return 'green';
    });
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

  const sendWhatsApp = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = inputName 
      ? `${baseUrl}?to=${inputName.trim().replace(/\s+/g, '-')}&cat=${category}`
      : `${baseUrl}?cat=${category}`;
    
    const recipient = inputName ? inputName.trim() : (category || 'Sahabat');
    const greeting = category ? `${recipient}` : (inputName ? inputName.trim() : recipient);
    const message = `Assalamu'alaikum ${greeting},\n\nKami dari Keluarga Besar Aminudin ingin menyampaikan ucapan terindah di hari yang fitri ini. Mohon maaf lahir dan batin atas segala khilaf.\n\nSilakan buka pesan spesial untukmu di sini:\n${shareUrl}`;
    const encodedMessage = encodeURIComponent(message);
    
    let cleanPhone = inputPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }

    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
  };

  const copyLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = inputName 
      ? `${baseUrl}?to=${inputName.trim().replace(/\s+/g, '-')}&cat=${category}`
      : `${baseUrl}?cat=${category}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const activeTheme = themes[theme];

  return (
    <div className={`min-h-screen ${activeTheme.dark} text-white selection:bg-yellow-500/30 transition-colors duration-1000 overflow-hidden relative`}>
      <StarryBackground />
      
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/10/18/audio_31c2996653.mp3"
        loop
        preload="auto"
        crossOrigin="anonymous"
      />
      
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: '-100%', opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${activeTheme.mid} px-4`}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative z-10 glass-card p-8 md:p-12 rounded-[3rem] border border-white/10 text-center max-w-sm w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] shimmer"
            >
              <div className="relative mb-10">
                <div className="w-28 h-28 mx-auto bg-gradient-to-tr from-yellow-500/20 to-yellow-300/40 rounded-full flex items-center justify-center animate-float romantic-glow">
                  <Mail size={56} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" strokeWidth={1} />
                </div>
                <div className="absolute -top-2 -right-2 animate-twinkle">
                  <Sparkles size={28} className="text-yellow-300" />
                </div>
              </div>
              
              <h2 className="text-yellow-400 font-poppins text-xs tracking-[0.4em] uppercase mb-4 font-bold opacity-90">Pesan Eksklusif Untukmu</h2>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-3 tracking-tight">Ucapan <span className="text-gradient">Idul Fitri</span></h1>
              <p className="text-gray-400 text-sm mb-10 font-light tracking-widest">Keluarga Besar Aminudin</p>
              
              {!isRecipient && (
                <div className="mb-8 space-y-4">
                  <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                    {(['Sahabat', 'Saudara', 'Keluarga', ''] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`flex-1 min-w-[80px] py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                          category === cat 
                            ? 'bg-yellow-400 text-emerald-950 shadow-lg' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {cat || 'Tanpa Kategori'}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nama Penerima (Opsional)"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      className="w-full glass-input rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none font-medium"
                    />
                    <div className="relative group">
                      <input
                        type="tel"
                        placeholder="Nomor WA (Contoh: 0812...)"
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)}
                        className="w-full glass-input rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none font-medium"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button 
                          onClick={copyLink}
                          className="p-2 text-gray-500 hover:text-yellow-400 transition-all active:scale-90"
                          title="Salin Link"
                        >
                          {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                        </button>
                        <button 
                          onClick={sendWhatsApp}
                          className="p-2 text-emerald-400 hover:text-emerald-300 transition-all active:scale-90 bg-emerald-500/10 rounded-xl"
                          title="Kirim via WhatsApp"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {isCopied && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-green-400 font-medium"
                    >
                      Link berhasil disalin!
                    </motion.p>
                  )}
                </div>
              )}

              {(inputName || guestName) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner backdrop-blur-sm"
                >
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Kepada Yth.</p>
                  <p className="text-xl font-playfair font-bold text-yellow-300 capitalize tracking-wide">{inputName || guestName}</p>
                </motion.div>
              )}
              
              <button 
                onClick={handleOpen}
                className="group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold text-emerald-950 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(251,191,36,0.3)] transition-all hover:scale-[1.02] active:scale-95 shimmer"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-3 text-base uppercase tracking-wider">
                  Buka Ucapan
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`relative min-h-screen bg-gradient-to-b ${activeTheme.mid} flex flex-col items-center justify-center py-16 px-4 overflow-y-auto`}
          >
            {/* Immersive Decorations */}
            <div className="absolute top-0 left-4 md:left-24 animate-swing">
              <div className="w-[2px] h-24 md:h-40 bg-gradient-to-b from-yellow-400/0 via-yellow-400/50 to-yellow-400 mx-auto" />
              <div className="p-3 bg-yellow-500/10 rounded-full backdrop-blur-sm border border-yellow-500/20 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                <Moon className="text-yellow-400" size={40} fill="currentColor" />
              </div>
            </div>
            
            <div className="absolute top-12 right-4 md:right-24 animate-swing" style={{ animationDelay: '1.5s' }}>
              <div className="w-[2px] h-16 md:h-32 bg-gradient-to-b from-yellow-400/0 via-yellow-400/50 to-yellow-400 mx-auto" />
              <div className="p-2 bg-yellow-500/10 rounded-full backdrop-blur-sm border border-yellow-500/20 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                <Star className="text-yellow-400" size={24} fill="currentColor" />
              </div>
            </div>

            {/* Main Content Card */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative z-10 glass-card w-full max-w-2xl rounded-[4rem] p-10 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 text-center my-12 shimmer"
            >
              <div className="flex justify-center mb-10">
                <motion.div 
                  animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 0.95, 1] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="relative"
                >
                  <Moon size={100} fill="currentColor" className="text-yellow-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.7)] romantic-glow" />
                  <div className="absolute -top-6 -right-6 animate-twinkle">
                    <Sparkles size={40} className="text-yellow-300" />
                  </div>
                </motion.div>
              </div>

              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-300 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
                <Star size={14} fill="currentColor" />
                1 Syawal 1447 H
                <Star size={14} fill="currentColor" />
              </div>

              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                Selamat Hari Raya <br /> 
                <span className="text-gradient">Idul Fitri</span>
              </h1>

              <div className="flex items-center justify-center gap-4 my-8">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-twinkle" />
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-500/50" />
              </div>

              <div className="font-amiri text-3xl md:text-5xl text-yellow-400 mb-6 leading-loose drop-shadow-lg" dir="rtl">
                تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ صِيَامَنَا وَصِيَامَكُمْ
              </div>
              <p className="text-yellow-200/60 italic text-sm md:text-base mb-10 font-light tracking-wide">
                "Taqabbalallahu minna wa minkum shiyamana wa shiyamakum"
              </p>

              <div className="text-white leading-relaxed text-base md:text-lg font-medium mb-12 max-w-lg mx-auto min-h-[160px] whitespace-pre-line relative font-poppins">
                <span className="relative z-10">{typedText}</span>
                <span className="inline-block w-[2px] h-6 bg-yellow-400 ml-1 animate-pulse align-middle" />
                <div className="absolute -top-4 -left-4 text-white/10 font-playfair text-8xl pointer-events-none">"</div>
              </div>

              {/* Modern Slider */}
              <div className="mt-12 mb-12 border-t border-white/5 pt-12">
                <h3 className="font-playfair text-2xl md:text-3xl text-yellow-300 mb-8 italic tracking-wide">Untaian Doa & Harapan</h3>
                <div className="relative w-full min-h-[140px] bg-white/[0.02] backdrop-blur-md rounded-[2rem] p-8 border border-white/5 overflow-hidden shadow-inner group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6 }}
                      className="text-gray-200 font-poppins text-base md:text-lg leading-relaxed tracking-wide"
                    >
                      "{QUOTES[currentSlide]}"
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {QUOTES.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-yellow-400 w-8 shadow-[0_0_10px_#fbbf24]' : 'bg-white/10 w-2 hover:bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-[0.3em] mb-3 font-bold">Salam Hangat Dari,</p>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gradient tracking-wider">
                  Keluarga Besar Aminudin
                </h2>
              </div>
            </motion.div>

            {/* Floating Control */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
              <button 
                onClick={toggleTheme}
                className="bg-white/5 backdrop-blur-xl border border-white/10 text-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white/10 hover:scale-110 active:scale-90 transition-all duration-300 group"
                title="Ganti Tema"
              >
                <Palette size={24} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
