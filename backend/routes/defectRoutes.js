const express = require("express");
const router = express.Router();
const { getDefects, addDefect, editDefect, removeDefect } = require("../controllers/defectController");
const verifyToken = require("../middleware/verifyToken");
const allowRoles = require("../middleware/allowRoles");


// router.get("/", getDefects);
// router.post("/", addDefect);
// router.put("/:id", editDefect);
// router.delete("/:id", removeDefect);

router.get("/", verifyToken, allowRoles("Manager", "Inspector"), getDefects);
router.post("/", verifyToken, allowRoles("Manager", "Inspector"), addDefect);
router.put("/:id", verifyToken, allowRoles("Manager", "Inspector"), editDefect);
router.delete("/:id", verifyToken, allowRoles("Manager", "Inspector"), removeDefect);


module.exports = router;