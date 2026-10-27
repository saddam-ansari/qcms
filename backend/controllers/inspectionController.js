const { getAllInspections, createInspection, updateInspection, deleteInspection } = require("../models/inspectionModel");

// Get all inspections
const getInspections = async (req, res) => {
    try {
        const inspections = await getAllInspections();
        res.json(inspections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add inspection
const addInspection = async (req, res) => {
    try {
        const { product_name, inspector_name, inspection_date, status } = req.body;
        const inspection = await createInspection(product_name, inspector_name, inspection_date, status);
        res.status(201).json(inspection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update inspection
const editInspection = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, inspector_name, inspection_date, status } = req.body;

        const inspection = await updateInspection(id, product_name, inspector_name, inspection_date, status);
        if (!inspection) {
            return res.status(404).json({ message: "Inspection not found" });
        }
        res.json(inspection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete inspection
const removeInspection = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteInspection(id);
        res.json({ message: "Inspection deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getInspections, addInspection, editInspection, removeInspection };