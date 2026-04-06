const User = require("../models/User");
const Task = require("../models/Task");

exports.getEmployees = async (req, res) => {
  const users = await User.find({ role: "employee" });
  res.json(users);
};

exports.approveUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isApproved: true });
  res.json("User approved");
};

exports.declineUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User declined and removed" });
};

exports.assignTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    assignedTo
  });

  await task.populate("assignedTo", "name email");

  res.json(task);
};

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
};
