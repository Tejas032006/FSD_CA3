import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AppointmentList Component – Reusable Appointment Table/Listing
 * Functional component demonstrating Props, JSX list rendering (.map),
 * React keys, Event Handling, and Conditional Rendering.
 */
function AppointmentList({
  appointments = [],
  onUpdateStatus,
  onDelete,
  emptyMessage = 'No appointments found.'
}) {
  // Helper to format ISO date strings (e.g. 2026-11-18 -> 18 Nov 2026)
  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
      const day = parseInt(parts[2], 10);
      return `${day} ${month} ${year}`;
    }
    return dateStr;
  };

  // Conditional Rendering: Empty State when no records exist
  if (!appointments || appointments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <h3>No Appointments Available</h3>
        <p>{emptyMessage}</p>
        <Link to="/book" className="btn btn-primary btn-sm">
          Schedule New Appointment
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Ref #</th>
            <th>Patient Details</th>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Reason</th>
            <th>Status</th>
            {onDelete && <th className="text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {/* Dynamic JSX list rendering using .map() with unique key */}
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              {/* Token ID */}
              <td>
                <span className="token-id">{appointment.id}</span>
              </td>

              {/* Patient Details */}
              <td>
                <div className="patient-name-text">{appointment.patientName}</div>
                <div className="patient-contact-sub">
                  {appointment.age} yrs • +91 {appointment.phone}
                </div>
                <div className="patient-contact-sub">{appointment.email}</div>
              </td>

              {/* Doctor */}
              <td>
                <div className="doc-name-text">{appointment.doctorName}</div>
              </td>

              {/* Date & Time */}
              <td>
                <span className="date-text">{formatDate(appointment.appointmentDate)}</span>
                <div className="time-text">{appointment.appointmentTime}</div>
              </td>

              {/* Reason */}
              <td>
                <div className="cell-reason" title={appointment.reason}>
                  {appointment.reason}
                </div>
              </td>

              {/* Status with interactive onChange handler */}
              <td>
                {onUpdateStatus ? (
                  <select
                    className={`status-select ${appointment.status}`}
                    value={appointment.status}
                    onChange={(e) => onUpdateStatus(appointment.id, e.target.value)}
                    aria-label={`Update status for ${appointment.patientName}`}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`badge badge-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                )}
              </td>

              {/* Optional Delete Action */}
              {onDelete && (
                <td className="text-right">
                  <button
                    className="btn btn-danger-outline"
                    onClick={() => onDelete(appointment.id)}
                    title="Remove Appointment Record"
                    aria-label={`Delete appointment for ${appointment.patientName}`}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentList;

