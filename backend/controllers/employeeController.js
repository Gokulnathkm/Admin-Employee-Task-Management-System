const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { status } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(task);
};

