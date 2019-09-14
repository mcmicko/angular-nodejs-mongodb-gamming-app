const mongoose = require('mongoose');
const roles = require('../config/roles');
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema({
  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  userName: {
    type: String,
    unique: true,
    required: true,
    allowNull: false
  },

  email: {
    type: String,
    unique: true,
    allowNull: false
  },

  password: {
    type: String,
    required: true,
    allowNull: false
  },

  role: {
    type: Number,
    default: roles.user,
    required: true,
    allowNull: false
  },

  imagePath: {
    type: String
  },

  dateOfBirth: {
    type: Date,
  },

  hometown: {
    type: String,
  },

  country: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  secretToken: {
    type: String
  },

  dateOfRegistration: {
    type: Date,
    default: () => {
      return new Date();
    }
  },

  blockedUntil: {
    type: Date
  }
});

module.exports = User = mongoose.model('users', userSchema);
