import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TopNav displays the brand and theme toggle.
 */
export default function TopNav({ onToggleTheme, currentTheme }) {
  return (
    <nav className="topnav" role="navigation" aria-label="Top Navigation">
      <div className="topnav-inner">
        <div className="brand" aria-label="Corporate brand">
          <span style={{
            width: 10, height: 10, borderRadius: 2, background: 'var(--secondary)', display: 'inline-block'
          }} />
          <span>Unified Customer Portal</span>
        </div>
        <div>
          <button className="btn ghost" onClick={onToggleTheme} aria-label="Toggle theme">
            {currentTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}
