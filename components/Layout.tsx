
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-zinc-950 border-b border-white/5 sticky top-0 z-50 py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-900/20 group-hover:rotate-12 transition-transform">
                Z
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tighter text-white leading-none">
                  ZERONE<span className="text-red-600">.BINGO</span>
                </h1>
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">IEEE SB CEK</span>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">{user.department}</p>
                </div>
                <button 
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="flex items-center gap-2 bg-white/5 hover:bg-red-600/10 text-zinc-400 hover:text-red-500 px-3 py-2 rounded-xl border border-white/5 hover:border-red-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-bold hidden md:block">Exit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-6 text-slate-400">
            <a href="https://instagram.com/ieeesbcekgr" className="hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-widest">Instagram</a>
            <a href="https://ieeesbcekgr.org" className="hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-widest">IEEE CEK</a>
            <a href="#" className="hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-widest">Support</a>
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            © 2024 IEEE SB CE KIDANGOOR • Zerone 7.0 Edition
          </p>
        </div>
      </footer>
    </div>
  );
};
