import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentList from '../components/AppointmentList.jsx';

/**
 * Appointments Page – Appointment Listing, Search, Filter, and Status Updates
 * Demonstrates useState for search query, status filter & sorting,
 * dynamic filtering using Array methods, event handlers, and props passing.
 */
function Appointments({ appointments = [], onUpdateStatus, onDelete }) {
  // Local state for search, filter, and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  // Filter and sort appointments dynamically
  const filteredAppointments = appointments
    .filter((appt) => {
      // 1. Filter by status
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;

      // 2. Search by patient name (case-insensitive) or phone or doctor
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        appt.patientName.toLowerCase().includes(query) ||
        appt.phone.includes(query) ||
        appt.doctorName.toLowerCase().includes(query) ||
        appt.id.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      // 3. Sort logic
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

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('date-asc');
  };

  return (
    <div className="appointments-page">
      <div className="section-heading">
        <div className="heading-text">
          <h1>Appointment Records</h1>
          <p>Search, review, filter, and update patient clinical consultation statuses.</p>
        </div>
        <div className="heading-actions">
          <span className="badge badge-light">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </span>
          <Link to="/book" className="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Appointment</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="card filter-bar">
        {/* Search Input */}
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
              placeholder="Search by patient name, phone, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter Dropdown */}
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

        {/* Sort Select */}
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

        {/* Reset Filter Button */}
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
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          emptyMessage={
            searchQuery || statusFilter !== 'all'
              ? 'No appointments matched your search and filter criteria.'
              : 'There are currently no registered appointments in the system.'
          }
        />
      </div>
    </div>
  );
}

export default Appointments;

