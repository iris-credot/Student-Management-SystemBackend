const express = require('express');
const router = express.Router();
const studentController = require('../Controller/studentController');
const auth = require('../Middleware/Authenticator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/active',auth.adminJWT, studentController.getActiveStudents);
router.get('/dropped',auth.adminJWT, studentController.getDroppedStudents);
router.get('/graduated',auth.adminJWT, studentController.getGraduatedStudents);
router.post('/',auth.adminJWT, studentController.createStudent);
router.get('/',auth.adminJWT, studentController.getAllStudents);
router.get('/one/:id',auth.adminJWT, studentController.getStudentById);

router.put('/:id',auth.adminJWT,upload.single('image'), studentController.updateUser);
router.delete('/:id',auth.adminJWT, studentController.deleteStudent);

module.exports = router;
