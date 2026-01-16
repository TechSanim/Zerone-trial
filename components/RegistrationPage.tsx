
import React, { useState } from 'react';
import { User, BingoCell } from '../types';
import { GAME_LETTERS } from '../constants';
import { StorageService } from '../services/storage';
import { UserPlus, ArrowRight } from 'lucide-react';

interface RegistrationPageProps {
  onComplete: (user: User) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');

  const generateRandomGrid = (): BingoCell[] => {
    // We have 24 unique letters (A-Z minus Q, X).
    // To fill a 5x5 grid (25 cells) with "no free spaces", we use the 24 unique letters 
    // and pick 1 additional random letter from the pool to make it 25.
    const baseLetters = [...GAME_LETTERS];
    const extraLetter = baseLetters[Math.floor(Math.random() * baseLetters.length)];
    const finalPool = [...baseLetters, extraLetter];
    
    // Shuffle the final 25 letters
    const shuffled = finalPool.sort(() => 0.5 - Math.random());
    
    return shuffled.map(letter => ({
      letter,
      isCompleted: false
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dept) return;

    const newId = `USER-${Math.floor(Math.random() * 90000) + 10000}`;
    const newUser: User = {
      id: newId,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
      department: dept,
      registrationTime: Date.now(),
      role: 'participant',
      grid: generateRandomGrid()
    };

    const users = StorageService.getUsers();
    users.push(newUser);
    StorageService.saveUsers(users);
    
    onComplete(newUser);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-100 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Complete Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
            <select
              required
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="">Select Department</option>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Electrical and Computer Engineering">Electrical and Computer Engineering</option>
              <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
              <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
              <option value="Electronics & Instrumentation Engineering">Electronics & Instrumentation Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              By clicking join, your 5x5 Alphabet Bingo grid will be generated automatically. Every cell requires a selfie with a partner to complete.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
          >
            Start Playing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
