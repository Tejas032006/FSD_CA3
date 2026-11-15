/**
 * API Service for MediBook Frontend
 * Communicates with the Express.js & PostgreSQL backend via native fetch.
 */

const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

/**
 * Fetch all appointments from the backend (GET /api/appointments)
 */
export async function getAppointments() {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch appointments (Status: ${response.status})`);
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Create a new appointment in PostgreSQL (POST /api/appointments)
 */
export async function createAppointment(appointmentData) {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Failed to schedule appointment (Status: ${response.status})`);
  }

  return result.data;
}

/**
 * Update appointment status (PUT /api/appointments/:id)
 */
export async function updateAppointmentStatus(id, newStatus) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ status: newStatus })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Failed to update status (Status: ${response.status})`);
  }

  return result.data;
}

/**
 * Update full appointment details (PUT /api/appointments/:id)
 */
export async function updateAppointment(id, updateData) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Failed to update appointment (Status: ${response.status})`);
  }

  return result.data;
}

/**
 * Delete an appointment from PostgreSQL (DELETE /api/appointments/:id)
 */
export async function deleteAppointment(id) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Failed to delete appointment (Status: ${response.status})`);
  }

  return result.data;
}

