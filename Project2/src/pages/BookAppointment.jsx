import React, { useState } from 'react';

/**
 * BookAppointment Page – Controlled Appointment Entry Form
 * Demonstrates React useState for form data & errors, event handlers (onChange, onSubmit),
 * client-side validation, conditional rendering, and props communication.
 */
function BookAppointment({ onAddAppointment }) {
  // Available hospital specialists list
  const doctorsList = [
    { id: 'DOC-101', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', room: 'OPD-204' },
    { id: 'DOC-102', name: 'Dr. Rajesh Sharma', specialty: 'Neurology', room: 'OPD-310' },
    { id: 'DOC-103', name: 'Dr. Priya Nair', specialty: 'Pediatrics', room: 'OPD-105' },
    { id: 'DOC-104', name: 'Dr. Michael Chang', specialty: 'Orthopedics', room: 'OPD-218' },
    { id: 'DOC-105', name: 'Dr. Ananya Sengupta', specialty: 'Dermatology', room: 'OPD-112' },
    { id: 'DOC-106', name: 'Dr. Robert Martinez', specialty: 'General Medicine', room: 'OPD-101' },
    { id: 'DOC-107', name: 'Dr. Kavita Patel', specialty: 'Gynecology & Obstetrics', room: 'OPD-209' },
    { id: 'DOC-108', name: 'Dr. Vikram Joshi', specialty: 'Ophthalmology', room: 'OPD-305' }
  ];

  // Helper to get today's date string in YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayString();

  // Controlled form state using React useState
  const initialFormData = {
    patientName: '',
    age: '',
    email: '',
    phone: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Universal onChange handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear individual error as user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Comprehensive client-side validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Patient Name: required, min 3 chars, letters and spaces
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient full name is required.';
    } else if (formData.patientName.trim().length < 3) {
      newErrors.patientName = 'Patient name must be at least 3 characters long.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.patientName.trim())) {
      newErrors.patientName = 'Patient name can only contain letters and spaces.';
    }

    // 2. Age: required, valid integer between 1 and 120
    const ageNum = parseInt(formData.age, 10);
    if (!formData.age) {
      newErrors.age = 'Age is required.';
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = 'Please enter a valid age between 1 and 120.';
    }

    // 3. Email: required, standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    // 4. Mobile Number: required, exactly 10 digits
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Mobile number must be exactly 10 digits.';
    }

    // 5. Doctor selection
    if (!formData.doctorName) {
      newErrors.doctorName = 'Please select a consulting doctor from the list.';
    }

    // 6. Appointment Date: required, cannot be in past
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required.';
    } else if (formData.appointmentDate < todayStr) {
      newErrors.appointmentDate = 'Past appointment dates are not permitted. Please select today or a future date.';
    }

    // 7. Time slot
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select a consultation time slot.';
    }

    // 8. Reason for consultation: required, min 5 chars
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason for consultation is required.';
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = 'Please state consultation reason (minimum 5 characters).';
    }

    return newErrors;
  };

  // onSubmit event handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Generate unique Appointment ID
    const randomId = `APT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppointment = {
      id: randomId,
      patientName: formData.patientName.trim(),
      age: parseInt(formData.age, 10),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      doctorName: formData.doctorName,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      reason: formData.reason.trim(),
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    // Prop function callback to add appointment in parent state
    if (onAddAppointment) {
      onAddAppointment(newAppointment);
    }

    // Display success notification and clear form
    setSuccessMessage(`Appointment successfully confirmed! Booking Reference ID: ${randomId}`);
    setFormData(initialFormData);
    setErrors({});

    // Scroll to top of form smoothly to show success banner
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form handler
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="book-appointment-page">
      <div className="section-heading">
        <div className="heading-text">
          <h1>Book a Medical Consultation</h1>
          <p>Fill out the patient details below to schedule an appointment with a specialist.</p>
        </div>
      </div>

      <div className="booking-layout">
        {/* Main Booking Form Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">
              <h2>Appointment Registration Form</h2>
              <p>All fields marked with an asterisk (<span className="required">*</span>) are mandatory.</p>
            </div>
          </div>

          <div className="card-body">
            {/* Conditional Rendering: Success Notification */}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Row 1: Patient Name & Age */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patientName" className="form-label">
                    Patient Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    className={`form-control ${errors.patientName ? 'is-invalid' : ''}`}
                    placeholder="e.g. Eleanor Vance"
                    value={formData.patientName}
                    onChange={handleChange}
                  />
                  {/* Conditional Rendering: Validation Error */}
                  {errors.patientName && (
                    <span className="field-error">{errors.patientName}</span>
                  )}
                </div>

                <div className="form-group form-group-sm">
                  <label htmlFor="age" className="form-label">
                    Age (Years) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    placeholder="e.g. 34"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                  />
                  {errors.age && <span className="field-error">{errors.age}</span>}
                </div>
              </div>

              {/* Row 2: Email & Mobile Number */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    10-Digit Mobile Number <span className="required">*</span>
                  </label>
                  <div className="phone-input-group">
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="9876543210"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              {/* Row 3: Consulting Doctor */}
              <div className="form-group">
                <label htmlFor="doctorName" className="form-label">
                  Select Consulting Doctor <span className="required">*</span>
                </label>
                <select
                  id="doctorName"
                  name="doctorName"
                  className={`form-select ${errors.doctorName ? 'is-invalid' : ''}`}
                  value={formData.doctorName}
                  onChange={handleChange}
                >
                  <option value="">-- Choose a Consulting Doctor --</option>
                  {doctorsList.map((doc) => (
                    <option key={doc.id} value={`${doc.name} (${doc.specialty})`}>
                      {doc.name} – {doc.specialty} (Room {doc.room})
                    </option>
                  ))}
                </select>
                {errors.doctorName && <span className="field-error">{errors.doctorName}</span>}
              </div>

              {/* Row 4: Appointment Date & Time */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="appointmentDate" className="form-label">
                    Appointment Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    min={todayStr}
                    className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                    value={formData.appointmentDate}
                    onChange={handleChange}
                  />
                  {errors.appointmentDate && (
                    <span className="field-error">{errors.appointmentDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="appointmentTime" className="form-label">
                    Time Slot <span className="required">*</span>
                  </label>
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    className={`form-select ${errors.appointmentTime ? 'is-invalid' : ''}`}
                    value={formData.appointmentTime}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Time Slot --</option>
                    <option value="09:00 AM">09:00 AM - 09:30 AM</option>
                    <option value="09:30 AM">09:30 AM - 10:00 AM</option>
                    <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                    <option value="10:30 AM">10:30 AM - 11:00 AM</option>
                    <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                    <option value="11:30 AM">11:30 AM - 12:00 PM</option>
                    <option value="12:00 PM">12:00 PM - 12:30 PM</option>
                    <option value="02:00 PM">02:00 PM - 02:30 PM</option>
                    <option value="02:30 PM">02:30 PM - 03:00 PM</option>
                    <option value="03:00 PM">03:00 PM - 03:30 PM</option>
                    <option value="03:30 PM">03:30 PM - 04:00 PM</option>
                    <option value="04:00 PM">04:00 PM - 04:30 PM</option>
                    <option value="04:30 PM">04:30 PM - 05:00 PM</option>
                  </select>
                  {errors.appointmentTime && (
                    <span className="field-error">{errors.appointmentTime}</span>
                  )}
                </div>
              </div>

              {/* Row 5: Reason for Consultation */}
              <div className="form-group">
                <label htmlFor="reason" className="form-label">
                  Reason for Consultation <span className="required">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows="3"
                  className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                  placeholder="Describe your primary symptoms, clinical concerns, or follow-up notes (min 5 characters)..."
                  value={formData.reason}
                  onChange={handleChange}
                ></textarea>
                {errors.reason && <span className="field-error">{errors.reason}</span>}
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Confirm Appointment</span>
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={handleReset}>
                  <span>Clear Form</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info & Guidelines */}
        <div className="booking-sidebar-info">
          <div className="card">
            <div className="card-header">
              <div className="card-header-title">
                <h3>Booking Guidelines</h3>
              </div>
            </div>
            <div className="card-body">
              <ul className="guidelines-list">
                <li>
                  <div className="guide-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Past appointment dates cannot be selected. You may book for today or upcoming days.</span>
                </li>
                <li>
                  <div className="guide-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Please provide a valid 10-digit mobile number for appointment confirmation and token tracking.</span>
                </li>
                <li>
                  <div className="guide-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Appointments can be modified between Scheduled, Completed, and Cancelled in the Appointments panel.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;

