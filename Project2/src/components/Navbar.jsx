import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar Component – Top Application Navigation Bar
 * Functional component demonstrating JSX, Props, and React Router integration.
 */
function Navbar({ onToggleSidebar }) {
  const location = useLocation();

  // Dynamic route titles for breadcrumb
  const routeTitles = {
    '/': 'Dashboard / Clinical Overview',
    '/book': 'Book Appointment / Schedule Visit',
    '/appointments': 'Appointment Management / Records'
  };

  const currentTitle = routeTitles[location.pathname] || 'MediBook Care Suite';

  // Format current date
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          type="button"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="navbar-breadcrumb">
          <span className="breadcrumb-root">MediBook Hospital</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentTitle}</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="date-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{todayFormatted}</span>
        </div>

        <Link to="/book" className="btn btn-primary btn-sm btn-quick-book">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Book Appointment</span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;

