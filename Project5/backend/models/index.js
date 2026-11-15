const sequelize = require('../config/database.js');
const Appointment = require('./Appointment.js');

const db = {
  sequelize,
  Appointment
};

module.exports = db;

