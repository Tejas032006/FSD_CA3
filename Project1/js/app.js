/**
 * ============================================================================
 * MEDIBOOK – MAIN APPLICATION ORCHESTRATOR (app.js)
 * Manages SPA navigation, mobile drawer, toast notifications,
 * topbar widgets, and coordinates Doctor and Appointment modules.
 * ============================================================================
 */

(function (window) {
  'use strict';

  // Section titles map for header breadcrumb
  const SECTION_TITLES = {
    dashboard: 'Dashboard / Hospital Overview',
    doctors: 'Doctors Directory / Medical Staff',
    book: 'Book Appointment / New Consultation',
    appointments: 'Appointment Management / Records'
  };

  // DOM Elements
  const elements = {
    sidebar: document.getElementById('app-sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
    sidebarCloseBtn: document.getElementById('sidebar-close-btn'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.content-section'),
    pageTitle: document.getElementById('page-title'),
    headerLiveDate: document.getElementById('header-live-date'),
    toastContainer: document.getElementById('toast-container'),

    // Quick action CTA buttons
    headerBookBtn: document.getElementById('header-book-btn'),
    dashQuickBookBtn: document.getElementById('dash-quick-book-btn'),
    dashViewDoctorsBtn: document.getElementById('dash-view-doctors-btn'),
    dashViewAllAppointmentsBtn: document.getElementById('dash-view-all-appointments-btn'),
    mgmtBookBtn: document.getElementById('mgmt-book-btn')
  };

  /**
   * Switches the active SPA section
   * @param {string} sectionId - Target section name ('dashboard', 'doctors', 'book', 'appointments')
   */
  function navigateToSection(sectionId) {
    if (!sectionId) return;

    // Remove active class from all sections
    elements.sections.forEach(sec => sec.classList.remove('active'));

    // Remove active class from all nav links
    elements.navLinks.forEach(link => link.classList.remove('active'));

    // Activate target section
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Activate corresponding nav button
    const targetNav = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (targetNav) {
      targetNav.classList.add('active');
    }

    // Update page title breadcrumb
    if (elements.pageTitle && SECTION_TITLES[sectionId]) {
      elements.pageTitle.textContent = SECTION_TITLES[sectionId];
    }

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Update URL hash without jumping
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${sectionId}`);
    }

    // Scroll smoothly to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Mobile Sidebar Drawer Controls
   */
  function openMobileSidebar() {
    if (elements.sidebar) elements.sidebar.classList.add('open');
    if (elements.sidebarOverlay) elements.sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (elements.sidebar) elements.sidebar.classList.remove('open');
    if (elements.sidebarOverlay) elements.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Formats and displays current live date in the top bar
   */
  function updateLiveDate() {
    if (!elements.headerLiveDate) return;
    const now = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    elements.headerLiveDate.textContent = now.toLocaleDateString('en-GB', options);
  }

  /**
   * Toast Notification System
   * @param {string} message - Notification message
   * @param {string} type - 'success', 'error', 'info'
   * @param {number} duration - Milliseconds before auto-dismiss (default: 4000)
   */
  function showToast(message, type = 'info', duration = 4000) {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    } else if (type === 'error') {
      iconSvg = `
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${escapeHTML(message)}</span>
      <button class="toast-close-btn" aria-label="Close Notification">&times;</button>
    `;

    elements.toastContainer.appendChild(toast);

    // Close button event
    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismissToast = () => {
      toast.classList.add('toast-closing');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', dismissToast);
    }

    // Auto dismiss
    setTimeout(dismissToast, duration);
  }

  /**
   * HTML escape helper
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Binds global application event listeners
   */
  function bindGlobalEvents() {
    // Sidebar Navigation Click
    elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const section = link.getAttribute('data-section');
        navigateToSection(section);
      });
    });

    // Mobile Sidebar Toggles
    if (elements.sidebarToggleBtn) {
      elements.sidebarToggleBtn.addEventListener('click', openMobileSidebar);
    }
    if (elements.sidebarCloseBtn) {
      elements.sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
    }
    if (elements.sidebarOverlay) {
      elements.sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    // Quick Action Buttons
    if (elements.headerBookBtn) {
      elements.headerBookBtn.addEventListener('click', () => navigateToSection('book'));
    }
    if (elements.dashQuickBookBtn) {
      elements.dashQuickBookBtn.addEventListener('click', () => navigateToSection('book'));
    }
    if (elements.dashViewDoctorsBtn) {
      elements.dashViewDoctorsBtn.addEventListener('click', () => navigateToSection('doctors'));
    }
    if (elements.dashViewAllAppointmentsBtn) {
      elements.dashViewAllAppointmentsBtn.addEventListener('click', () => navigateToSection('appointments'));
    }
    if (elements.mgmtBookBtn) {
      elements.mgmtBookBtn.addEventListener('click', () => navigateToSection('book'));
    }

    // Handle Browser Popstate (Back / Forward navigation)
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && SECTION_TITLES[hash]) {
        navigateToSection(hash);
      } else {
        navigateToSection('dashboard');
      }
    });
  }

  /**
   * Initializes the entire MediBook application
   */
  async function initApp() {
    try {
      updateLiveDate();
      bindGlobalEvents();

      // Check URL hash for initial deep link (default to dashboard)
      const initialHash = window.location.hash.replace('#', '');
      const initialSection = SECTION_TITLES[initialHash] ? initialHash : 'dashboard';
      navigateToSection(initialSection);

      // Initialize Doctor Module (Fetch API + JSON)
      if (window.DoctorModule && typeof window.DoctorModule.init === 'function') {
        await window.DoctorModule.init();
      }

      // Initialize Appointments Module (Mock REST API + Storage)
      if (window.AppointmentModule && typeof window.AppointmentModule.init === 'function') {
        await window.AppointmentModule.init();
      }

      console.log('MediBook Hospital Appointment Management System initialized successfully.');
    } catch (err) {
      console.error('Initialization error:', err);
      showToast('An error occurred during system startup: ' + err.message, 'error');
    }
  }

  // Expose global MediBook interface
  window.MediBook = {
    navigateToSection,
    showToast
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})(window);

