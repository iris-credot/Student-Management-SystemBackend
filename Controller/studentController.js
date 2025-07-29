const User = require('../Models/userModel');
const asyncWrapper = require('../Middleware/async');


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
    const updateData = { ...req.body };

    // 1. Check if a new file was uploaded via multer.
    if (req.file) {
      try {
        // 2. If yes, upload this new file to Cloudinary.
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'Bistrou-Pulse', // Or your desired folder
          public_id: `PROFILE_${id}_${Date.now()}` // A unique public_id
        });

        // 3. IMPORTANT: Add the secure public URL from Cloudinary to our update data.
        updateData.image = result.secure_url;

      } catch (err) {
        console.error('Error uploading image to Cloudinary during update:', err);
        return next(new Badrequest('Error uploading new profile image.'));
      }
    }

    // 4. Find the user and update them with all the data 
    //    (text fields and potentially the new Cloudinary image URL).
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // Return the modified document
      runValidators: true // Run schema validators
    });

    if (!updatedUser) {
      return next(new Notfound(`User not found`));
    }

    // 5. Send the fully updated user object back to the frontend.
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
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
