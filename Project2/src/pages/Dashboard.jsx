import React from 'react';
import { Link } from 'react-router-dom';
import AppointmentList from '../components/AppointmentList.jsx';

/**
 * Dashboard Page – Clinical Overview & KPI Statistics
 * Functional component demonstrating Props, derived state calculation,
 * JSX layout, and component composition with AppointmentList.
 */
function Dashboard({ appointments = [], onUpdateStatus }) {
  // Dynamically compute KPI statistics based on current appointments state
  const totalCount = appointments.length;
  const scheduledCount = appointments.filter(a => a.status === 'Scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

  // Recent 5 appointments
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Welcome Hero Banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-tag">Hospital Command Center</span>
          <h1 className="hero-title">Welcome to MediBook Clinical Portal</h1>
          <p className="hero-subtitle">
            Monitor live patient consultations, review operational OPD schedules, and manage medical appointments in real-time.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/book" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Schedule Appointment</span>
          </Link>
          <Link to="/appointments" className="btn btn-outline-white">
            <span>View All Records</span>
          </Link>
        </div>
      </section>

      {/* Statistics KPI Cards */}
      <section className="stats-grid" aria-label="Appointment Statistics">
        {/* Total Appointments */}
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Appointments</span>
            <span className="stat-value">{totalCount}</span>
            <span className="stat-trend trend-neutral">All recorded patient visits</span>
          </div>
        </div>

        {/* Scheduled */}
        <div className="stat-card stat-scheduled">
          <div className="stat-icon-wrapper" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Scheduled</span>
            <span className="stat-value">{scheduledCount}</span>
            <span className="stat-trend trend-info">Upcoming clinical visits</span>
          </div>
        </div>

        {/* Completed */}
        <div className="stat-card stat-completed">
          <div className="stat-icon-wrapper" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedCount}</span>
            <span className="stat-trend trend-success">Successfully consulted</span>
          </div>
        </div>

        {/* Cancelled */}
        <div className="stat-card stat-cancelled">
          <div className="stat-icon-wrapper" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Cancelled</span>
            <span className="stat-value">{cancelledCount}</span>
            <span className="stat-trend trend-danger">Voided or rescheduled</span>
          </div>
        </div>
      </section>

      {/* Dashboard Secondary Content Grid */}
      <section className="dashboard-columns">
        {/* Recent Appointments Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">
              <h2>Recent Bookings</h2>
              <p>Latest patient consultations scheduled in the system</p>
            </div>
            <Link to="/appointments" className="btn btn-ghost btn-sm">
              View All &rarr;
            </Link>
          </div>
          <div className="card-body">
            <AppointmentList
              appointments={recentAppointments}
              onUpdateStatus={onUpdateStatus}
              emptyMessage="No recent bookings found. Schedule your first appointment!"
            />
          </div>
        </div>

        {/* Specialty Clinics & Clinical Notices */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">
              <h2>Active Departments</h2>
              <p>Specialty clinics operational today</p>
            </div>
          </div>
          <div className="card-body">
            <div className="departments-list">
              <div className="department-item">
                <span className="dept-badge">Cardiology</span>
                <span className="dept-info">OPD-204 • Dr. Jenkins</span>
              </div>
              <div className="department-item">
                <span className="dept-badge">Neurology</span>
                <span className="dept-info">OPD-310 • Dr. Sharma</span>
              </div>
              <div className="department-item">
                <span className="dept-badge">Pediatrics</span>
                <span className="dept-info">OPD-105 • Dr. Nair</span>
              </div>
              <div className="department-item">
                <span className="dept-badge">Orthopedics</span>
                <span className="dept-info">OPD-218 • Dr. Chang</span>
              </div>
              <div className="department-item">
                <span className="dept-badge">Dermatology</span>
                <span className="dept-info">OPD-112 • Dr. Sengupta</span>
              </div>
            </div>

            <div className="notice-box">
              <div className="notice-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Clinical Notice</span>
              </div>
              <p>
                Please advise patients to report 15 minutes before the scheduled time slot for initial vitals screening and token verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

