/**
 * ============================================================================
 * MEDIBOOK – HOSPITAL APPOINTMENT MANAGEMENT SYSTEM
 * Program 3: Node.js Server-Side Utility
 * 
 * Built strictly with Node.js built-in modules:
 * - http: Native HTTP server handling REST endpoints without Express
 * - fs: File System module storing and reading records from JSON
 * - path: Safe cross-platform file path resolution
 * - stream: Writable stream pipeline processing request data in chunks
 * - events: EventEmitter broadcasting appointment notifications
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');
const EventEmitter = require('events');

// Server configuration
const PORT = process.env.PORT || 3000;

// Resolve data directory and file paths using path.join() and __dirname
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'appointments.json');

// Initialize EventEmitter for hospital appointment notifications
class AppointmentNotifier extends EventEmitter { }
const notifier = new AppointmentNotifier();

// Notification Event Listeners
notifier.on('created', (appointment) => {
  console.log(`[NOTIFICATION] New appointment created: ID ${appointment.id} for ${appointment.patientName} with ${appointment.doctor}`);
});

notifier.on('updated', (appointment) => {
  console.log(`[NOTIFICATION] Appointment updated: ID ${appointment.id} for ${appointment.patientName}`);
});

notifier.on('deleted', (id) => {
  console.log(`[NOTIFICATION] Appointment cancelled/deleted: ID ${id}`);
});

/**
 * Ensures the data directory and appointments.json file exist.
 * If missing, initializes safely with an empty array.
 */
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
      console.log('[FILE SYSTEM] Initialized empty data/appointments.json');
    }
  } catch (err) {
    console.error('[FILE SYSTEM ERROR] Failed to initialize storage:', err.message);
  }
}

/**
 * Reads all appointment records from data/appointments.json.
 * @returns {Array} Array of appointment objects
 */
function readAppointments() {
  ensureDataFile();
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    if (!rawData.trim()) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[FILE SYSTEM ERROR] Failed reading appointments:', err.message);
    return [];
  }
}

/**
 * Writes appointment records to data/appointments.json.
 * @param {Array} appointments - Array of appointment objects to persist
 */
function writeAppointments(appointments) {
  ensureDataFile();
  try {
    const serialized = JSON.stringify(appointments, null, 2);
    fs.writeFileSync(DATA_FILE, serialized, 'utf8');
    return true;
  } catch (err) {
    console.error('[FILE SYSTEM ERROR] Failed writing appointments:', err.message);
    throw err;
  }
}

/**
 * Processes incoming request body using a Node.js Writable Stream.
 * Collects incoming request chunks, handles stream errors, and parses JSON.
 * @param {http.IncomingMessage} req - Incoming HTTP request stream
 * @returns {Promise<Object>} Resolves with parsed JSON payload
 */
function parseStreamBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalSize = 0;
    const MAX_SIZE = 1e6; // 1MB payload limit

    // Custom Writable Stream to process chunks
    const bodyStream = new Writable({
      write(chunk, encoding, callback) {
        totalSize += chunk.length;
        if (totalSize > MAX_SIZE) {
          const err = new Error('Payload Too Large');
          err.statusCode = 413;
          callback(err);
          return;
        }
        chunks.push(chunk);
        callback();
      }
    });

    // Handle stream errors
    req.on('error', (err) => reject(err));
    bodyStream.on('error', (err) => reject(err));

    // When writing finishes, concatenate chunks and parse JSON
    bodyStream.on('finish', () => {
      const rawText = Buffer.concat(chunks).toString('utf8').trim();
      if (!rawText) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(rawText);
        resolve(parsed);
      } catch (parseError) {
        const err = new Error('Invalid JSON format in request body');
        err.statusCode = 400;
        reject(err);
      }
    });

    // Pipe incoming request stream into the writable stream
    req.pipe(bodyStream);
  });
}

/**
 * Validates mandatory appointment fields.
 * Required: patientName, age, doctor, appointmentDate, appointmentTime, reason
 * @param {Object} data - Appointment data payload
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validateAppointment(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object' };
  }

  const { patientName, age, doctor, appointmentDate, appointmentTime, reason } = data;

  if (!patientName || typeof patientName !== 'string' || !patientName.trim()) {
    return { isValid: false, error: 'Field "patientName" is required and must be a non-empty string' };
  }

  const numericAge = Number(age);
  if (age === undefined || age === null || isNaN(numericAge) || numericAge <= 0 || numericAge > 120) {
    return { isValid: false, error: 'Field "age" is required and must be a valid positive number between 1 and 120' };
  }

  if (!doctor || typeof doctor !== 'string' || !doctor.trim()) {
    return { isValid: false, error: 'Field "doctor" is required and must be a non-empty string' };
  }

  if (!appointmentDate || typeof appointmentDate !== 'string' || !appointmentDate.trim()) {
    return { isValid: false, error: 'Field "appointmentDate" is required (format: YYYY-MM-DD)' };
  }

  if (!appointmentTime || typeof appointmentTime !== 'string' || !appointmentTime.trim()) {
    return { isValid: false, error: 'Field "appointmentTime" is required (e.g. 10:00 AM)' };
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return { isValid: false, error: 'Field "reason" is required and must be a non-empty string' };
  }

  return { isValid: true, error: null };
}

/**
 * Helper to send standardized JSON HTTP responses.
 * @param {http.ServerResponse} res
 * @param {number} statusCode
 * @param {Object} payload
 */
function sendJSON(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload, null, 2));
}

/**
 * Generates next unique appointment ID.
 * @param {Array} appointments
 * @returns {number}
 */
