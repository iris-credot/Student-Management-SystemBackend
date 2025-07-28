const express = require('express');
const router = express.Router();
const studentController = require('../Controller/studentController');
const auth = require('../Middleware/Authenticator');


router.use(auth.adminJWT);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
