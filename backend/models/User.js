const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'teamlead', 'mentor', 'admin'],
      default: 'student',
    },
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
    },
    regdNo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    department: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
