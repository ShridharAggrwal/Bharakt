const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL for connection (supports both local and production)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }  // Required for Render
    : false  // No SSL for local PostgreSQL
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

module.exports = pool;