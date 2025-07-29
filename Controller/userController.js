const asyncWrapper = require('../Middleware/async');
const userModel= require('../Models/userModel');
const otpModel = require('../Models/otpModel'); 
const jwt = require('jsonwebtoken');
const Badrequest=require('../Error/BadRequest');
const cloudinary =require('cloudinary');
const Notfound=require('../Error/NotFound');
const bcrypt = require('bcryptjs');
const UnauthorizedError =require('../Error/Unauthorised');
const sendEmail = require('../Middleware/SendMailsMiddleware');
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

const userController ={
    
    getAllUsers: asyncWrapper(async (req, res,next) => {
        const users = await userModel.find({})
        res.status(200).json({ users })
      }),
    createUser: asyncWrapper(async (req, res, next) => {
  const {
    email,
    fullName,
    address,
    phoneNumber,
    dateOfBirth,
    password,
    gender
  } = req.body;

  const emaill = email.toLowerCase();
  const foundUser = await userModel.findOne({ email: emaill });
  if (foundUser) {
    return next(new Badrequest("Email already in use"));
  }

  const otp = Math.floor(Math.random() * 8000000);
  const otpExpirationDate = new Date(Date.now() + 5 * 60 * 1000);

  let imageUrl = ""; 
  if (req.file) {
    try {
      const images = `IMAGE_${Date.now()}`;
      const ImageCloudinary = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'EduTrack',
        public_id: images
      });
      imageUrl = ImageCloudinary.secure_url;
    } catch (err) {
      console.error('Error uploading image to Cloudinary:', err);
      return next(new Badrequest('Error uploading image to Cloudinary.'));
    }
  }

  const newUser = new userModel({
  
    fullName,  
    image: imageUrl, 
    address,
    phoneNumber,
    dateOfBirth,
    email: emaill,
    password,
    gender,
    otp: otp,
    otpExpires: otpExpirationDate,
  });

  const savedUser = await newUser.save();
 
  // Prepare email body
  const emailBody = `
    Welcome to EduTrack!

    Your OTP verification is: ${otp}

    This OTP is valid for 5 minutes.

    If you did not request this, please ignore this email.

    Best regards,
    EduTrack Team
  `;

  try {
    // Send OTP email
    await sendEmail(emaill, 'EduTrack:Verify your account', emailBody);
    console.log('Verification email sent successfully');
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError.message);
   
  }

  res.status(201).json({ user: savedUser, message: 'User created successfully, OTP sent to email' });

}),
    changeRole :asyncWrapper(async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}),
    getUserById: asyncWrapper(async (req, res, next) => {
        const { id } = req.params;
        const user = await userModel.findById(id);
    
      
    
        res.status(200).json({ user });
}),
    OTP: asyncWrapper(async(req,res,next) =>{
    
      const foundUser = await userModel.findOne({ otp: req.body.otp });
      if (!foundUser) {
          next(new UnauthorizedError('Authorization denied'));
      };
  
      // Checking if the otp is expired or not.
      console.log('otpExpires:', new Date(foundUser.otpExpires));
      console.log('Current time:', new Date());
      if (foundUser.otpExpires < new Date().getTime()) {
          next(new UnauthorizedError('OTP expired'));
      }
  
      // Updating the user to verified
      foundUser.verified = true;
      const savedUser = await foundUser.save();
  
      if (savedUser) {
          return res.status(201).json({
              message: "User account verified!",
              user: savedUser
          });
      
  }}),
    deleteUser: asyncWrapper(async (req, res, next) => {
      const { id: userID } = req.params;
      const user = await userModel.findOneAndDelete({ _id: userID })
     
      res.status(200).json({ user })
    }),
updateUser: asyncWrapper(async (req, res, next) => {
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
    const updatedUser = await userModel.findByIdAndUpdate(
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
}),
    ForgotPassword : asyncWrapper(async (req, res, next) => {
      const foundUser = await userModel.findOne({ email: req.body.email });
      if (!foundUser) {
        return next(new Notfound(`Your email is not registered`));
      }
      // Generate token
      const token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, { expiresIn: "15m" });
  
      // Recording the token to the database
      await otpModel.create({
          token: token,
          user: foundUser._id,
          expirationDate: new Date(Date.now() + 5 * 60 * 1000),
      });
  
      const link = `https://student-management-frontend-umber.vercel.app/resetPassword/${token}`;
      const emailBody = `Click on the link bellow to reset your password\n\n${link}`;
         
      await sendEmail(req.body.email, "EduTrack-Reset password", emailBody);
      
  
      res.status(200).json({
          message: "We sent you a reset password link on your email!",
          link:link
         
      });
     
  }),
    ResetPassword: asyncWrapper(async (req, res, next) => {
    const { newPassword, confirm } = req.body;
  const { token } = req.params;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (newPassword !== confirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
}),
    updatePassword : asyncWrapper(async (req, res, next) => {
 
 const { userId } = req;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide both current and new passwords." });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Check if the current password is correct
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect current password." });
  }

  // Set and save the new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully." });
})
}
module.exports = userController