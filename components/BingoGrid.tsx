
import React from 'react';
import { BingoCell } from '../types';
import { Check } from 'lucide-react';

interface BingoGridProps {
  grid: BingoCell[];
  onCellClick: (index: number, cell: BingoCell) => void;
  isLocked: boolean;
}

const BingoGrid: React.FC<BingoGridProps> = ({ grid, onCellClick, isLocked }) => {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4 aspect-square">
      {grid.map((cell, index) => (
        <button
          key={index}
          disabled={isLocked || cell.isCompleted}
          onClick={() => onCellClick(index, cell)}
          className={`
            relative flex items-center justify-center aspect-square rounded-xl sm:rounded-2xl text-xl sm:text-3xl font-black transition-all
            ${cell.isCompleted 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 scale-95' 
              : isLocked 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 active:scale-90 hover:shadow-md'
            }
          `}
        >
          {cell.letter}
          {cell.isCompleted && (
            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 stroke-[4px]" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default BingoGrid;
