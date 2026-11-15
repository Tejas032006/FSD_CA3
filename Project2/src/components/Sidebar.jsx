import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar Component – Main Application Navigation Drawer
 * Functional component utilizing React Router NavLink for active tab styling.
 */
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16M4 12h16"></path>
              <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="1.8"></rect>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">MediBook</span>
            <span className="brand-subtitle">Clinical Care Suite</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close Navigation Sidebar"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={onClose}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" rx="1.5"></rect>
                  <rect x="14" y="3" width="7" height="5" rx="1.5"></rect>
                  <rect x="14" y="12" width="7" height="9" rx="1.5"></rect>
                  <rect x="3" y="16" width="7" height="5" rx="1.5"></rect>
                </svg>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/book"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={onClose}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <line x1="12" y1="14" x2="12" y2="18"></line>
                  <line x1="10" y1="16" x2="14" y2="16"></line>
                </svg>
                <span>Book Appointment</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/appointments"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={onClose}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <span>Appointments</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="support-card">
            <div className="support-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="support-details">
              <span className="support-label">Emergency Line</span>
              <span className="support-phone">1800-200-MEDI</span>
            </div>
          </div>

          <div className="system-status">
            <span className="status-indicator-dot" aria-hidden="true"></span>
            <span>MediBook React • Live</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

