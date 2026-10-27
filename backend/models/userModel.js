// Import database connection
const pool = require("../db");


// Find user by email
const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
    return result.rows[0];
};

// Create new user
const createUser = async (name, email, password, role) => {
    const result = await pool.query(
        `INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *`,
        [name, email, password, role]
    );
    return result.rows[0];
};


module.exports = { findUserByEmail, createUser };