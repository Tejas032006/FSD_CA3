/**
 * Appointment Validation Middleware
 * Checks required fields and ensures clean data before Sequelize persistence.
 */
function validateAppointment(req, res, next) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Request body must be a valid JSON object'
    });
  }

  // Normalize field names: accept both 'mobile'/'phone' and 'doctor'/'doctorName'
  if (req.body.phone && !req.body.mobile) {
    req.body.mobile = req.body.phone;
  }
  if (req.body.doctorName && !req.body.doctor) {
    req.body.doctor = req.body.doctorName;
  }

  const { patientName, age, email, mobile, doctor, appointmentDate, appointmentTime, reason } = req.body;

  // 1. Patient Name
  if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Field "patientName" is required and must be at least 3 characters long'
    });
  }

  // 2. Age
  const numericAge = Number(age);
  if (age === undefined || age === null || isNaN(numericAge) || numericAge <= 0 || numericAge > 120) {
    return res.status(400).json({
      success: false,
      error: 'Field "age" is required and must be a valid number between 1 and 120'
    });
  }

  // 3. Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Field "email" is required and must be a valid email address'
    });
  }

  // 4. Mobile Number
  const cleanMobile = String(mobile || '').trim().replace(/\D/g, '');
  if (!cleanMobile || cleanMobile.length !== 10) {
    return res.status(400).json({
      success: false,
      error: 'Field "mobile" is required and must be exactly 10 digits'
    });
  }

  // 5. Doctor
  if (!doctor || typeof doctor !== 'string' || !doctor.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Field "doctor" is required and cannot be empty'
    });
  }

  // 6. Appointment Date
  if (!appointmentDate || typeof appointmentDate !== 'string' || !appointmentDate.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Field "appointmentDate" is required'
    });
  }

  // 7. Appointment Time
  if (!appointmentTime || typeof appointmentTime !== 'string' || !appointmentTime.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Field "appointmentTime" is required'
    });
  }

  // 8. Reason
  if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Field "reason" is required and must be at least 5 characters long'
    });
  }

  next();
}

module.exports = validateAppointment;

