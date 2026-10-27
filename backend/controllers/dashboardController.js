const { getDashboardData } = require("../models/dashboardModel");

const dashboard = async (req, res) => {
    try {
        const data = await getDashboardData();
        res.json(data);
    } catch (error) {
        console.error("Dashboard request failed:", error);
        res.status(500).json({ message: "Unable to load dashboard data" });
    }
};

module.exports = { dashboard };