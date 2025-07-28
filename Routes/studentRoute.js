const express = require('express');
const router = express.Router();
const studentController = require('../Controller/studentController');
const auth = require('../Middleware/Authenticator');



router.get('/',auth.adminJWT, studentController.getAllStudents);
router.get('/:id',auth.adminJWT, studentController.getStudentById);
router.get('/active',auth.adminJWT, studentController.getActiveStudents);
router.get('/dropped',auth.adminJWT, studentController.getDroppedStudents);
router.get('/graduated',auth.adminJWT, studentController.getGraduatedStudents);
router.post('/',auth.adminJWT, studentController.createStudent);
router.put('/:id',auth.adminJWT, studentController.updateStudent);
router.delete('/:id',auth.adminJWT, studentController.deleteStudent);

module.exports = router;
