const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

/**
 * Appointment Model Definition
 * Represents hospital appointment records stored in PostgreSQL via Sequelize.
 */
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Patient name cannot be empty' },
      len: { args: [3, 100], msg: 'Patient name must be between 3 and 100 characters' }
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Age must be an integer' },
      min: { args: [1], msg: 'Age must be at least 1' },
      max: { args: [120], msg: 'Age cannot exceed 120' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: 'Please enter a valid email address' }
    }
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Mobile number cannot be empty' }
    }
  },
  doctor: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Doctor name/specialty cannot be empty' }
    }
  },
  appointmentDate: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Appointment date is required' }
    }
  },
  appointmentTime: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Appointment time slot is required' }
    }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Reason for consultation is required' }
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Scheduled',
    validate: {
      isIn: {
        args: [['Scheduled', 'Completed', 'Cancelled']],
        msg: 'Status must be Scheduled, Completed, or Cancelled'
      }
    }
  }
}, {
  tableName: 'appointments',
  timestamps: true
});

module.exports = Appointment;

