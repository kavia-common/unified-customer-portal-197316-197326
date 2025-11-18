import React from 'react';
import './App.css';
import TopNav from './components/Layout/TopNav';
import SideNav from './components/Layout/SideNav';
import { Outlet } from 'react-router-dom';
import useTheme from './hooks/useTheme';

/**
 * PUBLIC_INTERFACE
 * App is the root layout component. It renders the TopNav, SideNav, and the
 * main content area via <Outlet /> for nested routes. It also applies the
 * selected theme using data-theme attribute on the html element.
 */
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <TopNav onToggleTheme={toggleTheme} currentTheme={theme} />
      <div className="layout">
        <SideNav />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
