// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String
}, { collection: 'users' }); // phải đúng với Auth Service

module.exports = mongoose.model('User', userSchema);