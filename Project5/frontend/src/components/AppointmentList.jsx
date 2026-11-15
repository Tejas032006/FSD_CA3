import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AppointmentList Component – Reusable Appointment Table/Listing
 * Handles data coming from PostgreSQL backend.
 */
function AppointmentList({
  appointments = [],
  loading = false,
  onUpdateStatus,
  onDelete,
  emptyMessage = 'No appointments found.'
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const parts = String(dateStr).split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
      const day = parseInt(parts[2], 10);
      return `${day} ${month} ${year}`;
    }
    return dateStr;
  };

  if (loading) {
    return (
      <div className="empty-state" style={{ padding: '60px 20px' }}>
        <div className="empty-icon" style={{ animation: 'spin 1s linear infinite' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </div>
        <h3>Connecting to PostgreSQL Database...</h3>
        <p>Loading latest appointments from the Express backend.</p>
      </div>
    );
  }

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
          {appointments.map((appointment) => {
            const contactPhone = appointment.mobile || appointment.phone || '--';
            const doctorDisplay = appointment.doctor || appointment.doctorName || '--';
            const tokenDisplay = String(appointment.id).startsWith('APT-')
              ? appointment.id
              : `APT-${String(appointment.id).padStart(4, '0')}`;

            return (
              <tr key={appointment.id}>
                {/* Reference ID */}
                <td>
                  <span className="token-id">{tokenDisplay}</span>
                </td>

                {/* Patient Information */}
                <td>
                  <div className="patient-name-text">{appointment.patientName}</div>
                  <div className="patient-contact-sub">
                    {appointment.age} yrs • +91 {contactPhone}
                  </div>
                  {appointment.email && (
                    <div className="patient-contact-sub">{appointment.email}</div>
                  )}
                </td>

                {/* Consulting Doctor */}
                <td>
                  <div className="doc-name-text">{doctorDisplay}</div>
                </td>

                {/* Date & Time Slot */}
                <td>
                  <span className="date-text">{formatDate(appointment.appointmentDate)}</span>
                  <div className="time-text">{appointment.appointmentTime}</div>
                </td>

                {/* Consultation Reason */}
                <td>
                  <div className="cell-reason" title={appointment.reason}>
                    {appointment.reason}
                  </div>
                </td>

                {/* Status Switcher */}
                <td>
                  {onUpdateStatus ? (
                    <select
                      className={`status-select ${appointment.status}`}
                      value={appointment.status || 'Scheduled'}
                      onChange={(e) => onUpdateStatus(appointment.id, e.target.value)}
                      aria-label={`Update status for ${appointment.patientName}`}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`badge badge-${(appointment.status || 'scheduled').toLowerCase()}`}>
                      {appointment.status || 'Scheduled'}
                    </span>
                  )}
                </td>

                {/* Delete Record */}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentList;
