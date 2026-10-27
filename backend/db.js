// Import the PostgreSQL package
const { Pool } = require("pg");

// Create a connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Export the pool so it can be used in other files
module.exports = pool;