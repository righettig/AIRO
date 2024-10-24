'use client';

import { useEffect, useState } from 'react';
import { logout, refreshToken } from '@/app/common/auth.service';

import Login from './features/login/login';
import Sidebar from './features/layout/sidebar';
import Events from './features/events/components/events';
import Bots from './features/bots/components/bots';
import Maps from './features/maps/components/maps';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedView, setSelectedView] = useState<'events' | 'bots' | 'maps'>('events');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    } catch (err) {
      setError('Logout failed.');
    }
  };

  const handleSelectView = (view: 'events' | 'bots' | 'maps') => {
    setSelectedView(view);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const checkToken = async () => {
        try {
          const response = await refreshToken();
          localStorage.setItem('token', response.token);
        } catch {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      };

      const intervalId = setInterval(checkToken, 15 * 60 * 1000); // Check every 15 minutes
      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        onLogout={handleLogout}
        onSelect={handleSelectView}
        onToggle={handleSidebarToggle}
        isCollapsed={isSidebarCollapsed}
      />
      <div
        style={{
          marginLeft: isSidebarCollapsed ? '0px' : '180px',
          padding: '20px 20px 20px 40px',
          width: `calc(100% - ${isSidebarCollapsed ? '60px' : '220px'})`,
          transition: 'width 0.3s ease, margin-left 0.3s ease',
        }}
      >
        {/* Conditional rendering based on selected view */}
        {selectedView === 'events' && <Events />}
        {selectedView === 'bots' && <Bots />}
        {selectedView === 'maps' && <Maps />}
      </div>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Home;
