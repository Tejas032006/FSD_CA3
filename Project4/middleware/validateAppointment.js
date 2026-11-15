/**
 * Appointment Validation Middleware
 * Validates presence and format of required appointment fields for POST and PUT requests.
 */
function validateAppointment(req, res, next) {
  const { patientName, age, doctor, appointmentDate, appointmentTime, reason } = req.body;

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Request body must be a valid JSON object'
    });
  }

  // 1. Patient Name Validation
  if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Field "patientName" is required and must be at least 3 characters long'
    });
  }

  // 2. Age Validation
  const numericAge = Number(age);
  if (age === undefined || age === null || isNaN(numericAge) || numericAge <= 0 || numericAge > 120) {
    return res.status(400).json({
      success: false,
      error: 'Field "age" is required and must be a valid number between 1 and 120'
    });
  }

  // 3. Doctor Name Validation
  if (!doctor || typeof doctor !== 'string' || !doctor.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Field "doctor" is required and cannot be empty'
    });
  }

  // 4. Appointment Date Validation
  if (!appointmentDate || typeof appointmentDate !== 'string' || !appointmentDate.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Field "appointmentDate" is required (format: YYYY-MM-DD)'
    });
  }

  // 5. Appointment Time Validation
  if (!appointmentTime || typeof appointmentTime !== 'string' || !appointmentTime.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Field "appointmentTime" is required (e.g. 10:00 AM)'
    });
  }

  // 6. Reason Validation
  if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Field "reason" is required and must be at least 5 characters long'
    });
  }

  next();
}

module.exports = validateAppointment;
