const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

let sequelize;

// If DATABASE_URL is provided (e.g. on Render, Neon, Supabase, or Railway)
if (process.env.DATABASE_URL) {
  const isProduction = process.env.NODE_ENV === 'production';
  const requiresSSL = isProduction || process.env.DATABASE_URL.includes('ssl');

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: requiresSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
  });
} else if (process.env.DB_DIALECT === 'sqlite') {
  // Optional local SQLite fallback for testing environments without a live PostgreSQL instance
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
  });
} else {
  // Standard PostgreSQL connection using individual environment variables
  sequelize = new Sequelize(
    process.env.DB_NAME || 'medibook_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;

