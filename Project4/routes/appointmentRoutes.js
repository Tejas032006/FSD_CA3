const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authenticateToken = require('../middleware/auth.js');
const validateAppointment = require('../middleware/validateAppointment.js');

// Path to appointments.json persistence file
const APPOINTMENTS_FILE = path.join(__dirname, '..', 'data', 'appointments.json');

/**
 * Ensures appointments.json exists on disk
 */
function ensureAppointmentsFile() {
  const dataDir = path.dirname(APPOINTMENTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(APPOINTMENTS_FILE)) {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Reads appointments from disk
 */
function readAppointments() {
  ensureAppointmentsFile();
  try {
    const raw = fs.readFileSync(APPOINTMENTS_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading appointments file:', err.message);
    return [];
  }
}

/**
 * Persists appointments to disk
 */
function writeAppointments(appointments) {
  ensureAppointmentsFile();
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), 'utf8');
}

/**
 * Generates next unique appointment ID
 */
function getNextId(appointments) {
  if (!appointments || appointments.length === 0) return 1;
  const max = appointments.reduce((highest, item) => {
    const num = Number(item.id);
    return !isNaN(num) && num > highest ? num : highest;
  }, 0);
  return max + 1;
}

// Protect all routes in this router with JWT Authentication
router.use(authenticateToken);

/**
 * GET /api/appointments
 * Retrieves all hospital appointment records
 */
router.get('/', (req, res, next) => {
  try {
    const appointments = readAppointments();
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/appointments
 * Creates a new appointment record (validated by validateAppointment middleware)
 */
router.post('/', validateAppointment, (req, res, next) => {
  try {
    const { patientName, age, doctor, appointmentDate, appointmentTime, reason } = req.body;
    const appointments = readAppointments();

    const newAppointment = {
      id: getNextId(appointments),
      patientName: patientName.trim(),
      age: Number(age),
      doctor: doctor.trim(),
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      reason: reason.trim(),
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    writeAppointments(appointments);

    return res.status(201).json({
      success: true,
      message: 'Appointment successfully created',
      data: newAppointment
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/appointments/:id
 * Updates an existing appointment by ID (validated by validateAppointment middleware)
 */
router.put('/:id', validateAppointment, (req, res, next) => {
  try {
    const targetId = req.params.id;
    const { patientName, age, doctor, appointmentDate, appointmentTime, reason } = req.body;
    const appointments = readAppointments();

    const index = appointments.findIndex(item => String(item.id) === String(targetId));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Appointment with ID ${targetId} not found`
      });
    }

    const existing = appointments[index];
    const updated = {
      ...existing,
      patientName: patientName.trim(),
      age: Number(age),
      doctor: doctor.trim(),
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      reason: reason.trim(),
      updatedAt: new Date().toISOString()
    };

    appointments[index] = updated;
    writeAppointments(appointments);

    return res.status(200).json({
      success: true,
      message: `Appointment with ID ${targetId} successfully updated`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/appointments/:id
 * Removes an appointment record by ID
 */
router.delete('/:id', (req, res, next) => {
  try {
    const targetId = req.params.id;
    const appointments = readAppointments();

    const index = appointments.findIndex(item => String(item.id) === String(targetId));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Cannot delete: Appointment with ID ${targetId} not found`
      });
    }

    const removed = appointments.splice(index, 1)[0];
    writeAppointments(appointments);

    return res.status(200).json({
      success: true,
      message: `Appointment with ID ${targetId} successfully removed`,
      data: removed
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

