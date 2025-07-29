const User = require('../Models/userModel');
const asyncWrapper = require('../Middleware/async');
const Badrequest=require('../Error/BadRequest');
const cloudinary =require('cloudinary');
const Notfound=require('../Error/NotFound');
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

exports.getAllStudents = asyncWrapper(async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.status(200).json(students);
});

exports.getStudentById = asyncWrapper(async (req, res) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }  res.status(200).json(student);
});

exports.createStudent = asyncWrapper(async (req, res) => {
  const newStudent = await User.create({ ...req.body, role: 'student' });
  res.status(201).json(newStudent);
});

exports.updateUser= asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    // Spread req.body into updateData to create a mutable copy
    const updateData = { ...req.body };

    // Check if a file is included in the request for upload
    if (req.file) {
        try {
            const images = `IMAGE_${Date.now()}`;
            const ImageCloudinary = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'EduTrack', // Your specified Cloudinary folder
                public_id: images
            });

            // --- FIX: Assign the returned URL to the 'image' field in updateData ---
            updateData.image = ImageCloudinary.secure_url;

        } catch (err) {
            // Log the detailed error and return a user-friendly message
            console.error('Error uploading image to Cloudinary:', err);
            return next(new Badrequest('Error uploading image. Please try again.'));
        }
    }

    // Now, updateData contains both text fields from req.body and the new image URL
    const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData, // The object now contains the image URL if uploaded
        {
            new: true, // Return the updated document
            runValidators: true // Ensure schema validations are run on update
        }
    );

    if (!updatedUser) {
        return next(new Notfound(`User not found with id: ${id}`));
    }

    res.status(200).json({ 
        message: 'User updated successfully', 
        user: updatedUser 
    });
});

exports.deleteStudent = asyncWrapper(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Student deleted successfully' });
});




exports.getActiveStudents = asyncWrapper(async (req, res) => {
  const activeStudents = await User.find({ role: 'student', status: 'Active' });
  res.status(200).json(activeStudents);
});

exports.getDroppedStudents = asyncWrapper(async (req, res) => {
  const droppedStudents = await User.find({ role: 'student', status: 'Dropped' });
  res.status(200).json(droppedStudents);
});

// CORRECTED: Relies on asyncWrapper for error handling
exports.getGraduatedStudents = asyncWrapper(async (req, res) => {
  const graduatedStudents = await User.find({ role: 'student', status: 'Graduated' });
  res.status(200).json(graduatedStudents);
});
