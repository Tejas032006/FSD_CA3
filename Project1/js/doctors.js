/**
 * ============================================================================
 * MEDIBOOK – DOCTORS DIRECTORY MODULE (doctors.js)
 * Handles Fetch API data retrieval, search, filter, and card DOM generation.
 * ============================================================================
 */

(function (window) {
  'use strict';

  // Internal state cache for loaded doctors
  let doctorsCache = [];
  let isFetching = false;

  // DOM Elements cache
  const elements = {
    grid: document.getElementById('doctors-grid'),
    loading: document.getElementById('doctors-loading'),
    error: document.getElementById('doctors-error'),
    errorMessage: document.getElementById('doctors-error-message'),
    retryBtn: document.getElementById('doctors-retry-btn'),
    emptyState: document.getElementById('doctors-empty-state'),
    emptyResetBtn: document.getElementById('doctor-empty-reset-btn'),
    searchInput: document.getElementById('doctor-search-input'),
    specializationFilter: document.getElementById('doctor-specialization-filter'),
    resetBtn: document.getElementById('doctor-reset-btn'),
    countBadge: document.getElementById('doctors-count-badge'),
    appointmentDoctorSelect: document.getElementById('appointment-doctor'),
    editAppointmentDoctorSelect: document.getElementById('edit-appointment-doctor'),
    selectedDoctorPreview: document.getElementById('selected-doctor-preview'),
    prevDocAvatar: document.getElementById('prev-doc-avatar'),
    prevDocName: document.getElementById('prev-doc-name'),
    prevDocSub: document.getElementById('prev-doc-sub'),
    prevDocTiming: document.getElementById('prev-doc-timing')
  };

  /**
   * Generates initials for doctor avatar (e.g. Dr. Sarah Jenkins -> SJ)
   * @param {string} name
   * @returns {string} 2-letter uppercase initials
   */
  function getInitials(name) {
    if (!name) return 'MD';
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  }

  /**
   * Doctor Service Object (Mock REST GET & retrieval)
   */
  const DoctorService = {
    /**
     * Retrieves doctors list from doctors.json using native fetch with async/await
     * @returns {Promise<Array>} Array of doctor objects
     */
    async fetchDoctors() {
      if (doctorsCache.length > 0) {
        return doctorsCache;
      }

      try {
        isFetching = true;
        showLoadingState();

        // Native fetch with explicit GET method configuration
        const response = await fetch('doctors.json', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: Failed to load practitioners (Status: ${response.status})`);
        }

        const data = await response.json();
        doctorsCache = Array.isArray(data) ? data : [];
        return doctorsCache;
      } catch (error) {
        console.error('DoctorService.fetchDoctors error:', error);
        throw error;
      } finally {
        isFetching = false;
        hideLoadingState();
      }
    },

    /**
     * Returns cached doctors
     */
    getAll() {
      return [...doctorsCache];
    },

    /**
     * Finds a doctor by their ID
     * @param {string} id
     */
    getById(id) {
      return doctorsCache.find(doc => doc.id === id) || null;
    }
  };

  /**
   * UI State Updaters
   */
  function showLoadingState() {
    if (elements.loading) elements.loading.classList.remove('hidden');
    if (elements.error) elements.error.classList.add('hidden');
    if (elements.emptyState) elements.emptyState.classList.add('hidden');
    if (elements.grid) elements.grid.innerHTML = '';
  }

  function hideLoadingState() {
    if (elements.loading) elements.loading.classList.add('hidden');
  }

  function showErrorState(message) {
    if (elements.error) {
      elements.error.classList.remove('hidden');
      if (elements.errorMessage) {
        elements.errorMessage.textContent = message || 'Unable to connect to doctors database.';
      }
    }
    if (elements.grid) elements.grid.innerHTML = '';
    if (elements.countBadge) elements.countBadge.textContent = 'Error loading doctors';
  }

  /**
   * Renders doctor profile cards dynamically into the DOM
   * @param {Array} doctors
   */
  function renderDoctorCards(doctors) {
    if (!elements.grid) return;
    elements.grid.innerHTML = '';

    if (!doctors || doctors.length === 0) {
      if (elements.emptyState) elements.emptyState.classList.remove('hidden');
      if (elements.countBadge) elements.countBadge.textContent = '0 specialists found';
      return;
    }

    if (elements.emptyState) elements.emptyState.classList.add('hidden');
    if (elements.countBadge) {
      elements.countBadge.textContent = `Showing ${doctors.length} of ${doctorsCache.length} specialists`;
    }

    const fragment = document.createDocumentFragment();

    doctors.forEach(doctor => {
      const card = document.createElement('article');
      card.className = 'doctor-card';
      card.setAttribute('data-id', doctor.id);
      card.setAttribute('data-specialization', doctor.specialization);

      const daysText = Array.isArray(doctor.availableDays)
        ? doctor.availableDays.map(d => d.slice(0, 3)).join(', ')
        : 'Mon - Fri';

      card.innerHTML = `
        <div class="doctor-card-top">
          <div class="doctor-avatar" aria-hidden="true">${getInitials(doctor.name)}</div>
          <div class="doctor-meta">
            <h3 class="doctor-name">${escapeHTML(doctor.name)}</h3>
            <span class="doctor-specialty">${escapeHTML(doctor.specialization)}</span>
            <div class="doctor-qualification">${escapeHTML(doctor.qualification || 'Specialist')}</div>
          </div>
        </div>

        <div class="doctor-badges-row">
          <span class="pill-exp">${doctor.experience}+ Years Experience</span>
          <span class="pill-rating">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            ${doctor.rating || '4.8'}
          </span>
        </div>

        <p class="doctor-bio">${escapeHTML(doctor.bio || 'Consultant specialist providing comprehensive diagnostic and treatment consultations.')}</p>

        <div class="doctor-schedule-box">
          <div class="schedule-row">
            <span>Consultation Days:</span>
            <strong>${escapeHTML(daysText)}</strong>
          </div>
          <div class="schedule-row">
            <span>OPD Hours:</span>
            <strong>${escapeHTML(doctor.availableTime || '09:00 AM - 01:00 PM')}</strong>
          </div>
          <div class="schedule-row">
            <span>Location:</span>
            <strong>Room ${escapeHTML(doctor.roomNo || 'OPD')}</strong>
          </div>
        </div>

        <div class="doctor-card-footer">
          <div class="doctor-fee">
            <span class="fee-label">Consultation Fee</span>
            <span class="fee-amount">&#8377;${doctor.consultationFee || 750}</span>
          </div>
          <button class="btn btn-primary btn-sm btn-book-doctor" data-doctor-id="${doctor.id}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Book Appointment</span>
          </button>
        </div>
      `;

      fragment.appendChild(card);
    });

    elements.grid.appendChild(fragment);

    // Attach event listeners to all "Book Appointment" buttons on cards
    const bookButtons = elements.grid.querySelectorAll('.btn-book-doctor');
    bookButtons.forEach(btn => {
      btn.addEventListener('click', handleBookDoctorClick);
    });
  }

  /**
   * Populates specialization filter dropdown based on available doctors
   */
  function populateSpecializationFilter(doctors) {
    if (!elements.specializationFilter) return;

    const specializations = new Set();
    doctors.forEach(doc => {
      if (doc.specialization) specializations.add(doc.specialization.trim());
    });

    // Clear existing dynamic options (keep first "all" option)
    elements.specializationFilter.innerHTML = '<option value="all">All Specializations</option>';

    Array.from(specializations).sort().forEach(spec => {
      const opt = document.createElement('option');
      opt.value = spec;
      opt.textContent = spec;
      elements.specializationFilter.appendChild(opt);
    });
  }

  /**
   * Populates appointment form doctor dropdowns
   */
  function populateDoctorDropdowns(doctors) {
    const targets = [
      elements.appointmentDoctorSelect,
      elements.editAppointmentDoctorSelect
    ];

    targets.forEach(select => {
      if (!select) return;

      const currentVal = select.value;
      select.innerHTML = '<option value="">-- Choose a Consulting Doctor --</option>';

      doctors.forEach(doc => {
        const opt = document.createElement('option');
        opt.value = doc.id;
        opt.textContent = `${doc.name} (${doc.specialization}) - Room ${doc.roomNo || 'OPD'}`;
        opt.setAttribute('data-name', doc.name);
        opt.setAttribute('data-spec', doc.specialization);
        select.appendChild(opt);
      });

      if (currentVal) {
        select.value = currentVal;
      }
    });
  }

  /**
   * Updates quick preview widget under doctor select in booking form
   */
  function updateDoctorPreview(doctorId) {
    if (!elements.selectedDoctorPreview) return;

    if (!doctorId) {
      elements.selectedDoctorPreview.classList.add('hidden');
      return;
    }

    const doctor = DoctorService.getById(doctorId);
    if (!doctor) {
      elements.selectedDoctorPreview.classList.add('hidden');
      return;
    }

    if (elements.prevDocAvatar) elements.prevDocAvatar.textContent = getInitials(doctor.name);
    if (elements.prevDocName) elements.prevDocName.textContent = doctor.name;
    if (elements.prevDocSub) elements.prevDocSub.textContent = `${doctor.specialization} • Room ${doctor.roomNo || 'OPD'}`;
    if (elements.prevDocTiming) elements.prevDocTiming.textContent = `Fee: ₹${doctor.consultationFee} | Hours: ${doctor.availableTime}`;

    elements.selectedDoctorPreview.classList.remove('hidden');
  }

  /**
   * Filters and renders doctors based on search text and specialization
   */
  function filterAndRender() {
    const query = (elements.searchInput ? elements.searchInput.value : '').trim().toLowerCase();
    const spec = (elements.specializationFilter ? elements.specializationFilter.value : 'all');

    const filtered = doctorsCache.filter(doc => {
      const matchesSpec = (spec === 'all' || doc.specialization === spec);

      const matchesQuery = !query || (
        doc.name.toLowerCase().includes(query) ||
        doc.specialization.toLowerCase().includes(query) ||
        (doc.qualification && doc.qualification.toLowerCase().includes(query)) ||
        (doc.bio && doc.bio.toLowerCase().includes(query))
      );

      return matchesSpec && matchesQuery;
    });

    renderDoctorCards(filtered);
  }

  /**
   * Event handler when clicking "Book Appointment" on a doctor card
   */
  function handleBookDoctorClick(e) {
    const btn = e.currentTarget;
    const docId = btn.getAttribute('data-doctor-id');

    if (!docId) return;

    // Switch to booking section via MediBook app router
    if (window.MediBook && typeof window.MediBook.navigateToSection === 'function') {
      window.MediBook.navigateToSection('book');
    }

    // Set select value
    if (elements.appointmentDoctorSelect) {
      elements.appointmentDoctorSelect.value = docId;
      // Trigger change event to refresh preview & validation
      elements.appointmentDoctorSelect.dispatchEvent(new Event('change', { bubbles: true }));
      // Focus on patient name to start form filling
      const nameInput = document.getElementById('patient-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 150);
      }
    }
  }

  /**
   * Reset filters
   */
  function resetFilters() {
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.specializationFilter) elements.specializationFilter.value = 'all';
    filterAndRender();
  }

  /**
   * HTML escape utility
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
   * Attaches event listeners for doctor search & filtering
   */
  function bindEvents() {
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', filterAndRender);
    }

    if (elements.specializationFilter) {
      elements.specializationFilter.addEventListener('change', filterAndRender);
    }

    if (elements.resetBtn) {
      elements.resetBtn.addEventListener('click', resetFilters);
    }

    if (elements.emptyResetBtn) {
      elements.emptyResetBtn.addEventListener('click', resetFilters);
    }

    if (elements.retryBtn) {
      elements.retryBtn.addEventListener('click', initDoctors);
    }

    // Quick preview update on doctor selection in booking form
    if (elements.appointmentDoctorSelect) {
      elements.appointmentDoctorSelect.addEventListener('change', (e) => {
        updateDoctorPreview(e.target.value);
      });
    }
  }

  /**
   * Initializes doctor data fetching and UI rendering
   */
  async function initDoctors() {
    try {
      const doctors = await DoctorService.fetchDoctors();
      renderDoctorCards(doctors);
      populateSpecializationFilter(doctors);
      populateDoctorDropdowns(doctors);
    } catch (err) {
      showErrorState(err.message);
    }
  }

  // Bind initial events
  bindEvents();

  // Expose public API
  window.DoctorModule = {
    init: initDoctors,
    service: DoctorService,
    populateDropdowns: populateDoctorDropdowns,
    updatePreview: updateDoctorPreview
  };

})(window);
