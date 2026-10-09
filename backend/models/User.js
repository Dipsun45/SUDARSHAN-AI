import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: '' },
  bio: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'English' },
  theme: { type: String, default: 'system' },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
