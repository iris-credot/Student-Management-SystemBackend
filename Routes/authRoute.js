const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');


router.post('/login', authController.login_post);
router.post('/logout', authController.logout);

module.exports = router;
