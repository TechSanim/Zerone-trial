
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ShieldCheck, Camera, Instagram, Facebook, Twitter, Globe } from 'lucide-react';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const simulateGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/register');
      setIsLoading(false);
    }, 1500);
  };

  const loginAsAdmin = () => {
    const adminUser: User = {
      id: 'ADMIN-001',
      name: 'System Admin',
      email: 'admin@ieee.org',
      department: 'Management',
      registrationTime: Date.now(),
      role: 'admin',
      grid: []
    };
    onLogin(adminUser);
    navigate('/admin');
  };

  const socialLinks = {
    instagram: "https://www.instagram.com/ieeesbcekgr/",
    facebook: "https://www.facebook.com/ieeesbcekgr/",
    twitter: "https://twitter.com/ieeesbcekgr/",
    website: "https://ieee.org" // Placeholder, but professional
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
      {/* 
          Blurred Wallpaper Layer 
          Recreating the Zerone 7.0 visual identity
      */}
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
            <span className="text-red-500 font-bold tracking-[0.4em] uppercase mb-4 text-base">Exclusive for First Years</span>
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

      {/* Pop Screen Overlay (Glassmorphism Modal) */}
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
              Unlock the grid and start your Zerone journey. Capture selfies with new friends to win!
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {/* Dark Shaded Google Button */}
            <button
              onClick={simulateGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 bg-zinc-950 hover:bg-black text-white py-5 px-8 rounded-2xl shadow-2xl transition-all font-bold disabled:opacity-50 active:scale-[0.97] border border-white/10 group overflow-hidden relative"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <div className="bg-white p-1 rounded-sm shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <span className="text-lg tracking-tight">Continue with Gmail</span>
                </>
              )}
            </button>

            {/* Admin Entry Link */}
            <button 
              onClick={loginAsAdmin}
              className="w-full py-2 text-xs font-black text-white/20 hover:text-red-500 flex items-center justify-center gap-2 transition-all uppercase tracking-[0.3em]"
            >
              <ShieldCheck className="w-4 h-4" />
              Staff Entry Only
            </button>
          </div>
        </div>
      </div>

      {/* Social Footer Bar with actual links */}
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
