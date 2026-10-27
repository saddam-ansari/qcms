const pool = require("../db");

// Get all defects
const getAllDefects = async () => {
    const result = await pool.query("SELECT * FROM defects ORDER BY id");
    return result.rows;
};

// Add defect
const createDefect = async (product_name, description, severity, status) => {
    const result = await pool.query(
        `INSERT INTO defects
        (product_name, description, severity, status)
        VALUES($1,$2,$3,$4)
        RETURNING *`,
        [
            product_name,
            description,
            severity,
            status
        ]
    );
    return result.rows[0];
};

// Update defect
const updateDefect = async (id, product_name, description, severity, status) => {
    const result = await pool.query(
        `UPDATE defects
         SET product_name=$1,
             description=$2,
             severity=$3,
             status=$4
         WHERE id=$5
         RETURNING *`,
        [
            product_name,
            description,
            severity,
            status,
            id,
        ]
    );
    return result.rows[0];
};

// Delete defect
const deleteDefect = async (id) => {
    await pool.query("DELETE FROM defects WHERE id=$1", [id]);
};


module.exports = { getAllDefects, createDefect, updateDefect, deleteDefect };