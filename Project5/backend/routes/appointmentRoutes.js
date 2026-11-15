const express = require('express');
const router = express.Router();
const { Appointment } = require('../models/index.js');
const validateAppointment = require('../middleware/validateAppointment.js');

/**
 * GET /api/appointments
 * Retrieves all appointment records from PostgreSQL via Sequelize
 */
router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['appointmentDate', 'ASC'], ['id', 'DESC']]
    });

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
 * GET /api/appointments/:id
 * Retrieves a single appointment record by primary key ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: `Appointment with ID ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/appointments
 * Creates a new appointment record in PostgreSQL
 */
router.post('/', validateAppointment, async (req, res, next) => {
  try {
    const {
      patientName,
      age,
      email,
      mobile,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      status
    } = req.body;

    const newAppointment = await Appointment.create({
      patientName: patientName.trim(),
      age: Number(age),
      email: email.trim().toLowerCase(),
      mobile: String(mobile).trim(),
      doctor: doctor.trim(),
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      reason: reason.trim(),
      status: status || 'Scheduled'
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment successfully scheduled in PostgreSQL',
      data: newAppointment
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/appointments/:id
 * Updates an existing appointment record or changes its status
 */
router.put('/:id', async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const appointment = await Appointment.findByPk(targetId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: `Appointment with ID ${targetId} not found`
      });
    }

    // If only updating status (e.g. from table status dropdown)
    if (req.body.status && Object.keys(req.body).length === 1) {
      const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          error: 'Status must be Scheduled, Completed, or Cancelled'
        });
      }

      await appointment.update({ status: req.body.status });
      return res.status(200).json({
        success: true,
        message: `Appointment status updated to ${req.body.status}`,
        data: appointment
      });
    }

    // Full update with validation
    const {
      patientName,
      age,
      email,
      mobile,
      phone,
      doctor,
      doctorName,
      appointmentDate,
      appointmentTime,
      reason,
      status
    } = req.body;

    await appointment.update({
      patientName: patientName !== undefined ? patientName.trim() : appointment.patientName,
      age: age !== undefined ? Number(age) : appointment.age,
      email: email !== undefined ? email.trim().toLowerCase() : appointment.email,
      mobile: mobile !== undefined ? String(mobile).trim() : (phone !== undefined ? String(phone).trim() : appointment.mobile),
      doctor: doctor !== undefined ? doctor.trim() : (doctorName !== undefined ? doctorName.trim() : appointment.doctor),
      appointmentDate: appointmentDate !== undefined ? appointmentDate.trim() : appointment.appointmentDate,
      appointmentTime: appointmentTime !== undefined ? appointmentTime.trim() : appointment.appointmentTime,
      reason: reason !== undefined ? reason.trim() : appointment.reason,
      status: status !== undefined ? status : appointment.status
    });

    return res.status(200).json({
      success: true,
      message: `Appointment ${targetId} successfully updated`,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/appointments/:id
 * Removes an appointment record from PostgreSQL
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const appointment = await Appointment.findByPk(targetId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: `Cannot delete: Appointment with ID ${targetId} not found`
      });
    }

    await appointment.destroy();

    return res.status(200).json({
      success: true,
      message: `Appointment ${targetId} deleted successfully`,
      data: { id: Number(targetId) }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

