
import React, { useState, useMemo } from 'react';
import { GameState, User, WinRecord, BingoCell } from '../types';
import { StorageService } from '../services/storage';
import { 
  Users, 
  Play, 
  Square, 
  Download, 
  Trophy, 
  Clock, 
  BarChart3, 
  CheckCircle2,
  Trash2,
  Search,
  Image as ImageIcon,
  Grid,
  X,
  User as UserIcon,
  Share2,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ gameState, setGameState }) => {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [winners, setWinners] = useState<WinRecord[]>(StorageService.getWinners());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'participants' | 'gallery'>('participants');
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const activeParticipants = users.filter(u => u.role === 'participant');
    const totalCellsCompleted = activeParticipants.reduce((acc, u) => acc + u.grid.filter(c => c.isCompleted).length, 0);
    const completedBingo = activeParticipants.filter(u => u.completedAt).length;
    
    return {
      total: activeParticipants.length,
      completed: completedBingo,
      avgProgress: activeParticipants.length ? Math.round((totalCellsCompleted / (activeParticipants.length * 25)) * 100) : 0
    };
  }, [users]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.origin + window.location.pathname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allSelfies = useMemo(() => {
    const photos: { url: string, letter: string, owner: string, partner: string, time: number }[] = [];
    users.filter(u => u.role === 'participant').forEach(u => {
      u.grid.forEach(cell => {
        if (cell.isCompleted && cell.selfieUrl && cell.partnerId !== 'SYSTEM') {
          photos.push({
            url: cell.selfieUrl,
            letter: cell.letter,
            owner: u.name,
            partner: cell.partnerId || 'Unknown',
            time: cell.completedAt || 0
          });
        }
      });
    });
    return photos.sort((a, b) => b.time - a.time);
  }, [users]);

  const toggleGame = () => {
    const newState = {
      isStarted: !gameState.isStarted,
      startTime: !gameState.isStarted ? Date.now() : gameState.startTime
    };
    StorageService.saveGameState(newState);
    setGameState(newState);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to delete all user data? This cannot be undone.')) {
      StorageService.clearAll();
      window.location.reload();
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'ID', 'Department', 'Registration Time', 'Progress', 'Bingo Time'];
    const rows = users
      .filter(u => u.role === 'participant')
      .map(u => {
        const progress = u.grid.filter(c => c.isCompleted).length;
        const bingoTime = u.completedAt && gameState.startTime 
          ? ((u.completedAt - gameState.startTime) / 1000).toFixed(1) + 's' 
          : 'N/A';
        return [
          u.name,
          u.id,
          u.department,
          new Date(u.registrationTime).toLocaleString(),
          `${progress}/25`,
          bingoTime
        ].join(',');
      });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bingo_results_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users
    .filter(u => u.role === 'participant')
    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Mission Control</h2>
          <p className="text-slate-500 font-medium">Zerone 7.0 Bingo • Administrative Dashboard</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <button
            onClick={toggleGame}
            className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl ${
              gameState.isStarted 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            {gameState.isStarted ? (
              <><Square className="w-5 h-5 fill-white" /> Pause Game</>
            ) : (
              <><Play className="w-5 h-5 fill-white" /> Launch Game</>
            )}
          </button>
          <button
            onClick={copyInviteLink}
            className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg border ${copied ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            {copied ? 'Link Copied' : 'Invite Participants'}
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-zinc-950 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Players" value={stats.total} color="bg-zinc-900" />
        <StatCard icon={<Trophy className="w-5 h-5" />} label="Bingo Winners" value={stats.completed} color="bg-red-600" />
        <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Avg Progress" value={`${stats.avgProgress}%`} color="bg-zinc-900" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Game Status" value={gameState.isStarted ? 'Live' : 'Stopped'} color={gameState.isStarted ? 'bg-emerald-500' : 'bg-red-500'} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button 
          onClick={() => setActiveTab('participants')}
          className={`pb-4 px-2 font-bold transition-all border-b-2 text-sm uppercase tracking-widest ${activeTab === 'participants' ? 'text-red-600 border-red-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          Leaderboard
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`pb-4 px-2 font-bold transition-all border-b-2 text-sm uppercase tracking-widest ${activeTab === 'gallery' ? 'text-red-600 border-red-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          Selfie Logs ({allSelfies.length})
        </button>
      </div>

      {activeTab === 'participants' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Active Participants</h3>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Find by name or ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-6 py-5">Participant Details</th>
                    <th className="px-6 py-5">Grid Completion</th>
                    <th className="px-6 py-5 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => {
                    const progress = u.grid.filter(c => c.isCompleted).length;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 group-hover:text-red-600 transition-colors">{u.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{u.id} • {u.department}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden max-w-[140px]">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${progress === 25 ? 'bg-emerald-500' : 'bg-red-600'}`} 
                                style={{ width: `${(progress/25)*100}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-slate-600">{progress}/25</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => setInspectingUser(u)}
                            className="p-2.5 text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest border border-slate-200"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Audit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-red-600" />
              TOP PERFORMERS
            </h3>
            <div className="space-y-5">
              {winners.length === 0 ? (
                <div className="text-center py-12 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Bingo Claims Yet</p>
                </div>
              ) : (
                winners.slice(0, 8).map((win, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-red-200 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900 leading-tight">{win.userName}</p>
                      <p className="text-[10px] uppercase font-black text-red-600 tracking-widest">{win.pattern} win</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Time Taken</p>
                      <p className="text-xs font-bold text-slate-700">{(win.timeTaken/60000).toFixed(1)}m</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Collective Gallery View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {allSelfies.map((photo, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md group hover:scale-105 transition-all cursor-pointer">
              <div className="aspect-square relative">
                <img src={photo.url} className="w-full h-full object-cover" alt="Selfie" />
                <div className="absolute top-3 right-3 bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shadow-xl border border-white/20">
                  {photo.letter}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">Snap Time</p>
                   <p className="text-xs font-bold text-white">{new Date(photo.time).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 truncate">{photo.owner}</p>
                <p className="text-xs font-bold text-slate-800 truncate">Partner: {photo.partner}</p>
              </div>
            </div>
          ))}
          {allSelfies.length === 0 && (
            <div className="col-span-full py-32 text-center text-slate-300">
              <ImageIcon className="w-20 h-20 mx-auto mb-6 opacity-10" />
              <p className="text-sm font-black uppercase tracking-[0.3em]">Vault is empty</p>
            </div>
          )}
        </div>
      )}

      {/* Audit Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl relative my-8 shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300">
            <button onClick={() => setInspectingUser(null)} className="absolute right-8 top-8 p-3 text-slate-400 hover:text-red-600 bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-10">
              <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Audit Report</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{inspectingUser.name}</h3>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{inspectingUser.department} • {inspectingUser.id}</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {inspectingUser.grid.map((cell, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-square rounded-2xl border-2 relative overflow-hidden flex items-center justify-center transition-all ${
                    cell.isCompleted ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  {cell.selfieUrl ? (
                    <img src={cell.selfieUrl} className="w-full h-full object-cover" alt={cell.letter} />
                  ) : (
                    <span className={`text-2xl font-black ${cell.isCompleted ? 'text-red-600' : 'text-slate-200'}`}>
                      {cell.letter}
                    </span>
                  )}
                  {cell.isCompleted && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] shadow-lg">
                      {cell.letter}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                  <p className={`text-sm font-bold ${inspectingUser.completedAt ? 'text-emerald-600' : 'text-red-600'}`}>
                    {inspectingUser.completedAt ? 'BINGO' : 'IN-PROGRESS'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setInspectingUser(null)}
                className="bg-zinc-950 hover:bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl"
              >
                End Audit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 flex justify-center">
        <button 
          onClick={clearData}
          className="flex items-center gap-3 py-4 px-8 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black uppercase tracking-[0.2em] text-[10px] border border-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Purge Event Database
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
