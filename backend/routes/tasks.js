const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET /api/tasks  -> get tasks for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/tasks -> create task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.create({
    title,
    description,
    status: status || "todo",
    owner: req.user.id,
  });
  res.json(task);
});


// PUT /api/tasks/:id -> update task (only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.owner.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    const { title, description, status } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    const io = req.app.get('io');
    if (io) io.emit('task_updated', task);

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/tasks/:id -> delete task (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.owner.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    await task.remove();

    const io = req.app.get('io');
    if (io) io.emit('task_deleted', { id: req.params.id });

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
