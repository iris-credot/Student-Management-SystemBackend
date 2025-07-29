const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const auth = require('../Middleware/Authenticator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/register',upload.single('image'), userController.createUser);
router.get('/me/:id', auth.AuthJWT, userController.getUserById);
router.put('/me/:id', auth.AuthJWT,upload.single('image'), userController.updateUser);
router.put('/change-role/:id', auth.adminJWT, userController.changeRole);
router.post('/forgot', userController.ForgotPassword);
router.post('/verifyotp', userController.OTP);
router.get('/all' ,auth.adminJWT,userController.getAllUsers);
router.delete('/delete/:id',auth.adminJWT, userController.deleteUser);
router.put('/password', auth.AuthJWT,userController.updatePassword);
router.post('/resetpassword/:token', userController.ResetPassword);


module.exports = router;