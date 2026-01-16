
import React, { useState, useEffect } from 'react';
import { User, GameState, BingoCell, WinPattern, WinRecord } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Trophy, CheckCircle2, UserCircle, Share2, Copy, Check } from 'lucide-react';
import BingoGrid from './BingoGrid';
import SelfieModal from './SelfieModal';
import { StorageService } from '../services/storage';
import { GRID_SIZE } from '../constants';

interface ParticipantDashboardProps {
  user: User;
  gameState: GameState;
  refreshUser: (user: User) => void;
}

const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({ user, gameState, refreshUser }) => {
  const [showQR, setShowQR] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{index: number, cell: BingoCell} | null>(null);
  const [copied, setCopied] = useState(false);

  const copyGameLink = () => {
    navigator.clipboard.writeText(window.location.origin + window.location.pathname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkWin = (grid: BingoCell[]) => {
    const wins: WinPattern[] = [];
    
    // Rows
    for (let i = 0; i < GRID_SIZE; i++) {
      let rowWin = true;
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!grid[i * GRID_SIZE + j].isCompleted) rowWin = false;
      }
      if (rowWin) wins.push('row');
    }

    // Cols
    for (let i = 0; i < GRID_SIZE; i++) {
      let colWin = true;
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!grid[j * GRID_SIZE + i].isCompleted) colWin = false;
      }
      if (colWin) wins.push('column');
    }

    // Diagonals
    let diag1 = true;
    let diag2 = true;
    for (let i = 0; i < GRID_SIZE; i++) {
      if (!grid[i * GRID_SIZE + i].isCompleted) diag1 = false;
      if (!grid[i * GRID_SIZE + (GRID_SIZE - 1 - i)].isCompleted) diag2 = false;
    }
    if (diag1 || diag2) wins.push('diagonal');

    return wins;
  };

  const handleCompleteCell = (partnerId: string, selfieUrl: string) => {
    if (!selectedCell) return;
    
    const updatedGrid = [...user.grid];
    updatedGrid[selectedCell.index] = {
      ...selectedCell.cell,
      isCompleted: true,
      partnerId,
      selfieUrl,
      completedAt: Date.now()
    };

    const newWins = checkWin(updatedGrid);
    let completedAt = user.completedAt;
    
    if (newWins.length > 0 && !user.completedAt) {
      completedAt = Date.now();
      // Record in global winners
      const winners = StorageService.getWinners();
      newWins.forEach(pattern => {
        winners.push({
          userId: user.id,
          userName: user.name,
          pattern,
          timeTaken: completedAt! - (gameState.startTime || Date.now()),
          completedAt: completedAt!
        });
      });
      StorageService.saveWinners(winners);
    }

    const updatedUser: User = { ...user, grid: updatedGrid, completedAt };
    const allUsers = StorageService.getUsers();
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    allUsers[userIndex] = updatedUser;
    StorageService.saveUsers(allUsers);
    
    refreshUser(updatedUser);
    setSelectedCell(null);
  };

  const completedCount = user.grid.filter(c => c.isCompleted).length;
  const progressPercent = Math.round((completedCount / 25) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 px-4">
      {/* User Info Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-red-600 font-bold uppercase tracking-tight text-xs">{user.department}</p>
          <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Code:</span>
            <code className="bg-slate-100 px-2 py-0.5 rounded text-zinc-900 font-mono font-bold">{user.id}</code>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white px-5 py-3 rounded-2xl hover:bg-black transition-all shadow-lg text-sm font-bold"
          >
            <QrCode className="w-4 h-4" />
            QR
          </button>
          <button 
            onClick={copyGameLink}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all shadow-lg text-sm font-bold border ${copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied' : 'Share App'}
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className={`rounded-3xl p-6 text-white shadow-xl ${gameState.isStarted ? 'bg-zinc-900' : 'bg-amber-500'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 opacity-80" />
            <span className="font-bold text-lg">Battle Station</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 opacity-80" />
            <span className="font-bold text-lg">{completedCount}/25</span>
          </div>
        </div>
        
        {!gameState.isStarted && (
          <div className="bg-white/20 p-3 rounded-xl border border-white/30 mb-4">
            <p className="text-sm font-semibold text-center">Wait for Admin to start the game!</p>
          </div>
        )}

        <div className="w-full bg-white/10 rounded-full h-3 mb-2">
          <div 
            className="bg-red-600 h-3 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-center opacity-60">
          {user.completedAt ? "Bingo Achieved! Pure Dominance." : "Connect patterns to win the grid"}
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <BingoGrid 
          grid={user.grid} 
          onCellClick={(index, cell) => {
            if (gameState.isStarted && !cell.isCompleted) {
              setSelectedCell({index, cell});
            }
          }}
          isLocked={!gameState.isStarted}
        />
      </div>

      {showQR && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 mb-2">SCAN ME</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">Let your partner scan this to verify the interaction.</p>
              <div className="bg-slate-50 p-8 rounded-[2rem] inline-block mb-8 border border-slate-100">
                <QRCodeSVG value={user.id} size={200} />
              </div>
              <div className="bg-zinc-950 py-4 rounded-2xl shadow-xl">
                <p className="text-white font-mono font-bold text-xl tracking-wider">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCell && (
        <SelfieModal 
          cell={selectedCell.cell}
          onClose={() => setSelectedCell(null)}
          onComplete={handleCompleteCell}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default ParticipantDashboard;
