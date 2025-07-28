const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
 
  fullName: { type: String }, 
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Please provide a valid email',
    },
  },
  phoneNumber: { type: String },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password must be at least 8 characters'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  username: { type: String }, 
  image: { type: String }, 
  address: { type: String },
  dateOfBirth: { type: Date },

  // Role: admin or student
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
  },

  // Student-specific fields
  course: { type: String }, 
  enrollmentYear: { type: Number }, 
  status: {
    type: String,
    enum: ['Active', 'Graduated', 'Dropped'],
    default: 'Active',
  },

  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: String },
}, { timestamps: true });


// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 📥 Static login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
};

const User = mongoose.model('User', userSchema);
module.exports = User;
