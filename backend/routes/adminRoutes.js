const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  getEmployees,
  approveUser,
  declineUser,
  assignTask,
  getAllTasks
} = require("../controllers/adminController");

const router = express.Router();

router.get("/employees", auth, role("admin"), getEmployees);
router.put("/approve/:id", auth, role("admin"), approveUser);
router.delete("/decline/:id", auth, role("admin"), declineUser);
router.post("/assign-task", auth, role("admin"), assignTask);
router.get("/tasks", auth, role("admin"), getAllTasks);

module.exports = router;

