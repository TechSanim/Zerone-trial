
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, GameState } from './types';
import { StorageService } from './services/storage';
import LandingPage from './components/LandingPage';
import RegistrationPage from './components/RegistrationPage';
import ParticipantDashboard from './components/ParticipantDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>(StorageService.getGameState());

  useEffect(() => {
    // Check if user is already "logged in" from storage
    const activeUserId = localStorage.getItem('active_user_id');
    if (activeUserId) {
      const users = StorageService.getUsers();
      const user = users.find(u => u.id === activeUserId);
      if (user) setCurrentUser(user);
    }
    
    // Polling simulation for game state updates
    const interval = setInterval(() => {
      setGameState(StorageService.getGameState());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('active_user_id', user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('active_user_id');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout user={currentUser} onLogout={handleLogout} />}>
          <Route index element={
            currentUser ? (
              currentUser.role === 'admin' ? 
              <Navigate to="/admin" replace /> : 
              <Navigate to="/dashboard" replace />
            ) : <LandingPage onLogin={handleLogin} />
          } />
          
          <Route path="/register" element={
            currentUser ? <Navigate to="/dashboard" replace /> : <RegistrationPage onComplete={handleLogin} />
          } />
          
          <Route path="/dashboard" element={
            currentUser ? <ParticipantDashboard user={currentUser} gameState={gameState} refreshUser={handleLogin} /> : <Navigate to="/" replace />
          } />
          
          <Route path="/admin" element={
            currentUser?.role === 'admin' ? <AdminDashboard gameState={gameState} setGameState={setGameState} /> : <Navigate to="/" replace />
          } />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
