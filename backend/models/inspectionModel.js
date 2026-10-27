const pool = require("../db");

// Get all inspections
const getAllInspections = async () => {
    const result = await pool.query(
        "SELECT * FROM inspections ORDER BY id"
    );
    return result.rows;
};

// Add inspection
const createInspection = async (product_name, inspector_name, inspection_date, status) => {
    const result = await pool.query(
        `INSERT INTO inspections
        (product_name, inspector_name, inspection_date, status)
        VALUES($1,$2,$3,$4)
        RETURNING *`,
        [
            product_name,
            inspector_name,
            inspection_date,
            status
        ]
    );
    return result.rows[0];
};

// Update inspection
const updateInspection = async (id, product_name, inspector_name, inspection_date, status) => {
    const result = await pool.query(
        `UPDATE inspections
         SET product_name=$1,
             inspector_name=$2,
             inspection_date=$3,
             status=$4
         WHERE id=$5
         RETURNING *`,
        [
            product_name,
            inspector_name,
            inspection_date,
            status,
            id
        ]
    );
    return result.rows[0];
};

// Delete inspection
const deleteInspection = async (id) => {
    await pool.query(
        "DELETE FROM inspections WHERE id=$1",
        [id]
    );
};

module.exports = { getAllInspections, createInspection, updateInspection, deleteInspection };