
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  registrationTime: number;
  gameStartTime?: number;
  role: 'admin' | 'participant';
  grid: BingoCell[];
  completedAt?: number;
}

export interface BingoCell {
  letter: string;
  isCompleted: boolean;
  partnerId?: string;
  selfieUrl?: string;
  completedAt?: number;
}

export interface GameState {
  isStarted: boolean;
  startTime: number | null;
}

export type WinPattern = 'row' | 'column' | 'diagonal';

export interface WinRecord {
  userId: string;
  userName: string;
  pattern: WinPattern;
  timeTaken: number;
  completedAt: number;
}
