/**
 * ============================================================================
 * MEDIBOOK FULL STACK APPLICATION – BACKEND SERVER
 * Program 5: Express.js, PostgreSQL with Sequelize, CORS, and REST API
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, Appointment } = require('./models/index.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler.js');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration (Allow frontend requests from Vite dev server and production domains)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman) or matched origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback to permissive CORS for dev testing
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check / API overview endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediBook PostgreSQL Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      getAll: 'GET /api/appointments',
      create: 'POST /api/appointments',
      update: 'PUT /api/appointments/:id',
      delete: 'DELETE /api/appointments/:id'
    }
  });
});

// Mount appointment routes
app.use('/api/appointments', appointmentRoutes);

// Catch-all 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

/**
 * Seeds initial clinical appointments if the database table is empty.
 * Ensures the dashboard and management listing are populated on first launch.
 */
async function seedInitialData() {
  try {
    const count = await Appointment.count();
    if (count === 0) {
      console.log('[DATABASE] Seeding initial sample hospital appointments...');
      await Appointment.bulkCreate([
        {
          patientName: 'Eleanor Vance',
          age: 38,
          email: 'eleanor.vance@example.com',
          mobile: '9876541200',
          doctor: 'Dr. Sarah Jenkins (Cardiology)',
          appointmentDate: '2026-11-18',
          appointmentTime: '10:00 AM',
          reason: 'Follow-up consultation for blood pressure stabilization and annual ECG review.',
          status: 'Scheduled'
        },
        {
          patientName: 'Marcus Sterling',
          age: 52,
          email: 'marcus.sterling@example.com',
          mobile: '9812345678',
          doctor: 'Dr. Rajesh Sharma (Neurology)',
          appointmentDate: '2026-11-16',
          appointmentTime: '11:30 AM',
          reason: 'Recurring migraine episodes and persistent tension headaches over 3 weeks.',
          status: 'Scheduled'
        },
        {
          patientName: 'Aarav Sharma',
          age: 7,
          email: 'sharma.family@example.com',
          mobile: '9823456789',
          doctor: 'Dr. Priya Nair (Pediatrics)',
          appointmentDate: '2026-11-12',
          appointmentTime: '09:30 AM',
          reason: 'Routine childhood immunization booster shot and developmental checkup.',
          status: 'Completed'
        },
        {
          patientName: 'Rohit Verma',
          age: 44,
          email: 'rohit.verma@example.com',
          mobile: '9765432109',
          doctor: 'Dr. Michael Chang (Orthopedics)',
          appointmentDate: '2026-11-11',
          appointmentTime: '02:00 PM',
          reason: 'Right knee arthroscopy follow-up and physical therapy progress assessment.',
          status: 'Completed'
        },
        {
          patientName: 'Natasha Gupta',
          age: 29,
          email: 'natasha.gupta@example.com',
          mobile: '9988776655',
          doctor: 'Dr. Ananya Sengupta (Dermatology)',
          appointmentDate: '2026-11-10',
          appointmentTime: '03:30 PM',
          reason: 'Patient had emergency travel; requested cancellation and rescheduling for next month.',
          status: 'Cancelled'
        }
      ]);
      console.log('[DATABASE] Seed data inserted successfully.');
    }
  } catch (err) {
    console.warn('[DATABASE SEED WARNING] Could not seed initial data:', err.message);
  }
}

// Start Server and Synchronize Sequelize Database
let server;

async function startServer() {
  try {
    // Authenticate and sync with PostgreSQL
    await sequelize.authenticate();
    console.log('[DATABASE] PostgreSQL database connection established successfully.');

    await sequelize.sync();
    console.log('[DATABASE] Models synchronized with PostgreSQL schema.');

    await seedInitialData();

    server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(` MediBook Express Backend running on port ${PORT}`);
      console.log(` Local URL: http://localhost:${PORT}`);
      console.log(` Database: PostgreSQL via Sequelize ORM`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('[DATABASE ERROR] Failed to connect to PostgreSQL:', error.message);
    console.log('[BACKEND] Starting HTTP server in degraded mode to allow health checks...');
    server = app.listen(PORT, () => {
      console.log(`[BACKEND] Server listening on port ${PORT} (Database pending connection)`);
    });
  }
}

// Start server if executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, sequelize };

