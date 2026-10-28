
const { Pool } = require("pg");

// Create a connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,

    // Enable SSL for the hosted database when configured
    ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: true }
        : false
});

module.exports = pool;
