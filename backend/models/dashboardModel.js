// Import PostgreSQL connection
const pool = require("../db");

// Get dashboard statistics
const getDashboardData = async () => {
    const result = await pool.query(`
        WITH inspection_counts AS (
            SELECT
                COUNT(*) AS total_inspection,
                COUNT(*) FILTER (WHERE status = 'Completed') AS completed_inspection,
                COUNT(*) FILTER (WHERE status = 'Pending') AS pending_inspection
            FROM inspections
        ),
        defect_counts AS (
            SELECT
                COUNT(*) AS total_defects,
                COUNT(*) FILTER (WHERE status = 'Completed') AS completed_defects,
                COUNT(*) FILTER (WHERE status = 'Pending') AS pending_defects,
                COUNT(*) FILTER (WHERE severity = 'Low') AS low_severity,
                COUNT(*) FILTER (WHERE severity = 'Medium') AS medium_severity,
                COUNT(*) FILTER (WHERE severity = 'High') AS high_severity
            FROM defects
        )
        SELECT *
        FROM inspection_counts
        CROSS JOIN defect_counts
    `);
    const counts = result.rows[0];

    return {
        totalInspection: Number(counts.total_inspection),
        completedInspection: Number(counts.completed_inspection),
        pendingInspection: Number(counts.pending_inspection),
        totalDefects: Number(counts.total_defects),
        completedDefects: Number(counts.completed_defects),
        pendingDefects: Number(counts.pending_defects),
        lowSeverity: Number(counts.low_severity),
        mediumSeverity: Number(counts.medium_severity),
        highSeverity: Number(counts.high_severity)
    };
};

module.exports = { getDashboardData };