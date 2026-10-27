const express = require("express");
const router = express.Router();
const { getInspections, addInspection, editInspection, removeInspection } = require("../controllers/inspectionController");
const verifyToken = require("../middleware/verifyToken");
const allowRoles = require("../middleware/allowRoles");


// router.get("/", getInspections);
// router.post("/", addInspection);
// router.put("/:id", editInspection);
// router.delete("/:id", removeInspection);

// router.get("/", verifyToken, allowRoles("Manager"), getInspections);
router.get("/", verifyToken, allowRoles("Manager", "Inspector"), getInspections);
router.post("/", verifyToken, allowRoles("Manager"), addInspection);
// router.put("/:id", verifyToken, allowRoles("Manager"), editInspection);
router.delete("/:id", verifyToken, allowRoles("Manager"), removeInspection);
router.put("/:id", verifyToken, allowRoles("Manager", "Inspector"), editInspection);


module.exports = router;