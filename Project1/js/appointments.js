/**
 * ============================================================================
 * MEDIBOOK – APPOINTMENT MANAGEMENT & MOCK REST API SERVICE (appointments.js)
 * Implements GET, POST, PUT, DELETE operations, localStorage persistence,
 * client-side form validation, and dynamic table rendering.
 * ============================================================================
 */

(function (window) {
  'use strict';

  // LocalStorage Key
  const STORAGE_KEY = 'medibook_appointments';

  // Initial Seed Appointments for first-time launch demonstration
  const SEED_APPOINTMENTS = [
    {
      id: "APT-100201",
      patientName: "Eleanor Vance",
      age: 38,
      email: "eleanor.vance@example.com",
      phone: "9876541200",
      doctorId: "DOC-101",
      doctorName: "Dr. Sarah Jenkins",
      doctorSpecialization: "Cardiology",
      appointmentDate: "2026-11-18",
      appointmentTime: "10:00 AM",
      reason: "Follow-up consultation for blood pressure stabilization and annual ECG review.",
      status: "Scheduled",
      createdAt: "2026-11-14T08:30:00.000Z",
      updatedAt: "2026-11-14T08:30:00.000Z"
    },
    {
      id: "APT-100202",
      patientName: "Marcus Sterling",
      age: 52,
      email: "marcus.sterling@example.com",
      phone: "9812345678",
      doctorId: "DOC-102",
      doctorName: "Dr. Rajesh Sharma",
      doctorSpecialization: "Neurology",
      appointmentDate: "2026-11-16",
      appointmentTime: "11:30 AM",
      reason: "Recurring migraine episodes and persistent tension headaches over 3 weeks.",
      status: "Scheduled",
      createdAt: "2026-11-14T09:15:00.000Z",
      updatedAt: "2026-11-14T09:15:00.000Z"
    },
    {
      id: "APT-100203",
      patientName: "Aarav Sharma",
      age: 7,
      email: "sharma.family@example.com",
      phone: "9823456789",
      doctorId: "DOC-103",
      doctorName: "Dr. Priya Nair",
      doctorSpecialization: "Pediatrics",
      appointmentDate: "2026-11-12",
      appointmentTime: "09:30 AM",
      reason: "Routine childhood immunization booster shot and developmental checkup.",
      status: "Completed",
      createdAt: "2026-11-10T10:00:00.000Z",
      updatedAt: "2026-11-12T11:00:00.000Z"
    },
    {
      id: "APT-100204",
      patientName: "Rohit Verma",
      age: 44,
      email: "rohit.verma@example.com",
      phone: "9765432109",
      doctorId: "DOC-104",
      doctorName: "Dr. Michael Chang",
      doctorSpecialization: "Orthopedics",
      appointmentDate: "2026-11-11",
      appointmentTime: "02:00 PM",
      reason: "Right knee arthroscopy follow-up and physical therapy progress assessment.",
      status: "Completed",
      createdAt: "2026-11-09T14:20:00.000Z",
      updatedAt: "2026-11-11T15:00:00.000Z"
    },
    {
      id: "APT-100205",
      patientName: "Natasha Gupta",
      age: 29,
      email: "natasha.gupta@example.com",
      phone: "9988776655",
      doctorId: "DOC-105",
      doctorName: "Dr. Ananya Sengupta",
      doctorSpecialization: "Dermatology",
      appointmentDate: "2026-11-10",
      appointmentTime: "03:30 PM",
      reason: "Patient had emergency travel; requested cancellation and rescheduling for next month.",
      status: "Cancelled",
      createdAt: "2026-11-08T11:10:00.000Z",
      updatedAt: "2026-11-09T16:00:00.000Z"
    }
  ];

  /**
   * Helper: Artificial async latency to simulate network round-trip realistically
   */
  const simulateNetworkLatency = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Helper: Generate unique Appointment Token ID (e.g. APT-748291)
   */
  function generateAppointmentId() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `APT-${randomDigits}`;
  }

  /**
   * Helper: Read all appointments from localStorage using JSON.parse()
   * Initializes seed data if storage is empty.
   */
  function loadAppointmentsFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPOINTMENTS));
        return [...SEED_APPOINTMENTS];
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse appointments from localStorage:', e);
      return [...SEED_APPOINTMENTS];
    }
  }

  /**
   * Helper: Write appointments to localStorage using JSON.stringify()
   */
  function saveAppointmentsToStorage(appointments) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      return true;
    } catch (e) {
      console.error('Failed to persist appointments to localStorage:', e);
      return false;
    }
  }

  /**
   * ========================================================================
   * MOCK REST API SERVICE (AppointmentAPIService)
   * Explicitly simulates HTTP methods: GET, POST, PUT, DELETE with
   * Fetch API-like request options, JSON bodies, and HTTP status codes.
   * ========================================================================
   */
  const AppointmentAPIService = {
    /**
     * HTTP GET: Retrieve all appointments or filtered subset
     * Endpoint simulation: GET /api/appointments
     * @param {Object} options
     * @returns {Promise<Object>} HTTP-like response: { status, ok, data }
     */
    async getAppointments(options = {}) {
      await simulateNetworkLatency(100);
      try {
        const appointments = loadAppointmentsFromStorage();
        return {
          status: 200,
          ok: true,
          message: 'Appointments retrieved successfully',
          data: appointments
        };
      } catch (err) {
        return {
          status: 500,
          ok: false,
          message: 'Internal server error while loading appointments',
          error: err.message
        };
      }
    },

    /**
     * HTTP GET: Retrieve a single appointment by ID
     * Endpoint simulation: GET /api/appointments/:id
     * @param {string} id
     */
    async getAppointmentById(id) {
      await simulateNetworkLatency(80);
      const appointments = loadAppointmentsFromStorage();
      const appointment = appointments.find(item => item.id === id);

      if (!appointment) {
        return {
          status: 404,
          ok: false,
          message: `Appointment with ID ${id} was not found`
        };
      }

      return {
        status: 200,
        ok: true,
        message: 'Appointment found',
        data: appointment
      };
    },

    /**
     * HTTP POST: Create a new appointment
     * Endpoint simulation: POST /api/appointments
     * Demonstrates Request configuration with Method 'POST', Headers, and JSON body.
     * @param {Object} payload - Raw appointment input data
     */
    async createAppointment(payload) {
      await simulateNetworkLatency(200);

      // Serialize and deserialize to ensure valid JSON payload representation
      const jsonPayload = JSON.stringify(payload);
      const parsedData = JSON.parse(jsonPayload);

      // Validate required fields
      if (!parsedData.patientName || !parsedData.doctorId || !parsedData.appointmentDate || !parsedData.appointmentTime) {
        return {
          status: 400,
          ok: false,
          message: 'Bad Request: Missing mandatory appointment attributes'
        };
      }

      const appointments = loadAppointmentsFromStorage();
      const newAppointment = {
        id: generateAppointmentId(),
        patientName: String(parsedData.patientName).trim(),
        age: Number(parsedData.age),
        email: String(parsedData.email).trim().toLowerCase(),
        phone: String(parsedData.phone).trim(),
        doctorId: parsedData.doctorId,
        doctorName: parsedData.doctorName || 'Specialist',
        doctorSpecialization: parsedData.doctorSpecialization || 'General',
        appointmentDate: parsedData.appointmentDate,
        appointmentTime: parsedData.appointmentTime,
        reason: String(parsedData.reason || '').trim(),
        status: parsedData.status || 'Scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to head of collection
      appointments.unshift(newAppointment);
      saveAppointmentsToStorage(appointments);

      return {
        status: 201,
        ok: true,
        message: 'Appointment scheduled successfully',
        data: newAppointment
      };
    },

    /**
     * HTTP PUT: Update existing appointment information or status
     * Endpoint simulation: PUT /api/appointments/:id
     * Demonstrates Request configuration with Method 'PUT', Headers, and JSON body.
     * @param {string} id
     * @param {Object} updatePayload
     */
    async updateAppointment(id, updatePayload) {
      await simulateNetworkLatency(180);

      const jsonPayload = JSON.stringify(updatePayload);
      const parsedData = JSON.parse(jsonPayload);

      const appointments = loadAppointmentsFromStorage();
      const index = appointments.findIndex(item => item.id === id);

      if (index === -1) {
        return {
          status: 404,
          ok: false,
          message: `Appointment ${id} not found`
        };
      }

      // Merge and update
      const existing = appointments[index];
      const updated = {
        ...existing,
        ...parsedData,
        id: existing.id, // Immutable ID
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString()
      };

      appointments[index] = updated;
      saveAppointmentsToStorage(appointments);

      return {
        status: 200,
        ok: true,
        message: 'Appointment record updated successfully',
        data: updated
      };
    },

    /**
     * HTTP DELETE: Remove an appointment record
     * Endpoint simulation: DELETE /api/appointments/:id
     * Demonstrates Request configuration with Method 'DELETE'
     * @param {string} id
     */
    async deleteAppointment(id) {
      await simulateNetworkLatency(150);

      const appointments = loadAppointmentsFromStorage();
      const initialLength = appointments.length;
      const filtered = appointments.filter(item => item.id !== id);

      if (filtered.length === initialLength) {
        return {
          status: 404,
          ok: false,
          message: `Cannot delete: Appointment ${id} not found`
        };
      }

      saveAppointmentsToStorage(filtered);

      return {
        status: 200,
        ok: true,
        message: 'Appointment record deleted successfully',
        data: { id }
      };
    }
  };

  /**
   * ========================================================================
   * DOM ELEMENTS CACHE & UI STATE
   * ========================================================================
   */
  const elements = {
    // Dashboard Stats
    statTotal: document.getElementById('stat-total'),
    statScheduled: document.getElementById('stat-scheduled'),
    statCompleted: document.getElementById('stat-completed'),
    statCancelled: document.getElementById('stat-cancelled'),
    dashRecentTbody: document.getElementById('dash-recent-tbody'),

    // Booking Form
    bookingForm: document.getElementById('appointment-form'),
    patientName: document.getElementById('patient-name'),
    patientAge: document.getElementById('patient-age'),
    patientEmail: document.getElementById('patient-email'),
    patientPhone: document.getElementById('patient-phone'),
    appointmentDoctor: document.getElementById('appointment-doctor'),
    appointmentDate: document.getElementById('appointment-date'),
    appointmentTime: document.getElementById('appointment-time'),
    appointmentReason: document.getElementById('appointment-reason'),
    bookResetBtn: document.getElementById('book-reset-btn'),
    bookSubmitBtn: document.getElementById('book-submit-btn'),

    // Form Error Containers
    errorName: document.getElementById('error-patient-name'),
    errorAge: document.getElementById('error-patient-age'),
    errorEmail: document.getElementById('error-patient-email'),
    errorPhone: document.getElementById('error-patient-phone'),
    errorDoctor: document.getElementById('error-appointment-doctor'),
    errorDate: document.getElementById('error-appointment-date'),
    errorTime: document.getElementById('error-appointment-time'),
    errorReason: document.getElementById('error-appointment-reason'),

    // Appointment Management
    appointmentsTbody: document.getElementById('appointments-tbody'),
    appointmentsTable: document.getElementById('appointments-table'),
    appointmentsEmptyState: document.getElementById('appointments-empty-state'),
    emptyBookActionBtn: document.getElementById('empty-book-action-btn'),
    appointmentsCountBadge: document.getElementById('appointments-count-badge'),
    searchInput: document.getElementById('appointments-search-input'),
    statusFilter: document.getElementById('appointments-status-filter'),
    sortSelect: document.getElementById('appointments-sort-select'),
    resetBtn: document.getElementById('appointments-reset-btn'),

    // View Modal
    viewModal: document.getElementById('view-modal'),
    viewModalClose: document.getElementById('view-modal-close'),
    viewModalDone: document.getElementById('view-modal-done'),
    viewModalEditBtn: document.getElementById('view-modal-edit-btn'),
    viewTokenId: document.getElementById('view-token-id'),
    viewStatusBadge: document.getElementById('view-status-badge'),
    viewPatientName: document.getElementById('view-patient-name'),
    viewPatientAge: document.getElementById('view-patient-age'),
    viewPatientPhone: document.getElementById('view-patient-phone'),
    viewPatientEmail: document.getElementById('view-patient-email'),
    viewDoctorName: document.getElementById('view-doctor-name'),
    viewDoctorDept: document.getElementById('view-doctor-dept'),
    viewAppointmentDate: document.getElementById('view-appointment-date'),
    viewAppointmentTime: document.getElementById('view-appointment-time'),
    viewAppointmentReason: document.getElementById('view-appointment-reason'),

    // Edit Modal
    editModal: document.getElementById('edit-modal'),
    editModalClose: document.getElementById('edit-modal-close'),
    editModalCancel: document.getElementById('edit-modal-cancel'),
    editForm: document.getElementById('edit-appointment-form'),
    editAppointmentId: document.getElementById('edit-appointment-id'),
    editTokenId: document.getElementById('edit-token-id'),
    editPatientName: document.getElementById('edit-patient-name'),
    editPatientAge: document.getElementById('edit-patient-age'),
    editPatientEmail: document.getElementById('edit-patient-email'),
    editPatientPhone: document.getElementById('edit-patient-phone'),
    editDoctor: document.getElementById('edit-appointment-doctor'),
    editDate: document.getElementById('edit-appointment-date'),
    editTime: document.getElementById('edit-appointment-time'),
    editStatus: document.getElementById('edit-appointment-status'),
    editReason: document.getElementById('edit-appointment-reason'),

    // Edit Form Errors
    errorEditName: document.getElementById('error-edit-patient-name'),
    errorEditAge: document.getElementById('error-edit-patient-age'),
    errorEditEmail: document.getElementById('error-edit-patient-email'),
    errorEditPhone: document.getElementById('error-edit-patient-phone'),
    errorEditDoctor: document.getElementById('error-edit-appointment-doctor'),
    errorEditDate: document.getElementById('error-edit-appointment-date'),
    errorEditTime: document.getElementById('error-edit-appointment-time'),
    errorEditReason: document.getElementById('error-edit-appointment-reason'),

    // Delete Modal
    deleteModal: document.getElementById('delete-modal'),
    deleteModalClose: document.getElementById('delete-modal-close'),
    deleteModalCancel: document.getElementById('delete-modal-cancel'),
    deleteModalConfirm: document.getElementById('delete-modal-confirm'),
    deleteTargetId: document.getElementById('delete-target-id'),
    deleteTargetPatient: document.getElementById('delete-target-patient')
  };

  // Holds currently viewed/edited/pending deletion appointment
  let currentActiveAppointmentId = null;

  /**
   * ========================================================================
   * VALIDATION UTILITIES
   * ========================================================================
   */
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[6-9]\d{9}$/; // 10-digit mobile starting with 6-9

  function getTodayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function setFieldError(inputEl, errorEl, message) {
    if (inputEl) {
      inputEl.classList.add('is-invalid');
      inputEl.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(inputEl, errorEl) {
    if (inputEl) {
      inputEl.classList.remove('is-invalid');
      inputEl.removeAttribute('aria-invalid');
    }
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  function clearAllFormErrors(prefix = '') {
    const inputs = [
      { input: elements[prefix ? 'editPatientName' : 'patientName'], error: elements[prefix ? 'errorEditName' : 'errorName'] },
      { input: elements[prefix ? 'editPatientAge' : 'patientAge'], error: elements[prefix ? 'errorEditAge' : 'errorAge'] },
      { input: elements[prefix ? 'editPatientEmail' : 'patientEmail'], error: elements[prefix ? 'errorEditEmail' : 'errorEmail'] },
      { input: elements[prefix ? 'editPatientPhone' : 'patientPhone'], error: elements[prefix ? 'errorEditPhone' : 'errorPhone'] },
      { input: elements[prefix ? 'editDoctor' : 'appointmentDoctor'], error: elements[prefix ? 'errorEditDoctor' : 'errorDoctor'] },
      { input: elements[prefix ? 'editDate' : 'appointmentDate'], error: elements[prefix ? 'errorEditDate' : 'errorDate'] },
      { input: elements[prefix ? 'editTime' : 'appointmentTime'], error: elements[prefix ? 'errorEditTime' : 'errorTime'] },
      { input: elements[prefix ? 'editReason' : 'appointmentReason'], error: elements[prefix ? 'errorEditReason' : 'errorReason'] }
    ];

    inputs.forEach(item => {
      clearFieldError(item.input, item.error);
    });
  }

  /**
   * Validates Booking or Edit appointment form data
   */
  function validateAppointmentData(data, isEdit = false) {
    let isValid = true;
    const errors = {};
    const todayStr = getTodayString();

    // 1. Patient Name: required, min 3 chars, letters and spaces
    if (!data.patientName || data.patientName.trim().length < 3) {
      errors.name = 'Patient name must be at least 3 characters long.';
      isValid = false;
    } else if (!/^[a-zA-Z\s.'-]+$/.test(data.patientName.trim())) {
      errors.name = 'Patient name can only contain letters and standard punctuation.';
      isValid = false;
    }

    // 2. Age: required, 1 to 120
    const ageNum = parseInt(data.age, 10);
    if (!data.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.age = 'Please enter a valid age between 1 and 120 years.';
      isValid = false;
    }

    // 3. Email: required, valid format
    if (!data.email || !EMAIL_REGEX.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address (e.g. name@domain.com).';
      isValid = false;
    }

    // 4. Mobile: required, 10 digits
    const cleanedPhone = (data.phone || '').trim().replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
      isValid = false;
    }

    // 5. Doctor selection
    if (!data.doctorId) {
      errors.doctor = 'Please select a consulting doctor from the list.';
      isValid = false;
    }

    // 6. Appointment Date: required, cannot be in past
    if (!data.appointmentDate) {
      errors.date = 'Please select an appointment date.';
      isValid = false;
    } else if (data.appointmentDate < todayStr) {
      errors.date = 'Past appointment dates are not permitted. Please select today or a future date.';
      isValid = false;
    }

    // 7. Time slot
    if (!data.appointmentTime) {
      errors.time = 'Please select a consultation time slot.';
      isValid = false;
    }

    // 8. Reason for visit: required, min 5 chars
    if (!data.reason || data.reason.trim().length < 5) {
      errors.reason = 'Please state the consultation reason or symptoms (minimum 5 characters).';
      isValid = false;
    }

    return { isValid, errors };
  }

  /**
   * ========================================================================
   * FORM SUBMISSION & EVENT HANDLERS
   * ========================================================================
   */

  /**
   * Handle Create Appointment (POST)
   */
  async function handleBookingSubmit(e) {
    e.preventDefault();
    clearAllFormErrors();

    // Extract form values
    const doctorSelect = elements.appointmentDoctor;
    const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];

    const formData = {
      patientName: elements.patientName.value,
      age: elements.patientAge.value,
      email: elements.patientEmail.value,
      phone: elements.patientPhone.value,
      doctorId: elements.appointmentDoctor.value,
      doctorName: selectedOption ? selectedOption.getAttribute('data-name') : '',
      doctorSpecialization: selectedOption ? selectedOption.getAttribute('data-spec') : '',
      appointmentDate: elements.appointmentDate.value,
      appointmentTime: elements.appointmentTime.value,
      reason: elements.appointmentReason.value,
      status: 'Scheduled'
    };

    // Validate
    const validation = validateAppointmentData(formData, false);
    if (!validation.isValid) {
      if (validation.errors.name) setFieldError(elements.patientName, elements.errorName, validation.errors.name);
      if (validation.errors.age) setFieldError(elements.patientAge, elements.errorAge, validation.errors.age);
      if (validation.errors.email) setFieldError(elements.patientEmail, elements.errorEmail, validation.errors.email);
      if (validation.errors.phone) setFieldError(elements.patientPhone, elements.errorPhone, validation.errors.phone);
      if (validation.errors.doctor) setFieldError(elements.appointmentDoctor, elements.errorDoctor, validation.errors.doctor);
      if (validation.errors.date) setFieldError(elements.appointmentDate, elements.errorDate, validation.errors.date);
      if (validation.errors.time) setFieldError(elements.appointmentTime, elements.errorTime, validation.errors.time);
      if (validation.errors.reason) setFieldError(elements.appointmentReason, elements.errorReason, validation.errors.reason);

      if (window.MediBook && window.MediBook.showToast) {
        window.MediBook.showToast('Please correct the highlighted validation errors.', 'error');
      }
      return;
    }

    // Submit via Mock REST API POST
    try {
      if (elements.bookSubmitBtn) {
        elements.bookSubmitBtn.disabled = true;
        elements.bookSubmitBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;"></div> Booking...';
      }

      const response = await AppointmentAPIService.createAppointment(formData);

      if (response.ok && response.status === 201) {
        // Reset form
        elements.bookingForm.reset();
        clearAllFormErrors();
        if (window.DoctorModule && window.DoctorModule.updatePreview) {
          window.DoctorModule.updatePreview('');
        }

        if (window.MediBook && window.MediBook.showToast) {
          window.MediBook.showToast(`Appointment booked successfully! Booking Ref: ${response.data.id}`, 'success');
        }

        // Refresh table & dashboard stats
        await refreshAppointmentsView();

        // Switch to appointment management section to view the newly created record
        if (window.MediBook && window.MediBook.navigateToSection) {
          setTimeout(() => {
            window.MediBook.navigateToSection('appointments');
          }, 600);
        }
      } else {
        throw new Error(response.message || 'Failed to create appointment');
      }
    } catch (err) {
      if (window.MediBook && window.MediBook.showToast) {
        window.MediBook.showToast(`Booking error: ${err.message}`, 'error');
      }
    } finally {
      if (elements.bookSubmitBtn) {
        elements.bookSubmitBtn.disabled = false;
        elements.bookSubmitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Confirm Appointment</span>
        `;
      }
    }
  }

  /**
   * Handle Edit Appointment Submit (PUT)
   */
  async function handleEditSubmit(e) {
    e.preventDefault();
    clearAllFormErrors('edit');

    const id = elements.editAppointmentId.value;
    const doctorSelect = elements.editDoctor;
    const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];

    const updateData = {
      patientName: elements.editPatientName.value,
      age: elements.editPatientAge.value,
      email: elements.editPatientEmail.value,
      phone: elements.editPatientPhone.value,
      doctorId: elements.editDoctor.value,
      doctorName: selectedOption ? selectedOption.getAttribute('data-name') : '',
      doctorSpecialization: selectedOption ? selectedOption.getAttribute('data-spec') : '',
      appointmentDate: elements.editDate.value,
      appointmentTime: elements.editTime.value,
      status: elements.editStatus.value,
      reason: elements.editReason.value
    };

    const validation = validateAppointmentData(updateData, true);
    if (!validation.isValid) {
      if (validation.errors.name) setFieldError(elements.editPatientName, elements.errorEditName, validation.errors.name);
      if (validation.errors.age) setFieldError(elements.editPatientAge, elements.errorEditAge, validation.errors.age);
      if (validation.errors.email) setFieldError(elements.editPatientEmail, elements.errorEditEmail, validation.errors.email);
      if (validation.errors.phone) setFieldError(elements.editPatientPhone, elements.errorEditPhone, validation.errors.phone);
      if (validation.errors.doctor) setFieldError(elements.editDoctor, elements.errorEditDoctor, validation.errors.doctor);
      if (validation.errors.date) setFieldError(elements.editDate, elements.errorEditDate, validation.errors.date);
      if (validation.errors.time) setFieldError(elements.editTime, elements.errorEditTime, validation.errors.time);
      if (validation.errors.reason) setFieldError(elements.editReason, elements.errorEditReason, validation.errors.reason);
      return;
    }

    try {
      const response = await AppointmentAPIService.updateAppointment(id, updateData);

      if (response.ok) {
        closeModal(elements.editModal);
        if (window.MediBook && window.MediBook.showToast) {
          window.MediBook.showToast(`Appointment ${id} updated successfully.`, 'success');
        }
        await refreshAppointmentsView();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      if (window.MediBook && window.MediBook.showToast) {
        window.MediBook.showToast(`Update failed: ${err.message}`, 'error');
      }
    }
  }

  /**
   * Handle Delete Appointment Confirmation (DELETE)
   */
  async function handleDeleteConfirm() {
    if (!currentActiveAppointmentId) return;

    try {
      const response = await AppointmentAPIService.deleteAppointment(currentActiveAppointmentId);

      if (response.ok) {
        closeModal(elements.deleteModal);
        if (window.MediBook && window.MediBook.showToast) {
          window.MediBook.showToast(`Appointment ${currentActiveAppointmentId} deleted successfully.`, 'info');
        }
        currentActiveAppointmentId = null;
        await refreshAppointmentsView();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      if (window.MediBook && window.MediBook.showToast) {
        window.MediBook.showToast(`Delete failed: ${err.message}`, 'error');
      }
    }
  }

  /**
   * Handle Inline Status Change in Table (PUT)
   */
  async function handleInlineStatusChange(id, newStatus) {
    try {
      const response = await AppointmentAPIService.updateAppointment(id, { status: newStatus });
      if (response.ok) {
        if (window.MediBook && window.MediBook.showToast) {
          window.MediBook.showToast(`Status for ${id} changed to ${newStatus}.`, 'success');
        }
        await refreshAppointmentsView();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      if (window.MediBook && window.MediBook.showToast) {
        window.MediBook.showToast(`Failed to update status: ${err.message}`, 'error');
      }
    }
  }

  /**
   * ========================================================================
   * MODAL CONTROLLERS
   * ========================================================================
   */
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * Opens View Details Modal for an appointment
   */
  async function openViewModal(id) {
    const response = await AppointmentAPIService.getAppointmentById(id);
    if (!response.ok) {
      if (window.MediBook && window.MediBook.showToast) {
        window.MediBook.showToast(response.message, 'error');
      }
      return;
    }

    const appt = response.data;
    currentActiveAppointmentId = appt.id;

    elements.viewTokenId.textContent = appt.id;
    elements.viewStatusBadge.textContent = appt.status;
    elements.viewStatusBadge.className = `badge badge-${appt.status.toLowerCase()}`;
    elements.viewPatientName.textContent = appt.patientName;
    elements.viewPatientAge.textContent = `${appt.age} Years`;
    elements.viewPatientPhone.textContent = `+91 ${appt.phone}`;
    elements.viewPatientEmail.textContent = appt.email;
    elements.viewDoctorName.textContent = appt.doctorName;
    elements.viewDoctorDept.textContent = appt.doctorSpecialization;
    elements.viewAppointmentDate.textContent = formatDate(appt.appointmentDate);
    elements.viewAppointmentTime.textContent = appt.appointmentTime;
    elements.viewAppointmentReason.textContent = appt.reason;

    openModal(elements.viewModal);
  }

  /**
   * Opens Edit Modal for an appointment
   */
  async function openEditModal(id) {
    const response = await AppointmentAPIService.getAppointmentById(id);
    if (!response.ok) {
      if (window.MediBook && window.MediBook.showToast) {
        window.MediBook.showToast(response.message, 'error');
      }
      return;
    }

    const appt = response.data;
    currentActiveAppointmentId = appt.id;
    clearAllFormErrors('edit');

    elements.editAppointmentId.value = appt.id;
    elements.editTokenId.textContent = appt.id;
    elements.editPatientName.value = appt.patientName;
    elements.editPatientAge.value = appt.age;
    elements.editPatientEmail.value = appt.email;
    elements.editPatientPhone.value = appt.phone;
    elements.editDoctor.value = appt.doctorId;
    elements.editDate.value = appt.appointmentDate;
    elements.editTime.value = appt.appointmentTime;
    elements.editStatus.value = appt.status;
    elements.editReason.value = appt.reason;

    openModal(elements.editModal);
  }

  /**
   * Opens Delete Confirmation Modal
   */
  async function openDeleteModal(id) {
    const response = await AppointmentAPIService.getAppointmentById(id);
    if (!response.ok) return;

    currentActiveAppointmentId = id;
    elements.deleteTargetId.textContent = id;
    elements.deleteTargetPatient.textContent = response.data.patientName;

    openModal(elements.deleteModal);
  }

  /**
   * ========================================================================
   * RENDERING & FILTERING
   * ========================================================================
   */

  /**
   * Formats ISO date string (YYYY-MM-DD) into readable format: "18 Nov 2026"
   */
  function formatDate(dateStr) {
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
  }

  /**
   * Updates Dashboard KPI statistics and recent bookings table
   */
  function updateDashboard(appointments) {
    const total = appointments.length;
    let scheduled = 0;
    let completed = 0;
    let cancelled = 0;

    appointments.forEach(appt => {
      if (appt.status === 'Scheduled') scheduled++;
      else if (appt.status === 'Completed') completed++;
      else if (appt.status === 'Cancelled') cancelled++;
    });

    if (elements.statTotal) elements.statTotal.textContent = total;
    if (elements.statScheduled) elements.statScheduled.textContent = scheduled;
    if (elements.statCompleted) elements.statCompleted.textContent = completed;
    if (elements.statCancelled) elements.statCancelled.textContent = cancelled;

    // Render Recent 5 Bookings in Dashboard Table
    if (elements.dashRecentTbody) {
      elements.dashRecentTbody.innerHTML = '';
      const recent = appointments.slice(0, 5);

      if (recent.length === 0) {
        elements.dashRecentTbody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-muted" style="padding:24px;">No appointments on record yet.</td>
          </tr>
        `;
        return;
      }

      recent.forEach(appt => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="patient-name-text">${escapeHTML(appt.patientName)}</div>
            <span class="patient-contact-sub">${escapeHTML(appt.id)}</span>
          </td>
          <td>
            <div class="doc-name-text">${escapeHTML(appt.doctorName)}</div>
            <span class="doc-spec-sub">${escapeHTML(appt.doctorSpecialization)}</span>
          </td>
          <td>
            <span class="date-text">${formatDate(appt.appointmentDate)}</span>
            <div class="time-text">${escapeHTML(appt.appointmentTime)}</div>
          </td>
          <td>
            <span class="badge badge-${appt.status.toLowerCase()}">${escapeHTML(appt.status)}</span>
          </td>
        `;
        elements.dashRecentTbody.appendChild(tr);
      });
    }
  }

  /**
   * Filter, search, and sort appointment records
   */
  function getFilteredAppointments(allAppointments) {
    const query = (elements.searchInput ? elements.searchInput.value : '').trim().toLowerCase();
    const status = (elements.statusFilter ? elements.statusFilter.value : 'all');
    const sort = (elements.sortSelect ? elements.sortSelect.value : 'date-asc');

    let result = allAppointments.filter(appt => {
      // Status filter
      const matchesStatus = (status === 'all' || appt.status === status);

      // Search filter (patient name, phone, or doctor name)
      const matchesSearch = !query || (
        appt.patientName.toLowerCase().includes(query) ||
        appt.doctorName.toLowerCase().includes(query) ||
        appt.phone.includes(query) ||
        appt.id.toLowerCase().includes(query) ||
        appt.doctorSpecialization.toLowerCase().includes(query)
      );

      return matchesStatus && matchesSearch;
    });

    // Sort logic
    result.sort((a, b) => {
      if (sort === 'date-asc') {
        return (a.appointmentDate || '').localeCompare(b.appointmentDate || '');
      } else if (sort === 'date-desc') {
        return (b.appointmentDate || '').localeCompare(a.appointmentDate || '');
      } else if (sort === 'name-asc') {
        return (a.patientName || '').localeCompare(b.patientName || '');
      } else if (sort === 'name-desc') {
        return (b.patientName || '').localeCompare(a.patientName || '');
      } else if (sort === 'status') {
        return (a.status || '').localeCompare(b.status || '');
      }
      return 0;
    });

    return result;
  }

  /**
   * Renders Appointments Table dynamically
   */
  function renderAppointmentsTable(appointments) {
    if (!elements.appointmentsTbody) return;
    elements.appointmentsTbody.innerHTML = '';

    if (!appointments || appointments.length === 0) {
      if (elements.appointmentsTable) elements.appointmentsTable.classList.add('hidden');
      if (elements.appointmentsEmptyState) elements.appointmentsEmptyState.classList.remove('hidden');
      if (elements.appointmentsCountBadge) elements.appointmentsCountBadge.textContent = '0 appointments';
      return;
    }

    if (elements.appointmentsTable) elements.appointmentsTable.classList.remove('hidden');
    if (elements.appointmentsEmptyState) elements.appointmentsEmptyState.classList.add('hidden');
    if (elements.appointmentsCountBadge) {
      elements.appointmentsCountBadge.textContent = `${appointments.length} appointment${appointments.length === 1 ? '' : 's'}`;
    }

    const fragment = document.createDocumentFragment();

    appointments.forEach(appt => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', appt.id);

      tr.innerHTML = `
        <td>
          <span class="token-id">${escapeHTML(appt.id)}</span>
        </td>
        <td>
          <div class="cell-patient">
            <span class="patient-name-text">${escapeHTML(appt.patientName)}</span>
            <span class="patient-contact-sub">${appt.age} yrs • +91 ${escapeHTML(appt.phone)}</span>
          </div>
        </td>
        <td>
          <div class="cell-doctor">
            <span class="doc-name-text">${escapeHTML(appt.doctorName)}</span>
            <span class="doc-spec-sub">${escapeHTML(appt.doctorSpecialization)}</span>
          </div>
        </td>
        <td>
          <div class="cell-datetime">
            <span class="date-text">${formatDate(appt.appointmentDate)}</span>
            <span class="time-text">${escapeHTML(appt.appointmentTime)}</span>
          </div>
        </td>
        <td>
          <div class="cell-reason" title="${escapeHTML(appt.reason)}">${escapeHTML(appt.reason)}</div>
        </td>
        <td>
          <select class="status-select ${escapeHTML(appt.status)}" data-id="${appt.id}" aria-label="Change Status">
            <option value="Scheduled" ${appt.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="Completed" ${appt.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${appt.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-table-action btn-view" data-id="${appt.id}" title="View Details" aria-label="View Details">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-table-action btn-edit" data-id="${appt.id}" title="Edit Appointment" aria-label="Edit Appointment">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button class="btn-table-action btn-delete" data-id="${appt.id}" title="Delete Record" aria-label="Delete Record">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      `;

      fragment.appendChild(tr);
    });

    elements.appointmentsTbody.appendChild(fragment);

    // Attach Event Listeners to Action buttons & inline status dropdowns
    elements.appointmentsTbody.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const val = e.target.value;
        handleInlineStatusChange(id, val);
      });
    });

    elements.appointmentsTbody.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => openViewModal(btn.getAttribute('data-id')));
    });

    elements.appointmentsTbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
    });

    elements.appointmentsTbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.getAttribute('data-id')));
    });
  }

  /**
   * Full View Refresh: fetches appointments via mock API GET, updates Dashboard & Table
   */
  async function refreshAppointmentsView() {
    const response = await AppointmentAPIService.getAppointments();
    if (!response.ok) return;

    const allAppointments = response.data;
    updateDashboard(allAppointments);

    const filtered = getFilteredAppointments(allAppointments);
    renderAppointmentsTable(filtered);
  }

  /**
   * Helper: Escape HTML to prevent XSS
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
   * Setup date input restrictions (min date = today)
   */
  function initDateConstraints() {
    const today = getTodayString();
    if (elements.appointmentDate) {
      elements.appointmentDate.min = today;
    }
    if (elements.editDate) {
      elements.editDate.min = today;
    }
  }

  /**
   * Reset filter controls
   */
  function resetFilters() {
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.statusFilter) elements.statusFilter.value = 'all';
    if (elements.sortSelect) elements.sortSelect.value = 'date-asc';
    refreshAppointmentsView();
  }

  /**
   * Bind event listeners for appointment form, table filters, and modals
   */
  function bindEvents() {
    // Booking Form
    if (elements.bookingForm) {
      elements.bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    if (elements.bookResetBtn) {
      elements.bookResetBtn.addEventListener('click', () => {
        elements.bookingForm.reset();
        clearAllFormErrors();
        if (window.DoctorModule && window.DoctorModule.updatePreview) {
          window.DoctorModule.updatePreview('');
        }
      });
    }

    // Real-time blur validation on booking inputs
    if (elements.patientName) {
      elements.patientName.addEventListener('blur', () => {
        const val = elements.patientName.value.trim();
        if (val.length > 0 && val.length < 3) {
          setFieldError(elements.patientName, elements.errorName, 'Name must be at least 3 characters.');
        } else {
          clearFieldError(elements.patientName, elements.errorName);
        }
      });
    }

    if (elements.patientAge) {
      elements.patientAge.addEventListener('blur', () => {
        const age = parseInt(elements.patientAge.value, 10);
        if (elements.patientAge.value && (isNaN(age) || age < 1 || age > 120)) {
          setFieldError(elements.patientAge, elements.errorAge, 'Age must be between 1 and 120.');
        } else {
          clearFieldError(elements.patientAge, elements.errorAge);
        }
      });
    }

    if (elements.patientEmail) {
      elements.patientEmail.addEventListener('blur', () => {
        if (elements.patientEmail.value && !EMAIL_REGEX.test(elements.patientEmail.value.trim())) {
          setFieldError(elements.patientEmail, elements.errorEmail, 'Please enter a valid email address.');
        } else {
          clearFieldError(elements.patientEmail, elements.errorEmail);
        }
      });
    }

    if (elements.patientPhone) {
      elements.patientPhone.addEventListener('blur', () => {
        const phone = elements.patientPhone.value.trim().replace(/\D/g, '');
        if (elements.patientPhone.value && phone.length !== 10) {
          setFieldError(elements.patientPhone, elements.errorPhone, 'Phone number must be exactly 10 digits.');
        } else {
          clearFieldError(elements.patientPhone, elements.errorPhone);
        }
      });
    }

    // Appointment Table Filters
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', () => refreshAppointmentsView());
    }

    if (elements.statusFilter) {
      elements.statusFilter.addEventListener('change', () => refreshAppointmentsView());
    }

    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', () => refreshAppointmentsView());
    }

    if (elements.resetBtn) {
      elements.resetBtn.addEventListener('click', resetFilters);
    }

    if (elements.emptyBookActionBtn) {
      elements.emptyBookActionBtn.addEventListener('click', () => {
        if (window.MediBook && window.MediBook.navigateToSection) {
          window.MediBook.navigateToSection('book');
        }
      });
    }

    // Modal Close Buttons
    if (elements.viewModalClose) elements.viewModalClose.addEventListener('click', () => closeModal(elements.viewModal));
    if (elements.viewModalDone) elements.viewModalDone.addEventListener('click', () => closeModal(elements.viewModal));
    if (elements.viewModalEditBtn) {
      elements.viewModalEditBtn.addEventListener('click', () => {
        const id = currentActiveAppointmentId;
        closeModal(elements.viewModal);
        if (id) openEditModal(id);
      });
    }

    if (elements.editModalClose) elements.editModalClose.addEventListener('click', () => closeModal(elements.editModal));
    if (elements.editModalCancel) elements.editModalCancel.addEventListener('click', () => closeModal(elements.editModal));
    if (elements.editForm) elements.editForm.addEventListener('submit', handleEditSubmit);

    if (elements.deleteModalClose) elements.deleteModalClose.addEventListener('click', () => closeModal(elements.deleteModal));
    if (elements.deleteModalCancel) elements.deleteModalCancel.addEventListener('click', () => closeModal(elements.deleteModal));
    if (elements.deleteModalConfirm) elements.deleteModalConfirm.addEventListener('click', handleDeleteConfirm);

    // Close modals on clicking outside content
    [elements.viewModal, elements.editModal, elements.deleteModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal(modal);
          }
        });
      }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(elements.viewModal);
        closeModal(elements.editModal);
        closeModal(elements.deleteModal);
      }
    });
  }

  /**
   * Initializes Appointment Module
   */
  async function initAppointments() {
    initDateConstraints();
    bindEvents();
    await refreshAppointmentsView();
  }

  // Expose Public API
  window.AppointmentModule = {
    init: initAppointments,
    service: AppointmentAPIService,
    refresh: refreshAppointmentsView,
    openViewModal,
    openEditModal,
    openDeleteModal
  };

})(window);

