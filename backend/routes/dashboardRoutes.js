const express = require("express");
const router = express.Router();


const { dashboard } = require("../controllers/dashboardController");
const verifyToken = require("../middleware/verifyToken");
const allowRoles = require("../middleware/allowRoles");

router.get("/", verifyToken, allowRoles("Manager", "Inspector"), dashboard);

module.exports = router;