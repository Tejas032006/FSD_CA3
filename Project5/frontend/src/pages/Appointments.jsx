import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentList from '../components/AppointmentList.jsx';

/**
 * Appointments Page – Full Stack Appointment Records
 * Retrieves and updates PostgreSQL appointments via Express REST API.
 */
function Appointments({
  appointments = [],
  loading = false,
  error = null,
  onRefresh,
  onUpdateStatus,
  onDelete
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  const filteredAppointments = appointments
    .filter((appt) => {
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;

      const query = searchQuery.trim().toLowerCase();
      const patient = (appt.patientName || '').toLowerCase();
      const contact = String(appt.mobile || appt.phone || '');
      const doc = (appt.doctor || appt.doctorName || '').toLowerCase();
      const idStr = String(appt.id).toLowerCase();

      const matchesSearch =
        !query ||
        patient.includes(query) ||
        contact.includes(query) ||
        doc.includes(query) ||
        idStr.includes(query);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date-asc') {
        return (a.appointmentDate || '').localeCompare(b.appointmentDate || '');
      } else if (sortBy === 'date-desc') {
        return (b.appointmentDate || '').localeCompare(a.appointmentDate || '');
      } else if (sortBy === 'name-asc') {
        return (a.patientName || '').localeCompare(b.patientName || '');
      } else if (sortBy === 'name-desc') {
        return (b.patientName || '').localeCompare(a.patientName || '');
      } else if (sortBy === 'status') {
        return (a.status || '').localeCompare(b.status || '');
      }
      return 0;
    });

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('date-asc');
  };

  return (
    <div className="appointments-page">
      <div className="section-heading">
        <div className="heading-text">
          <h1>Appointment Records (PostgreSQL)</h1>
          <p>Search, review, filter, and manage appointments stored in the database.</p>
        </div>
        <div className="heading-actions">
          <span className="badge badge-light">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </span>
          {onRefresh && (
            <button className="btn btn-secondary btn-sm" onClick={onRefresh} title="Sync with Database">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>Refresh</span>
            </button>
          )}
          <Link to="/book" className="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Appointment</span>
          </Link>
        </div>
      </div>

      {/* Backend Error Banner */}
      {error && (
        <div className="alert alert-danger" role="alert" style={{ marginBottom: '20px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <div style={{ flex: 1 }}>
            <strong>Database Error:</strong> {error}
          </div>
          {onRefresh && (
            <button className="btn btn-secondary btn-sm" onClick={onRefresh}>
              Retry Connection
            </button>
          )}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="card filter-bar">
        <div className="filter-group filter-search">
          <label htmlFor="search-patient" className="sr-only">Search Appointments</label>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              id="search-patient"
              className="form-control"
              placeholder="Search by patient name, phone, doctor, or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-status" className="filter-label">Status:</label>
          <select
            id="filter-status"
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by" className="filter-label">Sort By:</label>
          <select
            id="sort-by"
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-asc">Date: Earliest First</option>
            <option value="date-desc">Date: Latest First</option>
            <option value="name-asc">Patient Name: A - Z</option>
            <option value="name-desc">Patient Name: Z - A</option>
            <option value="status">Status</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleResetFilters}
          title="Reset search and filters"
        >
          <span>Reset</span>
        </button>
      </div>

      {/* Appointment List Table Card */}
      <div className="card">
        <AppointmentList
          appointments={filteredAppointments}
          loading={loading}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          emptyMessage={
            searchQuery || statusFilter !== 'all'
              ? 'No appointments matched your search and filter criteria.'
              : 'There are currently no registered appointments in the database.'
          }
        />
      </div>
    </div>
  );
}

export default Appointments;
