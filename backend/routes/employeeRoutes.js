const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getTasks,
  updateTask
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/tasks", auth, getTasks);
router.put("/update-task/:id", auth, updateTask);

module.exports = router;

