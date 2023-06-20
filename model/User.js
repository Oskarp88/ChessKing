const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: String,
  score: { type: Number, default: 0 },
  deleted: { type: Boolean, default: false },
  gamesWon: { type: Number, default: 0 },
  gamesLost: { type: Number, default: 0 },
  gamesTied: { type: Number, default: 0 },
  country: String,
  profileImage: String,
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);
