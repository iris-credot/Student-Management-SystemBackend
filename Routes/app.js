const AuthRoute = require('./authRoute.js');
const UserRoute = require('./userRoute.js');
const StudentRoute = require('./studentRoute.js');


const express = require('express');

const Router= express.Router();
Router.use('/auth',AuthRoute);
Router.use('/users',UserRoute);
Router.use('/students',StudentRoute);




module.exports = Router;