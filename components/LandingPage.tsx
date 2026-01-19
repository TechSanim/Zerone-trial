
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ShieldCheck, Camera, Instagram, Facebook, Twitter, Globe, Lock, X, LogIn } from 'lucide-react';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/register');
      setIsLoading(false);
    }, 1200);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Specific credentials as requested by user: zerone7.0 / gamelaunch2026
    if (adminUser === 'zerone7.0' && adminPass === 'gamelaunch2026') {
      const adminUserData: User = {
        id: 'ADMIN-MASTER',
        name: 'Zerone Admin',
        email: 'admin@ieee.org',
        department: 'Event Lead',
        registrationTime: Date.now(),
        role: 'admin',
        grid: []
      };
      onLogin(adminUserData);
      navigate('/admin');
    } else {
      setAdminError('Access Denied. Incorrect credentials.');
    }
  };

  const socialLinks = {
    instagram: "https://www.instagram.com/ieeesbcekgr/",
    facebook: "https://www.facebook.com/ieeesbcekgr/",
    twitter: "https://twitter.com/ieeesbcekgr/",
    website: "https://ieee.org"
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 blur-[10px] scale-110 opacity-60 pointer-events-none select-none">
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(220,38,38,0.7)_0%,_transparent_60%)]"></div>
        
        <div className="relative w-full h-full flex flex-col p-12 text-white">
          <div className="flex items-start gap-4 mb-20">
            <div className="w-14 h-14 border-2 border-white rotate-45 flex items-center justify-center font-bold text-xl">I</div>
            <div className="flex flex-col">
              <span className="text-5xl font-black tracking-tighter leading-none">IEEE|</span>
              <span className="text-sm font-bold tracking-[0.25em] uppercase opacity-90 text-zinc-400">CE KIDANGOOR STUDENT BRANCH</span>
            </div>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center text-center -mt-20">
            <span className="text-red-500 font-bold tracking-[0.4em] uppercase mb-4 text-base">First Year Induction Special</span>
            <h1 className="text-[14vw] font-black italic tracking-tighter leading-none mb-4 drop-shadow-2xl">ZERONE 7.0</h1>
            
            <div className="space-y-1.5 flex flex-col items-center opacity-80">
              <div className="w-72 h-1.5 bg-white"></div>
              <div className="w-56 h-1.5 bg-white"></div>
              <div className="w-36 h-1.5 bg-white"></div>
            </div>
            
            <span className="text-red-500 font-black text-xl tracking-[0.3em] mt-10 uppercase drop-shadow-lg">LETS START FROM ZERO</span>
          </div>
        </div>
      </div>

      {/* Main UI */}
      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in duration-1000">
        <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.8)] text-center space-y-10">
          
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-inner">
              <Camera className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              WELCOME TO<br/>
              <span className="text-red-600 drop-shadow-[0_4px_10px_rgba(220,38,38,0.3)]">SELFIE BINGO</span>
            </h2>
            
            <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)]"></div>
            
            <p className="text-white/80 text-sm font-semibold tracking-wide leading-relaxed px-4">
              Unlock the grid, meet new friends, and capture memories. Your journey begins here.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 bg-zinc-950 hover:bg-black text-white py-5 px-8 rounded-2xl shadow-2xl transition-all font-bold disabled:opacity-50 active:scale-[0.97] border border-white/10 group overflow-hidden relative"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="text-lg tracking-tight uppercase">Continue</span>
              )}
            </button>

            <button 
              onClick={() => setShowAdminModal(true)}
              className="w-full py-2 text-xs font-black text-white/20 hover:text-red-500 flex items-center justify-center gap-2 transition-all uppercase tracking-[0.3em]"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Admin Auth Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute right-6 top-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">System Access</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Authorized Personnel Only</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Admin ID</label>
                <input 
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-red-600 transition-all text-sm font-bold"
                  placeholder="Enter Username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-red-600 transition-all text-sm font-bold"
                  placeholder="Enter Password"
                />
              </div>

              {adminError && (
                <p className="text-red-500 text-[10px] font-black uppercase text-center animate-pulse">
                  {adminError}
                </p>
              )}

              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-red-900/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Launch Console
                <LogIn className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Social Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-[320px] px-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-3 px-6 flex items-center justify-between shadow-xl">
           <div className="flex gap-4">
             <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-pink-500 transition-colors">
               <Instagram className="w-5 h-5" />
             </a>
             <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-blue-500 transition-colors">
               <Facebook className="w-5 h-5" />
             </a>
             <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-sky-400 transition-colors">
               <Twitter className="w-5 h-5" />
             </a>
             <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-red-500 transition-colors">
               <Globe className="w-5 h-5" />
             </a>
           </div>
           <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
           <a 
            href={socialLinks.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] text-white/40 font-black tracking-widest uppercase hover:text-white transition-colors"
           >
            ieeesbcekgr
           </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
