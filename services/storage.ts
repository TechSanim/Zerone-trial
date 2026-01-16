
import { User, GameState, WinRecord } from '../types';

const USERS_KEY = 'bingo_users';
const GAME_STATE_KEY = 'bingo_game_state';
const WINNERS_KEY = 'bingo_winners';

export const StorageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getGameState: (): GameState => {
    const data = localStorage.getItem(GAME_STATE_KEY);
    return data ? JSON.parse(data) : { isStarted: false, startTime: null };
  },

  saveGameState: (state: GameState) => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  },

  getWinners: (): WinRecord[] => {
    const data = localStorage.getItem(WINNERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveWinners: (winners: WinRecord[]) => {
    localStorage.setItem(WINNERS_KEY, JSON.stringify(winners));
  },

  clearAll: () => {
    localStorage.clear();
  }
};
