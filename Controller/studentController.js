const User = require('../Models/userModel');
const asyncWrapper = require('../Middleware/async');

exports.getAllStudents = asyncWrapper(async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.getStudentById =asyncWrapper(async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.createStudent =asyncWrapper(async (req, res) => {
  try {
    const newStudent = await User.create({ ...req.body, role: 'student' });
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

exports.updateStudent =asyncWrapper(async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

exports.deleteStudent =asyncWrapper(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});