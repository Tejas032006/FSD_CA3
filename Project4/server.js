/**
 * ============================================================================
 * MEDIBOOK – HOSPITAL APPOINTMENT REST API (EXPRESS.JS)
 * Program 4: Express Server with JWT Authentication and Middleware
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('./middleware/logger.js');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler.js');
const authRoutes = require('./routes/authRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');

const app = express();
const PORT = process.env.PORT || 4000;

// Built-in middleware to parse incoming JSON request bodies
app.use(express.json());

// Custom request logging middleware (Method, URL, Timestamp)
app.use(logger);

// Root Health & API Overview Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to MediBook Hospital Appointment REST API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      appointments: {
        getAll: 'GET /api/appointments (Protected)',
        create: 'POST /api/appointments (Protected)',
        update: 'PUT /api/appointments/:id (Protected)',
        delete: 'DELETE /api/appointments/:id (Protected)'
      }
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Catch-all 404 Route Not Found Middleware
app.use(notFoundHandler);

// Centralized Error-Handling Middleware
app.use(errorHandler);

// Start Express Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(` MediBook Express API running on port ${PORT}`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Authentication: JWT Bearer Tokens`);
  console.log('====================================================');
});

module.exports = { app, server };

