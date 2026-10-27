const { getAllDefects, createDefect, updateDefect, deleteDefect } = require("../models/defectModel");

// Get all defects
const getDefects = async (req, res) => {
    try {
        const defects = await getAllDefects();
        res.json(defects);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add defect
const addDefect = async (req, res) => {
    try {
        const { product_name, description, severity, status } = req.body;
        const defect = await createDefect(product_name, description, severity, status);
        res.status(201).json(defect);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update defect
const editDefect = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, description, severity, status } = req.body;
        const defect = await updateDefect(id, product_name, description, severity, status);
        res.json(defect);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete defect
const removeDefect = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteDefect(id);
        res.json({ message: "Defect deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getDefects, addDefect, editDefect, removeDefect };