function generateNextId(appointments) {
  if (!appointments || appointments.length === 0) return 1;
  const maxId = appointments.reduce((max, appt) => {
    const numId = Number(appt.id);
    return !isNaN(numId) && numId > max ? numId : max;
  }, 0);
  return maxId + 1;
}

/**
 * Main HTTP Request Handler
 */
const server = http.createServer(async (req, res) => {
  const method = req.method;
  const url = req.url.split('?')[0]; // Strip query strings

  // Handle CORS preflight options request
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  console.log(`[HTTP ${method}] ${url}`);

  try {
    // ------------------------------------------------------------------------
    // ROUTE: GET /appointments (Retrieve all appointments)
    // ------------------------------------------------------------------------
    if (method === 'GET' && url === '/appointments') {
      const appointments = readAppointments();
      return sendJSON(res, 200, {
        success: true,
        count: appointments.length,
        data: appointments
      });
    }

    // ------------------------------------------------------------------------
    // ROUTE: POST /appointments (Add a new appointment)
    // ------------------------------------------------------------------------
    if (method === 'POST' && url === '/appointments') {
      const body = await parseStreamBody(req);
      const validation = validateAppointment(body);

      if (!validation.isValid) {
        return sendJSON(res, 400, {
          success: false,
          error: validation.error
        });
      }

      const appointments = readAppointments();
      const newAppointment = {
        id: generateNextId(appointments),
        patientName: body.patientName.trim(),
        age: Number(body.age),
        doctor: body.doctor.trim(),
        appointmentDate: body.appointmentDate.trim(),
        appointmentTime: body.appointmentTime.trim(),
        reason: body.reason.trim()
      };

      appointments.push(newAppointment);
      writeAppointments(appointments);

      // Emit notification event
      notifier.emit('created', newAppointment);

      return sendJSON(res, 201, {
        success: true,
        message: 'Appointment successfully created',
        data: newAppointment
      });
    }

    // ------------------------------------------------------------------------
    // ROUTE: PUT /appointments/:id (Update an existing appointment)
    // ------------------------------------------------------------------------
    const updateMatch = url.match(/^\/appointments\/([^\/]+)$/);
    if (method === 'PUT' && updateMatch) {
      const targetId = updateMatch[1];
      const body = await parseStreamBody(req);
      const validation = validateAppointment(body);

      if (!validation.isValid) {
        return sendJSON(res, 400, {
          success: false,
          error: validation.error
        });
      }

      const appointments = readAppointments();
      const index = appointments.findIndex((item) => String(item.id) === String(targetId));

      if (index === -1) {
        return sendJSON(res, 404, {
          success: false,
          error: `Appointment with ID ${targetId} not found`
        });
      }

      // Update appointment preserving original ID
      const updatedRecord = {
        id: appointments[index].id,
        patientName: body.patientName.trim(),
        age: Number(body.age),
        doctor: body.doctor.trim(),
        appointmentDate: body.appointmentDate.trim(),
        appointmentTime: body.appointmentTime.trim(),
        reason: body.reason.trim()
      };

      appointments[index] = updatedRecord;
      writeAppointments(appointments);

      // Emit notification event
      notifier.emit('updated', updatedRecord);

      return sendJSON(res, 200, {
        success: true,
        message: `Appointment with ID ${targetId} successfully updated`,
        data: updatedRecord
      });
    }

    // ------------------------------------------------------------------------
    // ROUTE: DELETE /appointments/:id (Remove an appointment)
    // ------------------------------------------------------------------------
    const deleteMatch = url.match(/^\/appointments\/([^\/]+)$/);
    if (method === 'DELETE' && deleteMatch) {
      const targetId = deleteMatch[1];
      const appointments = readAppointments();
      const index = appointments.findIndex((item) => String(item.id) === String(targetId));

      if (index === -1) {
        return sendJSON(res, 404, {
          success: false,
          error: `Cannot delete: Appointment with ID ${targetId} not found`
        });
      }

      const removed = appointments.splice(index, 1)[0];
      writeAppointments(appointments);

      // Emit notification event
      notifier.emit('deleted', targetId);

      return sendJSON(res, 200, {
        success: true,
        message: `Appointment with ID ${targetId} successfully removed`,
        data: removed
      });
    }

    // ------------------------------------------------------------------------
    // Root or Welcome overview
    // ------------------------------------------------------------------------
    if (url === '/' && method === 'GET') {
      return sendJSON(res, 200, {
        name: 'MediBook Node.js Server-Side Utility',
        version: '1.0.0',
        endpoints: {
          'GET /appointments': 'Retrieve all hospital appointment records',
          'POST /appointments': 'Add a new hospital appointment',
          'PUT /appointments/:id': 'Update an existing hospital appointment by ID',
          'DELETE /appointments/:id': 'Delete a hospital appointment by ID'
        }
      });
    }

    // ------------------------------------------------------------------------
    // 404 Not Found for any other endpoint
    // ------------------------------------------------------------------------
    return sendJSON(res, 404, {
      success: false,
      error: `Endpoint '${method} ${url}' not found`
    });

  } catch (err) {
    console.error('[SERVER ERROR]', err);
    const statusCode = err.statusCode || 500;
    return sendJSON(res, statusCode, {
      success: false,
      error: err.message || 'Internal Server Error'
    });
  }
});

// Ensure data storage directory exists before listening
ensureDataFile();

// Start the server
server.listen(PORT, () => {
  console.log('====================================================');
  console.log(` MediBook Node.js Server running on port ${PORT}`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Data file: ${DATA_FILE}`);
  console.log('====================================================');
});

// Export server instance for programmatic testing if needed
module.exports = server;

