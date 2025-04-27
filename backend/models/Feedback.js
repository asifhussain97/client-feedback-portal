const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String },
  comment: { type: String },
  adminReply: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
